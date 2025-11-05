package dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO de escritura para crear/actualizar direcciones.
 */
@Data
public class DireccionUpsertRequest {
    @NotBlank
    @Size(max = 100)
    private String calle;

    @Min(1)
    private int altura;

    @NotBlank
    @Size(max = 50)
    private String ciudad;

    @NotBlank
    @Size(max = 10)
    private String codigoPostal;

    @NotBlank
    @Size(max = 50)
    private String pais;

    @NotBlank
    @Size(max = 50)
    private String provincia;
}
