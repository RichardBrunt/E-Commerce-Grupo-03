package dto;

import jakarta.validation.constraints.*;
import lombok.Getter; import lombok.Setter;

@Getter @Setter
public class ProductoUpsertRequest {
    @NotBlank private String nombreProducto;
    private String descripcion;
    @NotNull @DecimalMin("0.0") private Double precio;
    @NotNull @Min(0) private Integer stock;
    @NotNull private Long categoriaId;
    @NotNull private Long modeloId;
    private String imagenUrl; // opcional
}
