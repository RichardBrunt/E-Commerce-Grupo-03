package grupo03.e_commerceback.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;



@Data
@Entity
@Table(name = "atributos")
public class atributos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_atributo")
    private Long id_atributo;

    @Column(name = "nombre_atributo", length = 50, nullable = false)
    private String nombre_atributo;

    @Column(name = "codigo_atributo", length = 20, nullable = false, unique = true)
    private String codigo_atributo;

    @Column(name = "tipo_dato", length = 20, nullable = false)
    private String tipo_dato;

}
