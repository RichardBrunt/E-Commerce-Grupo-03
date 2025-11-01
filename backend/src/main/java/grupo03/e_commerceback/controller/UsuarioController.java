package grupo03.e_commerceback.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import grupo03.e_commerceback.dto.UsuarioDto;
import grupo03.e_commerceback.modelo.Usuarios;
import grupo03.e_commerceback.service.UsuarioService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioDto> registrar(@RequestBody UsuarioDto dto) {
        if (usuarioService.existeEmail(dto.email())) {
            return ResponseEntity.badRequest().build();
        }
        Usuarios u = new Usuarios();
        u.setNombre(dto.nombre());
        u.setEmail(dto.email());
        u.setPassword(dto.password());
        Usuarios guardado = usuarioService.guardar(u);
        return ResponseEntity.ok(toDto(guardado));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<UsuarioDto> login(@RequestBody UsuarioDto dto) {
        Optional<Usuarios> usuarioOpt = usuarioService.buscarPorEmail(dto.email());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Usuarios u = usuarioOpt.get();
        if (!u.getPassword().equals(dto.password())) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(toDto(u));
    }

    @PatchMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioDto> actualizar(@PathVariable Long id, @RequestBody UsuarioDto dto) {
        Optional<Usuarios> usuarioOpt = usuarioService.buscarPorEmail(dto.email());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Usuarios u = usuarioOpt.get();
        if (dto.nombre() != null) {
            u.setNombre(dto.nombre());
        }
        if (dto.email() != null) {
            u.setEmail(dto.email());
        }
        if (dto.password() != null) {
            u.setPassword(dto.password());
        }
        Usuarios actualizado = usuarioService.guardar(u);
        return ResponseEntity.ok(toDto(actualizado));
    }

    private UsuarioDto toDto(Usuarios u) {
        return new UsuarioDto(u.getId_Usuarios(), u.getNombre(), u.getEmail(), null);
    }
}
