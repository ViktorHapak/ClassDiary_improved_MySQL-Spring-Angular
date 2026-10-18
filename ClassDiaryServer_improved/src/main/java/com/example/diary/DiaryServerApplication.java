package com.example.diary;


import com.example.diary.models.User;
import com.example.diary.repositories.UserRepository;
import com.example.diary.services.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.ssl.SslProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@SpringBootApplication
public class DiaryServerApplication {


	public static void main(String[] args) throws IOException {
		SpringApplication.run(DiaryServerApplication.class, args);
		SpringApplication app = new SpringApplication(DiaryServerApplication.class);
		app.setAdditionalProfiles();
		app.run(args);
	}

	@Bean
	public ModelMapper modelMapper(){
		return new ModelMapper();
	}

	/*@Bean
	public ObjectMapper objectMapper(){ return new ObjectMapper(); }*/



}
