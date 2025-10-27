package grupo03.e_commerceback.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import grupo03.e_commerceback.modelo.productos;

public interface ProductoRepository extends JpaRepository<productos, Long> {

	// Búsquedas por texto y atributos
	Page<productos> findByNombreProductoContainingIgnoreCase(String nombreProducto, Pageable pageable);

	Page<productos> findByCategoriaIdCategoria(Long idCategoria, Pageable pageable);

	Page<productos> findByModeloIdModelo(Long idModelo, Pageable pageable);

	Page<productos> findByPrecioBetween(Double min, Double max, Pageable pageable);

	Page<productos> findByStockGreaterThan(Integer stockMinimo, Pageable pageable);

	Optional<productos> findByNombreProductoIgnoreCase(String nombreProducto);

	// Detalle con relaciones para evitar N+1 cuando haga falta
	@EntityGraph(attributePaths = {"categoria", "modelo"})
	@Query("select p from productos p where p.idProducto = :id")
	Optional<productos> findDetalleById(@Param("id") Long id);

	// Operaciones de stock atómicas
	@Modifying
	@Transactional
	@Query("update productos p set p.stock = p.stock - :cantidad where p.idProducto = :id and p.stock >= :cantidad")
	int decrementarStockSiAlcanza(@Param("id") Long idProducto, @Param("cantidad") int cantidad);

	@Modifying
	@Transactional
	@Query("update productos p set p.stock = p.stock + :cantidad where p.idProducto = :id")
	int incrementarStock(@Param("id") Long idProducto, @Param("cantidad") int cantidad);
}