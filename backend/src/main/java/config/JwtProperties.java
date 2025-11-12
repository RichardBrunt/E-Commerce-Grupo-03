package config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@Data
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    // commit-marker: no functional change - added for git commit tracking 2025-11-12
    /** Clave secreta codificada en Base64 para firmar los JWT (algoritmo HS256). */
    private String secret;

    /** Duración del token de acceso (por ejemplo: 15m, 1h). */
    private Duration access;
}