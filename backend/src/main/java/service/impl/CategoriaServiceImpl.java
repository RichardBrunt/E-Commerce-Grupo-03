package service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dto.CategoriaCreateRequest;
import dto.CategoriaDto;
import errors.ConflictException;
import errors.NotFoundException;
import lombok.RequiredArgsConstructor;
import modelo.Categoria;
import repository.CategoriaRepository;
import service.CategoriaService;

@Service
@RequiredArgsConstructor
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaDto> listar() {
        return categoriaRepository.findAll().stream()
                .map(c -> new CategoriaDto(c.getIdCategoria(), c.getNombreCategoria()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoriaDto crear(CategoriaCreateRequest request) {
        if (categoriaRepository.existsByNombreCategoria(request.nombreCategoria())) {
            throw new ConflictException("La categoría ya existe");
        }
        Categoria c = new Categoria();
        c.setNombreCategoria(request.nombreCategoria());
        Categoria saved = categoriaRepository.save(c);
        return new CategoriaDto(saved.getIdCategoria(), saved.getNombreCategoria());
    }

    @Override
    @Transactional
    public CategoriaDto actualizar(long id, CategoriaCreateRequest request) {
    Categoria existente = categoriaRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Categoría no encontrada"));

        if (categoriaRepository.existsByNombreCategoriaIgnoreCaseAndIdCategoriaNot(request.nombreCategoria(), id)) {
            throw new ConflictException("Ya existe una categoría con ese nombre");
        }

        existente.setNombreCategoria(request.nombreCategoria());
        Categoria saved = categoriaRepository.save(existente);
        return new CategoriaDto(saved.getIdCategoria(), saved.getNombreCategoria());
    }

    @Override
    @Transactional
    public void eliminar(long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new NotFoundException("Categoría no encontrada");
        }
        categoriaRepository.deleteById(id);
    }
}
