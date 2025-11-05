package security;

import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Filtro JWT que se ejecuta una vez por request.
 * - Extrae el token del header Authorization (esquema Bearer)
 * - Valida y parsea el token con JwtUtil
 * - Construye la Authentication con las autoridades derivadas de 'roles'
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwt;

    public JwtFilter(JwtUtil jwt) { this.jwt = jwt; }

    /**
     * Evita filtrar endpoints públicos (auth y GET de catálogo) para reducir trabajo y
     * asegurar que nunca interfiera con rutas permitAll.
     */
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        if (path == null) return false;
        if (path.startsWith("/api/auth/")) return true;
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            if (path.startsWith("/api/categorias")) return true;
            if (path.startsWith("/api/productos")) return true;
        }
        return false;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        // 1) Leer header Authorization
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                // 2) Validar y extraer subject (email) y roles
                String email = jwt.getSubject(token);
                var roles = Arrays.stream(jwt.getRoles(token).split(","))
                        .filter(s -> !s.isBlank())
                        .map(r -> new SimpleGrantedAuthority(r.startsWith("ROLE_") ? r : "ROLE_" + r))
                        .collect(Collectors.toList());
                // 3) Crear Authentication y setear en el contexto
                var auth = new UsernamePasswordAuthenticationToken(email, null, roles);
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception e) {
                // Token inválido: se ignora; la request sigue como no autenticada
            }
        }
        // 4) Continuar la cadena de filtros
        filterChain.doFilter(request, response);
    }
}
