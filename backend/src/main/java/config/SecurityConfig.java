package config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import security.JwtFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // commit-marker: no functional change - added for git commit tracking 2025-11-12

    private static final String[] PUBLIC_GET_ENDPOINTS = {
        "/api/categorias", "/api/categorias/**",
        "/api/productos", "/api/productos/**"
    };

    private static final String[] PUBLIC_ENDPOINTS = {
        "/api/auth/**", "/actuator/**"
    };

    private static final String[] ADMIN_MUTATIONS = {
        "/api/categorias/**", "/api/productos/**"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(e -> e
                .authenticationEntryPoint((req, res, ex) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED))
                .accessDeniedHandler((req, res, ex) -> res.sendError(HttpServletResponse.SC_FORBIDDEN))
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.GET, PUBLIC_GET_ENDPOINTS).permitAll()
                .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                .requestMatchers("/api/users/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.POST, ADMIN_MUTATIONS).hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, ADMIN_MUTATIONS).hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, ADMIN_MUTATIONS).hasRole("ADMIN")
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(config.CorsProperties props) {
        CorsConfiguration cfg = buildCorsConfig(props);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    private CorsConfiguration buildCorsConfig(config.CorsProperties props) {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(props.getAllowedOrigins());
        cfg.setAllowedMethods(props.getAllowedMethods());
        cfg.setAllowedHeaders(props.getAllowedHeaders());
        cfg.setExposedHeaders(props.getExposedHeaders());
        cfg.setAllowCredentials(props.isAllowCredentials());
        cfg.setMaxAge(props.getMaxAge());
        return cfg;
    }
}
