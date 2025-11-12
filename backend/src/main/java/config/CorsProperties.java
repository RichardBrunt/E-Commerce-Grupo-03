package config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;
import java.util.List;

@Data
@ConfigurationProperties(prefix = "cors")
public class CorsProperties {
    // commit-marker: no functional change - added for git commit tracking 2025-11-12
    /** Orígenes permitidos para solicitudes CORS (ej. https://miapp.com). */
    private List<String> allowedOrigins;

    /** Métodos HTTP permitidos (ej. GET, POST, PUT, DELETE). */
    private List<String> allowedMethods;

    /** Encabezados permitidos en la solicitud. */
    private List<String> allowedHeaders;

    /** Encabezados expuestos en la respuesta. */
    private List<String> exposedHeaders;

    /** Si se permiten credenciales (cookies, auth headers). */
    private boolean allowCredentials = false;

    /** Tiempo máximo que se puede cachear la respuesta CORS. */
    private Duration maxAge = Duration.ofHours(1);
}
