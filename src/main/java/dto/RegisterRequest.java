package dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO para registro de usuario nuevo (rol USER por defecto).
 */
@Data
public class RegisterRequest {
    @NotBlank
    @Size(max = 100)
    private String nombre;
    @Email
    @NotBlank
    private String email;
    @NotBlank
    @Size(min = 6)
    private String password;
}
