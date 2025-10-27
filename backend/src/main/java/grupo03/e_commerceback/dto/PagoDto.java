package grupo03.e_commerceback.dto;

import java.math.BigDecimal;

public record PagoDto(
        Long id,
        Long usuarioId,
        String referencia,
        String estado,
        BigDecimal monto
) {}
