package dto;

/**
 * DTO de entrada para actualizar el perfil del usuario autenticado.
 * Todos los campos son opcionales; se actualizan sólo los provistos.
 */
public record UsuarioUpdateRequest(
    String usuario,
    String nombre,
    String apellido,
    String email,
    String avatar
) {}
