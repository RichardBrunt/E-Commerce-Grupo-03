package controller;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Objects;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dto.ModeloDto;
import dto.ModeloCreateRequest;
import modelo.Categoria;
import modelo.Modelo;
import repository.CategoriaRepository;
import repository.ModeloRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ModeloController {

    private final ModeloRepository modeloRepository;
    private final CategoriaRepository categoriaRepository;

        @GetMapping("/categorias/{categoriaId}/modelos")
        public ResponseEntity<List<ModeloDto>> listarPorCategoria(@PathVariable long categoriaId) {
        List<Modelo> modelos = modeloRepository.findByCategoriaIdCategoria(categoriaId);
        List<ModeloDto> dtos = modelos.stream()
                .map(m -> new ModeloDto(m.getIdModelo(), m.getNombreModelo(), m.getCategoria().getIdCategoria()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

        @PostMapping("/categorias/{categoriaId}/modelos")
        public ResponseEntity<ModeloDto> crear(@PathVariable long categoriaId, @RequestBody ModeloCreateRequest request) {
            Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        Modelo m = new Modelo();
        m.setNombreModelo(request.nombreModelo());
        m.setCategoria(categoria);
        Modelo saved = modeloRepository.save(m);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ModeloDto(saved.getIdModelo(), saved.getNombreModelo(), categoria.getIdCategoria()));
    }

    @PutMapping("/categorias/{categoriaId}/modelos/{modeloId}")
        public ResponseEntity<ModeloDto> actualizar(@PathVariable long categoriaId, @PathVariable long modeloId,
            @RequestBody ModeloCreateRequest request) {
            Modelo existente = modeloRepository.findByIdModeloAndCategoriaIdCategoria(modeloId, categoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Modelo no encontrado para la categoría dada"));

            Objects.requireNonNull(existente);

        if (modeloRepository.existsByNombreModeloIgnoreCaseAndCategoriaIdCategoriaAndIdModeloNot(
                request.nombreModelo(), categoriaId, modeloId)) {
            throw new IllegalStateException("Ya existe un modelo con ese nombre en la categoría");
        }

        existente.setNombreModelo(request.nombreModelo());
        Modelo saved = modeloRepository.save(existente);
        return ResponseEntity.ok(new ModeloDto(saved.getIdModelo(), saved.getNombreModelo(), categoriaId));
    }

    @DeleteMapping("/categorias/{categoriaId}/modelos/{modeloId}")
        public ResponseEntity<Void> eliminar(@PathVariable long categoriaId, @PathVariable long modeloId) {
            Modelo existente = modeloRepository.findByIdModeloAndCategoriaIdCategoria(modeloId, categoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Modelo no encontrado para la categoría dada"));
            modeloRepository.delete(Objects.requireNonNull(existente));
        return ResponseEntity.noContent().build();
    }
}
