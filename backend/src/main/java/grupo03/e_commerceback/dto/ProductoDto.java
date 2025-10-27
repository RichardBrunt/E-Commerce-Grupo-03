package grupo03.e_commerceback.dto;

public record ProductoDto(
        Long idProducto,
        String nombreProducto,
        String descripcion,
        Double precio,
        Integer stock,
        String imagenUrl,
        Long categoriaId,
        Long modeloId
) {}
