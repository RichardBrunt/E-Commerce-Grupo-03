package grupo03.e_commerceback.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import grupo03.e_commerceback.modelo.carritos;
import grupo03.e_commerceback.repository.CarritoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CarritoService {

    private final CarritoRepository carritoRepository;

    @Transactional(readOnly = true)
    public Optional<carritos> obtenerPorUsuario(Long usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId);
    }

    @Transactional
    public carritos guardar(carritos carrito) {
        return carritoRepository.save(carrito);
    }

    @Transactional
    public void eliminar(Long idCarrito) {
        carritoRepository.deleteById(idCarrito);
    }
}
