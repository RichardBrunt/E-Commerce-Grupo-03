package grupo03.e_commerceback.modelo;

import lombok.Data;
import jakarta.persistence.*;


@Data
@Entity
@Table(name = "items_pedido")
public class ItemsPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item_pedido")
    private Long idItemPedido;

    // FK many-to-one: id_pedido
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedidos pedido;


    // FK many-to-one: id_producto
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private productos producto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modelo", nullable = true)
    private modelos modelo;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "precio", nullable = false)
    private Double precio;


}
