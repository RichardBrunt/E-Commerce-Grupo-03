package controller;

import java.util.List;

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
import service.ModeloService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ModeloController {

    private final ModeloService modeloService;

        @GetMapping("/categorias/{categoriaId}/modelos")
        public ResponseEntity<List<ModeloDto>> listarPorCategoria(@PathVariable long categoriaId) {
            return ResponseEntity.ok(modeloService.listarPorCategoria(categoriaId));
    }

        @PostMapping("/categorias/{categoriaId}/modelos")
        public ResponseEntity<ModeloDto> crear(@PathVariable long categoriaId, @RequestBody ModeloCreateRequest request) {
            ModeloDto created = modeloService.crear(categoriaId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/categorias/{categoriaId}/modelos/{modeloId}")
        public ResponseEntity<ModeloDto> actualizar(@PathVariable long categoriaId, @PathVariable long modeloId,
                @RequestBody ModeloCreateRequest request) {
            return ResponseEntity.ok(modeloService.actualizar(categoriaId, modeloId, request));
    }

    @DeleteMapping("/categorias/{categoriaId}/modelos/{modeloId}")
        public ResponseEntity<Void> eliminar(@PathVariable long categoriaId, @PathVariable long modeloId) {
            modeloService.eliminar(categoriaId, modeloId);
            return ResponseEntity.noContent().build();
    }
}
