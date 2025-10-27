package grupo03.e_commerceback.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

@Data
@Entity
@Table(name = "modelos")
public class modelos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_modelo")
    private Long idModelo;

    @ManyToOne
    @JoinColumn(name = "id_categorias", nullable = false)
    private categorias id_Categorias;


    @Column(name = "nombre_modelo", length = 100, nullable = false)
    private String nombreModelo;

    
    
}