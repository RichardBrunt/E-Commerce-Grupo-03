package repository;

import org.springframework.data.jpa.repository.JpaRepository;

import modelo.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
	boolean existsByNombreCategoria(String nombreCategoria);
	boolean existsByNombreCategoriaIgnoreCaseAndIdCategoriaNot(String nombreCategoria, Long idCategoria);
}
