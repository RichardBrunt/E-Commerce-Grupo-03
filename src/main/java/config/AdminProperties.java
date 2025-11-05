package config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Data;

@Data
@ConfigurationProperties(prefix = "admin")
public class AdminProperties {
    /** Email del usuario administrador inicial. */
    private String email;
    /** Password del usuario administrador inicial. */
    private String password;
}
