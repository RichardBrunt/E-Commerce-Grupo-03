package grupo03.e_commerceback.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import grupo03.e_commerceback.modelo.Direccion;
import grupo03.e_commerceback.repository.DireccionRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DireccionService {

    private final DireccionRepository direccionRepository;

    @Transactional(readOnly = true)
    public List<Direccion> listarPorUsuario(Long usuarioId) {
        return direccionRepository.findByUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public Optional<Direccion> obtenerDeUsuario(Long usuarioId, Long idDireccion) {
        return direccionRepository.findByUsuarioIdAndId(usuarioId, idDireccion);
    }

    @Transactional
    public Direccion guardar(Direccion direccion) {
        return direccionRepository.save(direccion);
    }

    @Transactional
    public void eliminar(Long idDireccion) {
        direccionRepository.deleteById(idDireccion);
    }
}
