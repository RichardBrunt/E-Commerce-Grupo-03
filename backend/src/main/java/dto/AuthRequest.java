package dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO para login: email + password
 */
@Data
public class AuthRequest {
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String password;
}
