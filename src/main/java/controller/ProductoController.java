package controller;

import service.ProductoService;
import dto.ProductoDto;
import dto.ProductoUpsertRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    // GET público con filtros + paginación
    @GetMapping
    public ResponseEntity<Page<ProductoDto>> listar(
        @RequestParam(required = false) Long categoriaId,
        @RequestParam(required = false) Long modeloId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("idProducto").descending());
        return ResponseEntity.ok(productoService.listar(categoriaId, modeloId, pageable));
    }

    // POST ADMIN: crear producto
    @PostMapping
    public ResponseEntity<ProductoDto> crear(@RequestBody @Valid ProductoUpsertRequest req) {
        return ResponseEntity.status(201).body(productoService.crear(req));
    }

    // PUT ADMIN: actualizar producto
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDto> actualizar(@PathVariable long id, @RequestBody @Valid ProductoUpsertRequest req) {
        return ResponseEntity.ok(productoService.actualizar(id, req));
    }

    // DELETE ADMIN: eliminar producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable long id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
