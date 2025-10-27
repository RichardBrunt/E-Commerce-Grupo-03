package grupo03.e_commerceback.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import grupo03.e_commerceback.modelo.Direccion;

public interface DireccionRepository extends JpaRepository<Direccion, Long> {

    @Query("select d from Direccion d where d.id_Usuario.id_Usuarios = :userId")
    List<Direccion> findByUsuarioId(@Param("userId") Long usuarioId);

    @Query("select d from Direccion d where d.id_Usuario.id_Usuarios = :userId and d.id_Direccion = :id")
    Optional<Direccion> findByUsuarioIdAndId(@Param("userId") Long usuarioId, @Param("id") Long idDireccion);
}
