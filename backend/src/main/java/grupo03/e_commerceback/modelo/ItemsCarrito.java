package grupo03.e_commerceback.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;



@Data
@Entity
@Table(name = "items_carrito")
public class ItemsCarrito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item_carrito")
    private Long id_ItemCarrito;

    @ManyToOne
    @JoinColumn(name = "id_carrito")
    private carritos id_Carritos;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private productos id_Productos;

    @Column(name = "cantidad", nullable = false)
    private int cantidad;

}