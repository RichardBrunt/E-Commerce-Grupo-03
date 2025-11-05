package repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import modelo.Direccion;

public interface DireccionRepository extends JpaRepository<Direccion, Long> {
    List<Direccion> findByUsuario_IdUsuario(Long idUsuario);
    Optional<Direccion> findByIdDireccionAndUsuario_IdUsuario(Long idDireccion, Long idUsuario);
}
