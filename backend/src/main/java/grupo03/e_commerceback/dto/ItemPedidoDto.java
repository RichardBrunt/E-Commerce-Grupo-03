package grupo03.e_commerceback.dto;

public record ItemPedidoDto(
        Long idItem,
        Long productoId,
        Long modeloId,
        Integer cantidad,
        Double precio
) {}
