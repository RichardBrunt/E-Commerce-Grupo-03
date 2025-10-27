package grupo03.e_commerceback.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import grupo03.e_commerceback.modelo.Pedidos;
import grupo03.e_commerceback.repository.PedidoRepository;
import grupo03.e_commerceback.repository.ItemsPedidoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ItemsPedidoRepository itemsPedidoRepository;

    @Transactional
    public Pedidos guardar(Pedidos pedido) {
        // Aquí se puede agregar lógica de negocio (calcular total, validar estado, etc.)
        return pedidoRepository.save(pedido);
    }

    @Transactional(readOnly = true)
    public Optional<Pedidos> obtenerDetalle(Long id) {
        return pedidoRepository.findDetalleById(id);
    }

    @Transactional(readOnly = true)
    public Page<Pedidos> listarPorUsuario(Long usuarioId, Pageable pageable) {
        return pedidoRepository.findByUsuarioId(usuarioId, pageable);
    }

    @Transactional
    public void eliminar(Long id) {
        // Si quieres borrar también items, confía en cascadas o bórralos manualmente
        pedidoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<?> listarItems(Long pedidoId) {
        return itemsPedidoRepository.findByPedidoId(pedidoId);
    }
}
