package grupo03.e_commerceback.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;


@Data
@Entity
@Table(name = "opciones_atributo")
public class opcionesAtributo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_opcion_atributo;

    @ManyToOne
    @JoinColumn(name = "id_atributo", nullable = false)
    private atributos atributo;

    @Column(name = "valor_opcion", length = 100, nullable = false)
    private String valor_opcion;

    
}
