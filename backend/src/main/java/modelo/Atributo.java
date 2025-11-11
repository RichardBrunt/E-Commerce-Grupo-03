package modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Data
@Entity(name = "atributos")
@Table(name = "atributos")
public class Atributo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_atributo")
    private Long idAtributo;

    @Column(name = "nombre_atributo", length = 50, nullable = false)
    private String nombreAtributo;

    @Column(name = "codigo_atributo", length = 20, nullable = false, unique = true)
    private String codigoAtributo;

    public enum TipoDato { NUMERO, TEXTO, BOOLEANO, OPCION }

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_dato", length = 20, nullable = false)
    private TipoDato tipoDato;
}
