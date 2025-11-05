package dto;

import modelo.Producto;
import lombok.Builder; import lombok.Value;

@Value @Builder
public class ProductoDto {
    Long idProducto;
    String nombreProducto;
    String descripcion;
    Double precio;
    Integer stock;
    Long categoriaId;
    Long modeloId;
    String imagenUrl;

    public static ProductoDto from(Producto p) {
        return ProductoDto.builder()
                .idProducto(p.getIdProducto())
                .nombreProducto(p.getNombreProducto())
                .descripcion(p.getDescripcion())
                .precio(p.getPrecio())
                .stock(p.getStock())
                .categoriaId(p.getCategoria() != null ? p.getCategoria().getIdCategoria() : null)
                .modeloId(p.getModelo() != null ? p.getModelo().getIdModelo() : null)
                .imagenUrl(p.getImagenUrl())
                .build();
    }
}
