package config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Data;

@Data
@ConfigurationProperties(prefix = "admin")
public class AdminProperties {
    // commit-marker: no functional change - added for git commit tracking 2025-11-12
    /** Dirección de correo electrónico del administrador inicial. */
    private String email;

    /** Contraseña del administrador inicial. */
    private String password;
}
