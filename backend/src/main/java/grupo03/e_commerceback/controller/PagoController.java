package grupo03.e_commerceback.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import grupo03.e_commerceback.dto.PagoDto;
import grupo03.e_commerceback.modelo.Pagos;
import grupo03.e_commerceback.modelo.Usuarios;
import grupo03.e_commerceback.service.PagoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PagoController {

    private final PagoService pagoService;

    @GetMapping("/usuarios/{usuarioId}/pagos")
    public ResponseEntity<List<PagoDto>> listar(@PathVariable Long usuarioId) {
        List<PagoDto> dtos = pagoService.listarPorUsuario(usuarioId)
                .stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/pagos/by-referencia")
    public ResponseEntity<PagoDto> porReferencia(@RequestParam String ref) {
        return pagoService.buscarPorReferencia(ref)
                .map(this::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/pagos")
    public ResponseEntity<PagoDto> crear(@RequestBody PagoDto dto) {
        Pagos p = new Pagos();
        Usuarios u = new Usuarios();
        u.setId_Usuarios(dto.usuarioId());
        p.setUsuario(u);
        p.setReferencia(dto.referencia());
        p.setEstado_Pedido(Pagos.EstadoPedido.valueOf(dto.estado()));
        p.setMonto_Total(dto.monto());
        Pagos guardado = pagoService.guardar(p);
        return ResponseEntity.ok(toDto(guardado));
    }

    @DeleteMapping("/pagos/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pagoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    private PagoDto toDto(Pagos p) {
        Long usuarioId = (p.getUsuario() != null) ? p.getUsuario().getId_Usuarios() : null;
        String estado = (p.getEstado_Pedido() != null) ? p.getEstado_Pedido().name() : null;
        return new PagoDto(p.getId_Pagos(), usuarioId, p.getReferencia(), estado, p.getMonto_Total());
    }
}
