package grupo03.e_commerceback.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import grupo03.e_commerceback.modelo.ItemsPedido;

public interface ItemsPedidoRepository extends JpaRepository<ItemsPedido, Long> {

    @Query("select i from ItemsPedido i where i.pedido.id_Pedidos = :pedidoId")
    List<ItemsPedido> findByPedidoId(@Param("pedidoId") Long pedidoId);
}
