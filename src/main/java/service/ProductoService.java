package service;

import dto.ProductoDto;
import dto.ProductoUpsertRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductoService {
    Page<ProductoDto> listar(Long categoriaId, Long modeloId, Pageable pageable);
    ProductoDto crear(ProductoUpsertRequest req);
    ProductoDto actualizar(long id, ProductoUpsertRequest req);
    void eliminar(long id);
}
