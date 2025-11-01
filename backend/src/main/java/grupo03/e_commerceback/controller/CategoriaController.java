package grupo03.e_commerceback.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import grupo03.e_commerceback.dto.CategoriaDto;
import grupo03.e_commerceback.modelo.categorias;
import grupo03.e_commerceback.service.CategoriaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping
    public ResponseEntity<List<CategoriaDto>> listar() {
        List<CategoriaDto> dtos = categoriaService.listarTodas()
                .stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private CategoriaDto toDto(categorias c) {
        return new CategoriaDto(c.getIdCategoria(), c.getNombreCategoria());
    }
}
