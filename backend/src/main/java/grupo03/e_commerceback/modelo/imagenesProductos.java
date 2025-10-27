package grupo03.e_commerceback.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "imagenes_productos")
public class imagenesProductos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_imagen_producto")
    private Long idImagenProducto;

    @Column(name = "url_imagen", nullable = false, length = 255)
    private String urlImagen;

    // FK many-to-one: id_producto
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private productos producto;
    
}
