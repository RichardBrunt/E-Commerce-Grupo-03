package grupo03.e_commerceback.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import grupo03.e_commerceback.modelo.Pagos;
import grupo03.e_commerceback.repository.PagoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;

    @Transactional(readOnly = true)
    public List<Pagos> listarPorUsuario(Long usuarioId) {
        return pagoRepository.findByUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public Optional<Pagos> buscarPorReferencia(String referencia) {
        return pagoRepository.findByReferencia(referencia);
    }

    @Transactional
    public Pagos guardar(Pagos pago) {
        return pagoRepository.save(pago);
    }

    @Transactional
    public void eliminar(Long idPago) {
        pagoRepository.deleteById(idPago);
    }
}
