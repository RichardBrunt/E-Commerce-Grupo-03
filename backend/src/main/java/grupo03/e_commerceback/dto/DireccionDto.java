package grupo03.e_commerceback.dto;

public record DireccionDto(
        Long id,
        Long usuarioId,
        String calle,
        Integer altura,
        String ciudad,
        String codigoPostal,
        String pais,
        String provincia
) {}
