package modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Data
@Entity(name = "atributos_categoria")
@Table(name = "atributos_categoria",
    uniqueConstraints = @UniqueConstraint(name = "uq_atributo_categoria",
                           columnNames = {"id_categoria", "id_atributo"}))
public class AtributoCategoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_atributo_categoria", nullable = false)
    private Long idAtributoCategoria;
    
    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "id_atributo", nullable = false)
    private Atributo atributo;

    @Column(name = "es_requerido", nullable = false)
    private boolean esRequerido;

    @Column(name = "filtrable", nullable = false)
    private boolean filtrable;

    @Column(name ="unidad", length = 20)
    private String unidad;
}
