package grupo03.e_commerceback.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;


@Data
@Entity
@Table(name = "carritos")
public class carritos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_carrito")
    private Long id_carrito;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuarios id_usuario;

    @Column(name = "estado_carrito", nullable = false, length = 16)
    private String estado_carrito;


}
