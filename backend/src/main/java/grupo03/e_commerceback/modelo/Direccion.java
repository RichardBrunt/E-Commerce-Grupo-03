package grupo03.e_commerceback.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "direcciones")
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_direccion")
    private Long id_Direccion;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuarios id_Usuario;

    @Column(name = "calle", length = 100, nullable = false)
    private String calle;
    
    @Column(name = "altura", nullable = false)
    private int altura;


    @Column(name = "ciudad", length = 50, nullable = false)
    private String ciudad;

    @Column(name = "codigo_postal", length = 10, nullable = false)
    private String codigo_Postal;

    @Column(name = "pais", length = 50, nullable = false)
    private String pais;

    @Column(name = "provincia", length = 50, nullable = false)
    private String provincia;


}
