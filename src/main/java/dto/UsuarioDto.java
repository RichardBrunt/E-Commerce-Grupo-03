package dto;

import modelo.Usuarios;
import lombok.Data;

/**
 * DTO de salida para datos del usuario (oculta password y otros detalles).
 */
@Data
public class UsuarioDto {
    private Long idUsuario;
    private String nombre;
    private String email;

    public static UsuarioDto from(Usuarios u) {
        UsuarioDto d = new UsuarioDto();
        d.setIdUsuario(u.getIdUsuario());
        d.setNombre(u.getNombre());
        d.setEmail(u.getEmail());
        return d;
    }
}
