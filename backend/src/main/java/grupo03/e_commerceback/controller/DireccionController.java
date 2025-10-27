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
import org.springframework.web.bind.annotation.RestController;

import grupo03.e_commerceback.dto.DireccionDto;
import grupo03.e_commerceback.modelo.Direccion;
import grupo03.e_commerceback.modelo.Usuarios;
import grupo03.e_commerceback.service.DireccionService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class DireccionController {

    private final DireccionService direccionService;

    @GetMapping("/usuarios/{usuarioId}/direcciones")
    public ResponseEntity<List<DireccionDto>> listar(@PathVariable Long usuarioId) {
        List<DireccionDto> dtos = direccionService.listarPorUsuario(usuarioId)
                .stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/direcciones")
    public ResponseEntity<DireccionDto> crear(@RequestBody DireccionDto dto) {
        Direccion dir = new Direccion();
        Usuarios u = new Usuarios();
        u.setId_Usuarios(dto.usuarioId());
        dir.setId_Usuario(u);
        dir.setCalle(dto.calle());
        dir.setAltura(dto.altura());
        dir.setCiudad(dto.ciudad());
        dir.setCodigo_Postal(dto.codigoPostal());
        dir.setPais(dto.pais());
        dir.setProvincia(dto.provincia());
        Direccion guardada = direccionService.guardar(dir);
        return ResponseEntity.ok(toDto(guardada));
    }

    @DeleteMapping("/direcciones/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        direccionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    private DireccionDto toDto(Direccion d) {
        Long usuarioId = (d.getId_Usuario() != null) ? d.getId_Usuario().getId_Usuarios() : null;
        return new DireccionDto(d.getId_Direccion(), usuarioId, d.getCalle(), d.getAltura(), d.getCiudad(),
                d.getCodigo_Postal(), d.getPais(), d.getProvincia());
    }
}
