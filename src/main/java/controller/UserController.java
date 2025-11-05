package controller;

import java.net.URI;
import java.util.Objects;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import dto.DireccionDto;
import dto.DireccionUpsertRequest;
import dto.UsuarioDto;
import modelo.Direccion;
import modelo.Usuarios;
import repository.DireccionRepository;
import repository.UsuarioRepository;
import jakarta.validation.Valid;

/**
 * Endpoints del usuario autenticado (JWT requerido):
 * - GET/PUT /api/users/me
 * - CRUD /api/users/me/addresses
 */
@RestController
@RequestMapping("/api/users/me")
@Validated
public class UserController {

    private final UsuarioRepository usuarioRepository;
    private final DireccionRepository direccionRepository;

    public UserController(UsuarioRepository usuarioRepository, DireccionRepository direccionRepository) {
        this.usuarioRepository = usuarioRepository;
        this.direccionRepository = direccionRepository;
    }

        @GetMapping
    public ResponseEntity<UsuarioDto> me(Authentication auth) {
        Usuarios u = usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        return ResponseEntity.ok(UsuarioDto.from(u));
    }

        @PutMapping
        public ResponseEntity<UsuarioDto> updateMe(
                Authentication auth,
                @RequestParam(value = "nombre", required = false) String nombreQueryParam,
                @RequestBody(required = false) java.util.Map<String, Object> body) {
            Usuarios u = usuarioRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

            String nombre = nombreQueryParam;
            if (nombre == null && body != null) {
                Object v = body.get("nombre");
                if (v != null) nombre = String.valueOf(v);
            }
            if (nombre == null || nombre.isBlank()) {
                throw new IllegalArgumentException("El nombre es requerido");
            }

            u.setNombre(nombre);
            usuarioRepository.save(u);
            return ResponseEntity.ok(UsuarioDto.from(u));
        }

    @GetMapping("/addresses")
    public ResponseEntity<List<DireccionDto>> listAddresses(Authentication auth) {
        Usuarios u = usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        var list = direccionRepository.findByUsuario_IdUsuario(u.getIdUsuario())
                .stream().map(DireccionDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/addresses")
    public ResponseEntity<DireccionDto> createAddress(Authentication auth, @Valid @RequestBody DireccionUpsertRequest req) {
        Usuarios u = usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        Direccion d = new Direccion();
        d.setUsuario(u);
        d.setCalle(req.getCalle());
        d.setAltura(req.getAltura());
        d.setCiudad(req.getCiudad());
        d.setCodigoPostal(req.getCodigoPostal());
        d.setPais(req.getPais());
        d.setProvincia(req.getProvincia());
    direccionRepository.save(d);
    URI location = Objects.requireNonNull(URI.create("/api/users/me/addresses/" + d.getIdDireccion()));
    return ResponseEntity.created(location)
                .body(DireccionDto.from(d));
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<DireccionDto> updateAddress(Authentication auth, @PathVariable long id, @Valid @RequestBody DireccionUpsertRequest req) {
        Usuarios u = usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        Direccion d = direccionRepository.findByIdDireccionAndUsuario_IdUsuario(id, u.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Dirección no encontrada"));
        d.setCalle(req.getCalle());
        d.setAltura(req.getAltura());
        d.setCiudad(req.getCiudad());
        d.setCodigoPostal(req.getCodigoPostal());
        d.setPais(req.getPais());
        d.setProvincia(req.getProvincia());
    direccionRepository.save(Objects.requireNonNull(d));
        return ResponseEntity.ok(DireccionDto.from(d));
    }

        @DeleteMapping("/addresses/{id}")
    public ResponseEntity<Void> deleteAddress(Authentication auth, @PathVariable long id) {
        Usuarios u = usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        Direccion d = direccionRepository.findByIdDireccionAndUsuario_IdUsuario(id, u.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Dirección no encontrada"));
    direccionRepository.delete(Objects.requireNonNull(d));
        return ResponseEntity.noContent().build();
    }
}
