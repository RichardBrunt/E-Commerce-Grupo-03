package grupo03.e_commerceback.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import grupo03.e_commerceback.modelo.Pagos;

public interface PagoRepository extends JpaRepository<Pagos, Long> {

    @Query("select p from Pagos p where p.usuario.id_Usuarios = :userId")
    List<Pagos> findByUsuarioId(@Param("userId") Long usuarioId);

    Optional<Pagos> findByReferencia(String referencia);
}
