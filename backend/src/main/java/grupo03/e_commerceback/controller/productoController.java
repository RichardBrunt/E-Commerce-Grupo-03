package grupo03.e_commerceback.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import grupo03.e_commerceback.dto.ProductoDto;
import grupo03.e_commerceback.modelo.productos;
import grupo03.e_commerceback.service.ProductoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/productos")
public class productoController {

	private final ProductoService productoService;

	@GetMapping
	public ResponseEntity<Page<ProductoDto>> listar(
			@RequestParam(required = false) String texto,
			@RequestParam(required = false) Long categoriaId,
			@RequestParam(required = false) Long modeloId,
			@RequestParam(required = false) Double min,
			@RequestParam(required = false) Double max,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "12") int size) {

		Pageable pageable = PageRequest.of(page, size);

		Page<productos> pageResult;
		if (categoriaId != null) {
			pageResult = productoService.listarPorCategoria(categoriaId, pageable);
		} else if (modeloId != null) {
			pageResult = productoService.listarPorModelo(modeloId, pageable);
		} else if (min != null || max != null) {
			Double minVal = (min == null) ? Double.MIN_VALUE : min;
			Double maxVal = (max == null) ? Double.MAX_VALUE : max;
			pageResult = productoService.filtrarPorPrecio(minVal, maxVal, pageable);
		} else {
			pageResult = productoService.buscarPorNombre(texto, pageable);
		}

		Page<ProductoDto> dtoPage = pageResult.map(this::toDto);
		return ResponseEntity.ok(dtoPage);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProductoDto> detalle(@PathVariable Long id) {
		return productoService.detalle(id)
				.map(this::toDto)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	private ProductoDto toDto(productos p) {
		Long categoriaId = (p.getCategoria() != null) ? p.getCategoria().getIdCategoria() : null;
		Long modeloId = (p.getModelo() != null) ? p.getModelo().getIdModelo() : null;
		return new ProductoDto(
				p.getIdProducto(),
				p.getNombreProducto(),
				p.getDescripcion(),
				p.getPrecio(),
				p.getStock(),
				p.getImagenUrl(),
				categoriaId,
				modeloId
		);
	}
}
