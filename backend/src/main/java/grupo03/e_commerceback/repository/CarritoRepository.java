package grupo03.e_commerceback.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import grupo03.e_commerceback.modelo.carritos;

public interface CarritoRepository extends JpaRepository<carritos, Long> {

    @Query("select c from carritos c where c.id_usuario.id_Usuarios = :userId")
    Optional<carritos> findByUsuarioId(@Param("userId") Long userId);
}
