package grupo03.e_commerceback.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import grupo03.e_commerceback.modelo.productos;
import grupo03.e_commerceback.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public Page<productos> buscarPorNombre(String texto, Pageable pageable) {
        String term = (texto == null) ? "" : texto;
        return productoRepository.findByNombreProductoContainingIgnoreCase(term, pageable);
    }

    @Transactional(readOnly = true)
    public Page<productos> listarPorCategoria(Long categoriaId, Pageable pageable) {
        return productoRepository.findByCategoriaIdCategoria(categoriaId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<productos> listarPorModelo(Long modeloId, Pageable pageable) {
        return productoRepository.findByModeloIdModelo(modeloId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<productos> filtrarPorPrecio(Double min, Double max, Pageable pageable) {
        return productoRepository.findByPrecioBetween(min, max, pageable);
    }

    @Transactional(readOnly = true)
    public Optional<productos> detalle(Long id) {
        return productoRepository.findDetalleById(id);
    }

    @Transactional
    public boolean decrementarStock(Long idProducto, int cantidad) {
        return productoRepository.decrementarStockSiAlcanza(idProducto, cantidad) > 0;
    }

    @Transactional
    public void incrementarStock(Long idProducto, int cantidad) {
        productoRepository.incrementarStock(idProducto, cantidad);
    }
}
