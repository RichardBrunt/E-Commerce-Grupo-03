package repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import modelo.Usuarios;

public interface UsuarioRepository extends JpaRepository<Usuarios, Long> {
    Optional<Usuarios> findByEmail(String email);
    boolean existsByEmail(String email);
}
