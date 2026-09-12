package com.example.DigitalSubsidy.Config;

import com.example.DigitalSubsidy.entity.AuthUser;
import com.example.DigitalSubsidy.repository.AuthUserRepo;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(request -> {

                            CorsConfiguration configuration =
                                    new CorsConfiguration();

                            configuration.setAllowedOrigins(
                                    List.of("http://localhost:63342")
                            );

                            configuration.setAllowedMethods(
                                    List.of(
                                            "GET",
                                            "POST",
                                            "PUT",
                                            "DELETE",
                                            "OPTIONS"
                                    )
                            );

                            configuration.setAllowedHeaders(
                                    List.of("*")
                            );

                            configuration.setAllowCredentials(true);

                            return configuration;
                        })

                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/auth/login",
                                "/staff/login"
                        ).permitAll()

                        .requestMatchers(
                                "/applications/**",
                                "/documents/**"
                        ).permitAll()

                        .anyRequest().permitAll()
                );

        return http.build();
    }
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    @Bean
    public UserDetailsService userDetailsService(AuthUserRepo repo) {

        return email -> {
            AuthUser user = repo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPassword())
                    .roles(user.getRole())
                    .build();
        };
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:63342")
        );

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}