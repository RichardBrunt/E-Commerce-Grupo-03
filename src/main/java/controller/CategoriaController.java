package controller;

import java.util.List;
import java.util.stream.Collectors;

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
import modelo.Categoria;
import repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;

    @GetMapping
    public ResponseEntity<List<CategoriaDto>> listar() {
        List<Categoria> categorias = categoriaRepository.findAll();
        List<CategoriaDto> dtos = categorias.stream()
                .map(c -> new CategoriaDto(c.getIdCategoria(), c.getNombreCategoria()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<CategoriaDto> crear(@Validated @RequestBody CategoriaCreateRequest request) {
        if (categoriaRepository.existsByNombreCategoria(request.nombreCategoria())) {
            throw new IllegalStateException("La categoría ya existe");
        }
        Categoria c = new Categoria();
        c.setNombreCategoria(request.nombreCategoria());
        Categoria saved = categoriaRepository.save(c);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CategoriaDto(saved.getIdCategoria(), saved.getNombreCategoria()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDto> actualizar(@PathVariable long id,
            @Validated @RequestBody CategoriaCreateRequest request) {
        Categoria existente = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        if (categoriaRepository.existsByNombreCategoriaIgnoreCaseAndIdCategoriaNot(request.nombreCategoria(), id)) {
            throw new IllegalStateException("Ya existe una categoría con ese nombre");
        }

        existente.setNombreCategoria(request.nombreCategoria());
        Categoria saved = categoriaRepository.save(existente);
        return ResponseEntity.ok(new CategoriaDto(saved.getIdCategoria(), saved.getNombreCategoria()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new IllegalArgumentException("Categoría no encontrada");
        }
        categoriaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
