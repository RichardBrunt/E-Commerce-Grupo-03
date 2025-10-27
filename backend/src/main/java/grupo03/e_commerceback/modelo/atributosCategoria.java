package grupo03.e_commerceback.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Data
@Entity
@Table(name = "atributos_categoria")
public class atributosCategoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_atributo_categoria", nullable = false)
    private Long id_atributo_categoria;
    
    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private categorias categoria;

    @ManyToOne
    @JoinColumn(name = "id_atributo", nullable = false)
    private atributos atributo;

    @Column(name = "es_requerido", nullable = false)
    private boolean es_requerido;

    @Column(name = "filtrable", nullable = false)
    private boolean filtrable;

    @Column(name ="unidad", length = 20)
    private String unidad;


}
