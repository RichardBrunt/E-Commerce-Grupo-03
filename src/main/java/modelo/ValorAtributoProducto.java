package modelo;

import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity(name = "valores_atributo_producto")
@Table(name = "valores_atributo_producto",
    uniqueConstraints = @UniqueConstraint(name = "uq_valor_por_producto_atributo",
                           columnNames = {"id_producto", "id_atributo"}))
public class ValorAtributoProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_valor_atributo_producto")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_atributo", nullable = false)
    private Atributo atributo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_opcion_atributo", nullable = true)
    private OpcionAtributo opcionAtributo;

    @Column(name = "valor_numero", nullable = true)
    private java.math.BigDecimal valorNumero;

    @Column(name = "valor_texto", length = 100, nullable = true)
    private String valorTexto;

    @Column(name = "valor_boolean", nullable = true)
    private Boolean valorBoolean;
}
