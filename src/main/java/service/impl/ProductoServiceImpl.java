package service.impl;

import dto.ProductoDto;
import dto.ProductoUpsertRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import modelo.Categoria;
import modelo.Modelo;
import modelo.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import repository.CategoriaRepository;
import repository.ModeloRepository;
import repository.ProductoRepository;
import service.ProductoService;
import errors.NotFoundException;
import errors.BadRequestException;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ModeloRepository modeloRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ProductoDto> listar(Long categoriaId, Long modeloId, Pageable pageable) {
        Page<Producto> result;
        if (categoriaId != null && modeloId != null) {
            result = productoRepository.findByCategoria_IdCategoriaAndModelo_IdModelo(categoriaId, modeloId, pageable);
        } else if (categoriaId != null) {
            result = productoRepository.findByCategoria_IdCategoria(categoriaId, pageable);
        } else if (modeloId != null) {
            result = productoRepository.findByModelo_IdModelo(modeloId, pageable);
        } else {
            result = productoRepository.findAll(java.util.Objects.requireNonNull(pageable));
        }
        return result.map(ProductoDto::from);
    }

    @Override
    @Transactional
    public ProductoDto crear(@Valid ProductoUpsertRequest req) {
        if (req.getCategoriaId() == null) {
            throw new BadRequestException("categoriaId requerido");
        }
        if (req.getModeloId() == null) {
            throw new BadRequestException("modeloId requerido");
        }
        long catId = req.getCategoriaId();
        long modId = req.getModeloId();
        Categoria categoria = categoriaRepository.findById(catId)
                .orElseThrow(() -> new NotFoundException("Categoría no encontrada"));
        Modelo modelo = modeloRepository.findById(modId)
                .orElseThrow(() -> new NotFoundException("Modelo no encontrado"));

        Producto p = new Producto();
        p.setNombreProducto(req.getNombreProducto());
        p.setDescripcion(req.getDescripcion());
        p.setPrecio(req.getPrecio());
        p.setStock(req.getStock());
        p.setCategoria(categoria);
        p.setModelo(modelo);
        p.setImagenUrl(req.getImagenUrl());

        p = productoRepository.save(p);
        return ProductoDto.from(p);
    }

    @Override
    @Transactional
    public ProductoDto actualizar(long id, @Valid ProductoUpsertRequest req) {
    Producto p = productoRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Producto no encontrado"));
    if (req.getCategoriaId() == null) {
        throw new BadRequestException("categoriaId requerido");
    }
    if (req.getModeloId() == null) {
        throw new BadRequestException("modeloId requerido");
    }
    long catId = req.getCategoriaId();
    long modId = req.getModeloId();
    Categoria categoria = categoriaRepository.findById(catId)
        .orElseThrow(() -> new NotFoundException("Categoría no encontrada"));
    Modelo modelo = modeloRepository.findById(modId)
        .orElseThrow(() -> new NotFoundException("Modelo no encontrado"));

        p.setNombreProducto(req.getNombreProducto());
        p.setDescripcion(req.getDescripcion());
        p.setPrecio(req.getPrecio());
        p.setStock(req.getStock());
        p.setCategoria(categoria);
        p.setModelo(modelo);
        p.setImagenUrl(req.getImagenUrl());

        p = productoRepository.save(p);
        return ProductoDto.from(p);
    }

    @Override
    @Transactional
    public void eliminar(long id) {
        if (!productoRepository.existsById(id)) {
            throw new NotFoundException("Producto no encontrado");
        }
        productoRepository.deleteById(id);
    }
}
