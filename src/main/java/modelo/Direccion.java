package modelo;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity(name = "direcciones")
@Table(name = "direcciones")
public class Direccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_direccion")
    private Long idDireccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuarios usuario;

    @Column(length = 100, nullable = false)
    private String calle;

    @Column(nullable = false)
    private int altura;

    @Column(length = 50, nullable = false)
    private String ciudad;

    @Column(name = "codigo_postal", length = 10, nullable = false)
    private String codigoPostal;

    @Column(length = 50, nullable = false)
    private String pais;

    @Column(length = 50, nullable = false)
    private String provincia;
}
