package grupo03.e_commerceback.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import grupo03.e_commerceback.dto.ItemPedidoDto;
import grupo03.e_commerceback.dto.PedidoDto;
import grupo03.e_commerceback.modelo.ItemsPedido;
import grupo03.e_commerceback.modelo.Pedidos;
import grupo03.e_commerceback.service.PedidoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<PedidoDto>> listarPorUsuario(@PathVariable Long usuarioId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Pedidos> result = pedidoService.listarPorUsuario(usuarioId, pageable);
        return ResponseEntity.ok(result.map(this::toDtoSinItems));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDto> detalle(@PathVariable Long id) {
        return pedidoService.obtenerDetalle(id)
                .map(this::toDtoSinItems)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @SuppressWarnings("unchecked")
    @GetMapping("/{id}/items")
    public ResponseEntity<List<ItemPedidoDto>> items(@PathVariable Long id) {
        List<ItemsPedido> items = (List<ItemsPedido>) pedidoService.listarItems(id);
        List<ItemPedidoDto> dtos = items.stream().map(this::toItemDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private PedidoDto toDtoSinItems(Pedidos p) {
        Long usuarioId = (p.getUsuario() != null) ? p.getUsuario().getId_Usuarios() : null;
        Long direccionId = (p.getDireccion() != null) ? p.getDireccion().getId_Direccion() : null;
        Long carritoId = (p.getCarrito() != null) ? p.getCarrito().getId_carrito() : null;
        String estado = (p.getEstado_Pedido() != null) ? p.getEstado_Pedido().name() : null;
        return new PedidoDto(p.getId_Pedidos(), usuarioId, direccionId, carritoId, estado, p.getTotal(), List.of());
    }

    private ItemPedidoDto toItemDto(ItemsPedido i) {
        Long productoId = (i.getProducto() != null) ? i.getProducto().getIdProducto() : null;
        Long modeloId = (i.getModelo() != null) ? i.getModelo().getIdModelo() : null;
        return new ItemPedidoDto(i.getIdItemPedido(), productoId, modeloId, i.getCantidad(), i.getPrecio());
    }
}
