package grupo03.e_commerceback.dto;

import java.util.List;

public record PedidoDto(
        Long id,
        Long usuarioId,
        Long direccionId,
        Long carritoId,
        String estado,
        Integer total,
        List<ItemPedidoDto> items
) {}
