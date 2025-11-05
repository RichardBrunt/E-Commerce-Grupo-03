package modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Data
@Entity(name = "opciones_atributo")
@Table(name = "opciones_atributo",
    uniqueConstraints = @UniqueConstraint(name = "uq_opcion_por_atributo",
                           columnNames = {"id_atributo", "valor_opcion"}))
public class OpcionAtributo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_opcion_atributo")
    private Long idOpcionAtributo;

    @ManyToOne
    @JoinColumn(name = "id_atributo", nullable = false)
    private Atributo atributo;

    @Column(name = "valor_opcion", length = 100, nullable = false)
    private String valorOpcion;
}
