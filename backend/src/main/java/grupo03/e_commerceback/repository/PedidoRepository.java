package grupo03.e_commerceback.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import grupo03.e_commerceback.modelo.Pedidos;

public interface PedidoRepository extends JpaRepository<Pedidos, Long> {

    @Query("select p from Pedidos p where p.usuario.id_Usuarios = :userId")
    Page<Pedidos> findByUsuarioId(@Param("userId") Long userId, Pageable pageable);

    @Query("select p from Pedidos p where p.usuario.id_Usuarios = :userId")
    List<Pedidos> findAllByUsuarioId(@Param("userId") Long userId);

    @Query("select p from Pedidos p join fetch p.usuario where p.id_Pedidos = :id")
    Optional<Pedidos> findDetalleById(@Param("id") Long id);
}
