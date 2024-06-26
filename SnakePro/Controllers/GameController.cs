﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebApplication2.GameClasses;
using WebApplication2.GameClasses.Enums;
using WebApplication2.hubs;

namespace WebApplication2.Controllers;

/// <summary>
/// Controller for managing game operations.
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class GameController(IHubContext<SnakeGameHub> hubContext) : ControllerBase
{
    /// <summary>
    /// This method is responsible for starting a new game.
    /// </summary>
    /// <param name="startGameRequest">An instance of StartGameRequest which contains the number of columns and rows for the game board.</param>
    /// <returns>Returns an IActionResult indicating the result of the operation.</returns>
    [HttpPost("Start")]
    public IActionResult StartGame([FromBody] StartGameRequest startGameRequest)
    {
        // Check if a game instance already exists
        if (GameExecution.Instance.GameState!=null && GameExecution.Instance.GameState != GameStates.None)
        {
            // If a game instance exists, stop the current game
            GameExecution.Instance.StopGame();
        }
      
        // Start a new instance of the game with the specified number of columns and rows
        GameExecution.Instance.StartGame(startGameRequest.Columns, startGameRequest.Rows, hubContext);

        // Return a success status
        return Ok();
    }

    /// <summary>
    /// Sets the movement direction of the snake.
    /// </summary>
    /// <param name="key">The key representing the movement direction.</param>
    /// <returns>An IActionResult indicating the result of the operation.</returns>
    [HttpPost("SetMovement")]
    public IActionResult SetMovement([FromBody] string key)
    {
        var currentMovement = GameExecution.Instance?.GetCurrentMovement();
        var chosenMovement = key switch
        {
            "ArrowUp" => Movements.Up,
            "ArrowDown" => Movements.Down,
            "ArrowLeft" => Movements.Left,
            "ArrowRight" => Movements.Right,
            _ => GameExecution.Instance?.GetCurrentMovement()
        };
        // Check if the chosen movement is the opposite of the current movement
        if ((currentMovement == Movements.Up && chosenMovement == Movements.Down) ||
            (currentMovement == Movements.Down && chosenMovement == Movements.Up) ||
            (currentMovement == Movements.Left && chosenMovement == Movements.Right) ||
            (currentMovement == Movements.Right && chosenMovement == Movements.Left))
        {
            return BadRequest("Invalid movement");
        }

        if (GameExecution.Instance?.GameState != GameStates.None)
        {
            GameExecution.Instance?.ChangeCurrentMovement(chosenMovement);
        }

        return Ok();
    }

    /// <summary>
    /// Pauses the game.
    /// </summary>
    /// <returns>An IActionResult indicating the result of the operation.</returns>
    [HttpPost("PauseGame")]
    public IActionResult PauseGame()
    {
        var currentGameState = GameExecution.Instance?.GameState;
        if (currentGameState == GameStates.Running)
        {
            if (GameExecution.Instance != null) GameExecution.Instance.PauseGame();
        }
        else
        {
            return BadRequest("Game is not running");
        }

        return Ok();
    }

    /// <summary>
    /// Resumes the game.
    /// </summary>
    /// <returns>An IActionResult indicating the result of the operation.</returns>
    [HttpPost("ResumeGame")]
    public IActionResult ResumeGame()
    {
        var currentGameState = GameExecution.Instance?.GameState;
        if (currentGameState == GameStates.Paused)
        {
            if (GameExecution.Instance != null) GameExecution.Instance.ResumeGame();
        }
        else
        {
            return BadRequest("Game is not paused");
        }

        return Ok();
    }
}

/// <summary>
/// Represents a request to start a new game.
/// </summary>
public class StartGameRequest
{
    /// <summary>
    /// Gets or sets the number of columns for the game board.
    /// </summary>
    public int Columns { get; set; }

    /// <summary>
    /// Gets or sets the number of rows for the game board.
    /// </summary>
    public int Rows { get; set; }
}