package controller;

import modelo.*;
import repository.*;
import dto.ProductoDto;
import dto.ProductoUpsertRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Objects;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ModeloRepository modeloRepository;

    // GET público con filtros + paginación
    @GetMapping
    public ResponseEntity<Page<ProductoDto>> listar(
        @RequestParam(required = false) Long categoriaId,
        @RequestParam(required = false) Long modeloId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("idProducto").descending());
        Page<Producto> result;

        if (categoriaId != null && modeloId != null) {
            final long cid = categoriaId;
            final long mid = modeloId;
            result = productoRepository.findByCategoria_IdCategoriaAndModelo_IdModelo(cid, mid, pageable);
        } else if (categoriaId != null) {
            final long cid = categoriaId;
            result = productoRepository.findByCategoria_IdCategoria(cid, pageable);
        } else if (modeloId != null) {
            final long mid = modeloId;
            result = productoRepository.findByModelo_IdModelo(mid, pageable);
        } else {
            result = productoRepository.findAll(pageable);
        }

        return ResponseEntity.ok(result.map(ProductoDto::from));
    }

    // POST ADMIN: crear producto
    @PostMapping
    public ResponseEntity<ProductoDto> crear(@RequestBody @Valid ProductoUpsertRequest req) {
        final long catId = Objects.requireNonNull(req.getCategoriaId(), "categoriaId requerido");
        final long modId = Objects.requireNonNull(req.getModeloId(), "modeloId requerido");

        Categoria categoria = categoriaRepository.findById(catId)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
        Modelo modelo = modeloRepository.findById(modId)
                .orElseThrow(() -> new IllegalArgumentException("Modelo no encontrado"));

        Producto p = new Producto();
        p.setNombreProducto(req.getNombreProducto());
        p.setDescripcion(req.getDescripcion());
        p.setPrecio(req.getPrecio());
        p.setStock(req.getStock());
        p.setCategoria(categoria);
        p.setModelo(modelo);
        p.setImagenUrl(req.getImagenUrl());

        p = productoRepository.save(Objects.requireNonNull(p));
        return ResponseEntity.status(201).body(ProductoDto.from(p));
    }

    // PUT ADMIN: actualizar producto
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDto> actualizar(@PathVariable long id, @RequestBody @Valid ProductoUpsertRequest req) {
    Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
    final long catId = Objects.requireNonNull(req.getCategoriaId(), "categoriaId requerido");
    final long modId = Objects.requireNonNull(req.getModeloId(), "modeloId requerido");

    Categoria categoria = categoriaRepository.findById(catId)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
    Modelo modelo = modeloRepository.findById(modId)
                .orElseThrow(() -> new IllegalArgumentException("Modelo no encontrado"));

        p.setNombreProducto(req.getNombreProducto());
        p.setDescripcion(req.getDescripcion());
        p.setPrecio(req.getPrecio());
        p.setStock(req.getStock());
        p.setCategoria(categoria);
        p.setModelo(modelo);
        p.setImagenUrl(req.getImagenUrl());

        p = productoRepository.save(Objects.requireNonNull(p));
        return ResponseEntity.ok(ProductoDto.from(p));
    }

    // DELETE ADMIN: eliminar producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable long id) {
        if (!productoRepository.existsById(id)) {
            throw new IllegalArgumentException("Producto no encontrado");
        }
        productoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
