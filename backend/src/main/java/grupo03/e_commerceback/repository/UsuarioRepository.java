package grupo03.e_commerceback.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import grupo03.e_commerceback.modelo.Usuarios;

public interface UsuarioRepository extends JpaRepository<Usuarios, Long> {

    // ya lo tienes
    Optional<Usuarios> findByEmail(String email);
    Boolean existsByEmail(String email);

    // variantes útiles
    Optional<Usuarios> findByEmailIgnoreCase(String email);
    Boolean existsByEmailIgnoreCase(String email);

    // búsqueda por nombre (paginada)
    Page<Usuarios> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);

    // cargar usuario con sus pedidos cuando lo necesites (evita N+1)
    @EntityGraph(attributePaths = "pedidos")
    @Query("select u from Usuarios u where u.id_Usuarios = :id")
    Optional<Usuarios> findWithPedidosById(@Param("id") Long id);
}