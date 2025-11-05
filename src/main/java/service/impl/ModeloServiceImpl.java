package service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dto.ModeloCreateRequest;
import dto.ModeloDto;
import errors.ConflictException;
import errors.NotFoundException;
import lombok.RequiredArgsConstructor;
import modelo.Categoria;
import modelo.Modelo;
import repository.CategoriaRepository;
import repository.ModeloRepository;
import service.ModeloService;

@Service
@RequiredArgsConstructor
public class ModeloServiceImpl implements ModeloService {

    private final ModeloRepository modeloRepository;
    private final CategoriaRepository categoriaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ModeloDto> listarPorCategoria(long categoriaId) {
        List<Modelo> modelos = modeloRepository.findByCategoriaIdCategoria(categoriaId);
        return modelos.stream()
                .map(m -> new ModeloDto(m.getIdModelo(), m.getNombreModelo(), m.getCategoria().getIdCategoria()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ModeloDto crear(long categoriaId, ModeloCreateRequest request) {
    Categoria categoria = categoriaRepository.findById(categoriaId)
        .orElseThrow(() -> new NotFoundException("Categoría no encontrada"));

        Modelo m = new Modelo();
        m.setNombreModelo(request.nombreModelo());
        m.setCategoria(categoria);
        Modelo saved = modeloRepository.save(m);
        return new ModeloDto(saved.getIdModelo(), saved.getNombreModelo(), categoria.getIdCategoria());
    }

    @Override
    @Transactional
    public ModeloDto actualizar(long categoriaId, long modeloId, ModeloCreateRequest request) {
    Modelo existente = modeloRepository.findByIdModeloAndCategoriaIdCategoria(modeloId, categoriaId)
        .orElseThrow(() -> new NotFoundException("Modelo no encontrado para la categoría dada"));

        if (modeloRepository.existsByNombreModeloIgnoreCaseAndCategoriaIdCategoriaAndIdModeloNot(
                request.nombreModelo(), categoriaId, modeloId)) {
            throw new ConflictException("Ya existe un modelo con ese nombre en la categoría");
        }

        existente.setNombreModelo(request.nombreModelo());
        Modelo saved = modeloRepository.save(existente);
        return new ModeloDto(saved.getIdModelo(), saved.getNombreModelo(), categoriaId);
    }

    @Override
    @Transactional
    public void eliminar(long categoriaId, long modeloId) {
    Modelo existente = modeloRepository.findByIdModeloAndCategoriaIdCategoria(modeloId, categoriaId)
        .orElseThrow(() -> new NotFoundException("Modelo no encontrado para la categoría dada"));
    modeloRepository.delete(java.util.Objects.requireNonNull(existente));
    }
}
