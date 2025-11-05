package repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import modelo.Modelo;

public interface ModeloRepository extends JpaRepository<Modelo, Long> {
    List<Modelo> findByCategoriaIdCategoria(Long categoriaId);
    long countByCategoriaIdCategoria(Long categoriaId);
    java.util.Optional<Modelo> findByIdModeloAndCategoriaIdCategoria(Long modeloId, Long categoriaId);
    boolean existsByNombreModeloIgnoreCaseAndCategoriaIdCategoriaAndIdModeloNot(String nombreModelo, Long categoriaId, Long idModelo);
}
