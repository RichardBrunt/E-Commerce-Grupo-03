package repository;

import modelo.Producto;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    Page<Producto> findByCategoria_IdCategoria(Long categoriaId, Pageable pageable);
    Page<Producto> findByModelo_IdModelo(Long modeloId, Pageable pageable);
    Page<Producto> findByCategoria_IdCategoriaAndModelo_IdModelo(Long categoriaId, Long modeloId, Pageable pageable);
}
