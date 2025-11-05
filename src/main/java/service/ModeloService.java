package service;

import java.util.List;
import dto.ModeloCreateRequest;
import dto.ModeloDto;

public interface ModeloService {
    List<ModeloDto> listarPorCategoria(long categoriaId);
    ModeloDto crear(long categoriaId, ModeloCreateRequest request);
    ModeloDto actualizar(long categoriaId, long modeloId, ModeloCreateRequest request);
    void eliminar(long categoriaId, long modeloId);
}
