package modelo;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity(name = "usuarios")
@Table(name = "usuarios")
public class Usuarios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(length = 100, nullable = false)
    private String nombre;

    @Column(length = 100)
    private String apellido;

    @Column(length = 100)
    private String usuario; // username visible en el front (no usado para login)

    @Column(length = 100, nullable = false, unique = true)
    private String email;

    @Column(length = 200, nullable = false)
    private String password;

    @Column(length = 20, nullable = false)
    private String rol; // USER o ADMIN

    @Column(length = 300)
    private String avatar; // URL de imagen de perfil
}



