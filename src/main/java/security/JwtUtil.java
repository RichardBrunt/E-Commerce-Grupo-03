package security;

import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

/**
 * Utilidad JWT basada en JJWT 0.11.5 (como en clase):
 * - HS256 con clave configurada
 * - subject = email del usuario
 * - claim 'roles' como string separado por comas (USER,ADMIN)
 */
@Component
public class JwtUtil {

    private final SecretKey key;
    private final long accessMillis;

    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.access}") long accessMillis) {
        // El secreto se espera en Base64 (según contenidos de clase y buenas prácticas)
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.accessMillis = accessMillis;
    }

    /**
     * Genera un token con subject (email) y roles (comma-separated), con expiración configurada.
     */
    public String generateToken(String subject, Collection<String> roles) {
        long now = System.currentTimeMillis();
        String rolesStr = roles.stream().collect(Collectors.joining(","));
        return Jwts.builder()
                .setSubject(subject)
                .claim("roles", rolesStr)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + accessMillis))
                .signWith(key, io.jsonwebtoken.SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Parsea y valida el token devolviendo sus claims.
     */
    public Jws<io.jsonwebtoken.Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }

    /**
     * Obtiene el subject (email) del token.
     */
    public String getSubject(String token) { return parse(token).getBody().getSubject(); }

    /**
     * Obtiene los roles (como string) del token.
     */
    public String getRoles(String token) {
        Claims c = parse(token).getBody();
        Object r = c.get("roles");
        return r != null ? r.toString() : "";
    }
}
