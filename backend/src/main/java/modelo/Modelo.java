package modelo;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity(name = "modelos")
@Table(name = "modelos")
public class Modelo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_modelo")
    private Long idModelo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @Column(name = "nombre_modelo", length = 100, nullable = false)
    private String nombreModelo;
}
