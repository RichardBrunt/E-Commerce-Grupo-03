package config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Data;

@Data
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    /** Clave secreta Base64 para firmar JWT (HS256). */
    private String secret;
    /** Tiempo de vida del token de acceso en milisegundos. */
    private long access;
}
