package controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dto.CategoriaDto;
import dto.CategoriaCreateRequest;
import service.CategoriaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping
    public ResponseEntity<List<CategoriaDto>> listar() {
    return ResponseEntity.ok(categoriaService.listar());
    }

    @PostMapping
    public ResponseEntity<CategoriaDto> crear(@Validated @RequestBody CategoriaCreateRequest request) {
        CategoriaDto created = categoriaService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDto> actualizar(@PathVariable long id,
            @Validated @RequestBody CategoriaCreateRequest request) {
        return ResponseEntity.ok(categoriaService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable long id) {
        categoriaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
