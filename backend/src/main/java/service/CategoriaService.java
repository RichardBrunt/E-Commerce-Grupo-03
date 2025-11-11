package service;

import java.util.List;
import dto.CategoriaCreateRequest;
import dto.CategoriaDto;

public interface CategoriaService {
    List<CategoriaDto> listar();
    CategoriaDto crear(CategoriaCreateRequest request);
    CategoriaDto actualizar(long id, CategoriaCreateRequest request);
    void eliminar(long id);
}
