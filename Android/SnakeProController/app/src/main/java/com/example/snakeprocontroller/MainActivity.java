package com.example.snakeprocontroller;

import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.Toast;
import android.graphics.Color;
import androidx.appcompat.app.AppCompatActivity;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MainActivity extends AppCompatActivity {

    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
        loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(loggingInterceptor)
                .build();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://192.168.1.130:5273/")
                .addConverterFactory(GsonConverterFactory.create())
                .client(client)
                .build();

        apiService = retrofit.create(ApiService.class);

        Button buttonUp = findViewById(R.id.button_up);
        Button buttonDown = findViewById(R.id.button_down);
        Button buttonLeft = findViewById(R.id.button_left);
        Button buttonRight = findViewById(R.id.button_right);
        Button buttonPlay = findViewById(R.id.button_play);
        Button buttonPause = findViewById(R.id.button_pause);

        buttonPlay.setShadowLayer(1, -1, -1, Color.BLACK);
        buttonPlay.setTextColor(Color.WHITE);


        buttonPause.setShadowLayer(1, -1, -1, Color.BLACK);
        buttonPause.setTextColor(Color.WHITE);

        buttonUp.setOnClickListener(view -> sendMovement("ArrowUp"));
        buttonDown.setOnClickListener(view -> sendMovement("ArrowDown"));
        buttonLeft.setOnClickListener(view -> sendMovement("ArrowLeft"));
        buttonRight.setOnClickListener(view -> sendMovement("ArrowRight"));
    }

    private void sendMovement(String key) {
        Call<Void> call = apiService.setMovement(key);
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(MainActivity.this, "Movimiento enviado con éxito", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(MainActivity.this, "Error en el envío del movimiento", Toast.LENGTH_SHORT).show();
                    Log.e("API_ERROR", "Error: " + response.code() + " " + response.message());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(MainActivity.this, "Error en la solicitud: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("API_ERROR", "Error: " + t.getMessage(), t);
            }
        });
    }
}
