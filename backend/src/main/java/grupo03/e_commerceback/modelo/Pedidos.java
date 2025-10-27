package grupo03.e_commerceback.modelo;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "pedidos")
public class Pedidos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Long id_Pedidos;

    // FK a usuarios (ya discutido)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuarios usuario;

    // FK many-to-one: id_direccion
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_direccion", nullable = false)
    private Direccion direccion;

    // FK one-to-one: id_carrito (Pedidos es owning side)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_carrito", unique = true)
    private carritos carrito;
    


    @Enumerated(EnumType.STRING)
    @Column(name = "estado_pedido", length = 16, nullable = false)
    private EstadoPedido estado_Pedido;

    @Column(name = "total", nullable = false)
    private Integer total;

    

    public enum EstadoPedido {
        PENDIENTE,
        EN_PROCESO,
        ENVIADO,
    }
    
}

