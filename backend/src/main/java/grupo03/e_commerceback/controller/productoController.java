package grupo03.e_commerceback.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import grupo03.e_commerceback.dto.ProductoDto;
import grupo03.e_commerceback.modelo.productos;
import grupo03.e_commerceback.modelo.categorias;
import grupo03.e_commerceback.modelo.modelos;
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

	@PostMapping
	public ResponseEntity<ProductoDto> crear(@RequestBody ProductoDto dto) {
		productos p = new productos();
		p.setNombreProducto(dto.nombre());
		p.setDescripcion(dto.descripcion());
		p.setPrecio(dto.precio());
		p.setStock(dto.stock());
		p.setImagenUrl(dto.imagenUrl());

		if (dto.categoriaId() != null) {
			categorias c = new categorias();
			c.setIdCategoria(dto.categoriaId());
			p.setCategoria(c);
		}

		if (dto.modeloId() != null) {
			modelos m = new modelos();
			m.setIdModelo(dto.modeloId());
			p.setModelo(m);
		}

		productos guardado = productoService.guardar(p);
		return ResponseEntity.ok(toDto(guardado));
	}

	@PatchMapping("/{id}")
	public ResponseEntity<ProductoDto> actualizar(@PathVariable Long id, @RequestBody ProductoDto dto) {
		return productoService.detalle(id)
				.map(p -> {
					if (dto.nombre() != null) p.setNombreProducto(dto.nombre());
					if (dto.descripcion() != null) p.setDescripcion(dto.descripcion());
					if (dto.precio() != null) p.setPrecio(dto.precio());
					if (dto.stock() != null) p.setStock(dto.stock());
					if (dto.imagenUrl() != null) p.setImagenUrl(dto.imagenUrl());

					if (dto.categoriaId() != null) {
						categorias c = new categorias();
						c.setIdCategoria(dto.categoriaId());
						p.setCategoria(c);
					}

					if (dto.modeloId() != null) {
						modelos m = new modelos();
						m.setIdModelo(dto.modeloId());
						p.setModelo(m);
					}

					productos actualizado = productoService.guardar(p);
					return ResponseEntity.ok(toDto(actualizado));
				})
				.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		productoService.eliminar(id);
		return ResponseEntity.noContent().build();
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
