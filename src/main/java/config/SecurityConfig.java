package config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import security.JwtFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    /**
     * Cadena de filtros de seguridad:
     * - Stateless (sin sesiones)
     * - GET de catálogo públicos
     * - /api/auth/** público para registrar/login
     * - Mutaciones de catálogo restringidas a rol ADMIN vía JWT
     * - Resto autenticado
     */
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(e -> e
                // 401 cuando no hay autenticación (sin token o token inválido)
                .authenticationEntryPoint((req, res, ex) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED))
                // 403 cuando hay autenticación pero falta rol/permiso
                .accessDeniedHandler((req, res, ex) -> res.sendError(HttpServletResponse.SC_FORBIDDEN))
            )
            .authorizeHttpRequests(auth -> auth
                // Catálogo público: permitir solo GET sin autenticación
                .requestMatchers(HttpMethod.GET, "/api/categorias", "/api/categorias/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/productos", "/api/productos/**").permitAll()
                // Autenticación pública
                .requestMatchers("/api/auth/**").permitAll()
                // Usuarios: JWT requerido con rol USER o ADMIN
                .requestMatchers("/api/users/**").hasAnyRole("USER", "ADMIN")
                // Mutaciones requieren ADMIN
                .requestMatchers(HttpMethod.POST, "/api/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasRole("ADMIN")
                // Resto autenticado
                .anyRequest().authenticated()
            );

        // Registrar filtro JWT
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        // Encoder para contraseñas de usuarios (BCrypt como en clase)
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(config.CorsProperties props) {
        CorsConfiguration cfg = new CorsConfiguration();
        if (props.getAllowedOrigins() != null) cfg.setAllowedOrigins(props.getAllowedOrigins());
        if (props.getAllowedMethods() != null) cfg.setAllowedMethods(props.getAllowedMethods());
        if (props.getAllowedHeaders() != null) cfg.setAllowedHeaders(props.getAllowedHeaders());
        if (props.getExposedHeaders() != null) cfg.setExposedHeaders(props.getExposedHeaders());
        cfg.setAllowCredentials(props.isAllowCredentials());
        cfg.setMaxAge(props.getMaxAge());
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
