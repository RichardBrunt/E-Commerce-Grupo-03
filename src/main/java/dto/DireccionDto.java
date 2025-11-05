package dto;

import modelo.Direccion;
import lombok.Data;

/**
 * DTO de lectura para direcciones del usuario.
 */
@Data
public class DireccionDto {
    private Long idDireccion;
    private String calle;
    private int altura;
    private String ciudad;
    private String codigoPostal;
    private String pais;
    private String provincia;

    public static DireccionDto from(Direccion d) {
        DireccionDto dto = new DireccionDto();
        dto.setIdDireccion(d.getIdDireccion());
        dto.setCalle(d.getCalle());
        dto.setAltura(d.getAltura());
        dto.setCiudad(d.getCiudad());
        dto.setCodigoPostal(d.getCodigoPostal());
        dto.setPais(d.getPais());
        dto.setProvincia(d.getProvincia());
        return dto;
    }
}
