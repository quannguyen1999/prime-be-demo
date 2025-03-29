package com.prime;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(

		info = @Info(
				title = "Project Service Documentation",
				description = "Api for Project Service",
				version = "v1",
				contact = @Contact(
						name = "Quan Nguyen",
						email = "nguyendanganhquan99@gmail.com",
						url = "none"
				)
		)
)
public class ProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjectApplication.class, args);
	}

}
