package grupo03.e_commerceback.modelo;

import lombok.Data;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Data
@Entity
@Table(name = "Pagos")
public class Pagos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_Pagos;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_Usuarios", nullable = false)
    private Usuarios usuario;

    @Column(nullable = false)
    private long proveedor;

    @Column(nullable = false)
    private String referencia;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_pedido", nullable = false)
    private EstadoPedido estado_Pedido;

    @Column(name = "monto_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal Monto_Total;

    public enum EstadoPedido {
        PENDIENTE,
        EN_PROCESO,
        ENVIADO,
        ENTREGADO,
        CANCELADO
    }
    

}