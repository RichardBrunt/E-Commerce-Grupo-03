package grupo03.e_commerceback.modelo;

import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity
@Table(name = "valores_atributo_producto")
public class valoresAtributoProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_valor_atributo_producto")
    private Long id;

    // FK many-to-one: id_atributo
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_atributo", nullable = false)
    private atributos atributo;

    // FK many-to-one: id_producto
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private productos producto;

    @Column(name = "valor_numero", length = 100, nullable = false)
    private String valornumero;

    @Column(name = "valor_texto", length = 100)
    private String valortexto;

    @Column(name = "valor_boolean", nullable = false)
    private Boolean valorboolean;

}
