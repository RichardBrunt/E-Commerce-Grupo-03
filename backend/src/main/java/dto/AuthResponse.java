package dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Respuesta de auth: incluye el token JWT.
 */
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
}
