package com.prime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

/**
 * API Gateway Application using Spring Cloud Gateway.
 * Routes requests to appropriate microservices.
 */
@SpringBootApplication
public class GatewayApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}

	/**
	 * Configures routing for the API Gateway.
	 * This method defines routes for user and project services using path-based routing.
	 *
	 * @param routeLocatorBuilder The route builder.
	 * @return Configured {@link RouteLocator}.
	 */
	@Bean
	public RouteLocator routeConfig(RouteLocatorBuilder routeLocatorBuilder) {
		return routeLocatorBuilder.routes()
				// Route for User Service
				.route(p -> p
						.path("/userService/**") // Matches requests starting with "/userService/"
						.filters(f -> f.rewritePath("/userService/(?<segment>.*)", "/${segment}") // Removes the prefix before forwarding
								.addResponseHeader("X-Response-Time", LocalDateTime.now().toString()) // Adds a custom response header
						)
						.uri("lb://PRIME-USER-SERVICE")) // Load balances to PRIME-USER-SERVICE

				// Route for Project Service
				.route(p -> p
						.path("/projectService/**") // Matches requests starting with "/projectService/"
						.filters(f -> f.rewritePath("/projectService/(?<segment>.*)", "/${segment}") // Removes the prefix before forwarding
								.addResponseHeader("X-Response-Time", LocalDateTime.now().toString()) // Adds a custom response header
						)
						.uri("lb://PRIME-USER-PROJECT")) // Load balances to PRIME-USER-PROJECT
				.build();
	}
}
