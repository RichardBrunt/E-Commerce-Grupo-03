package service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dto.RegisterRequest;
import modelo.Usuarios;
import repository.UsuarioRepository;
import security.JwtUtil;
import errors.ConflictException;
import errors.BadRequestException;

@Service
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwt;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtUtil jwt) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwt = jwt;
    }

    /**
     * Registra un usuario con rol USER y emite un JWT.
     */
    @Transactional
    public String registerAndIssueToken(RegisterRequest req) {
        if (usuarioRepository.existsByEmail(req.getEmail())) {
            throw new ConflictException("El email ya está registrado");
        }
        Usuarios u = new Usuarios();
        u.setNombre(req.getNombre());
        u.setEmail(req.getEmail());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setRol("USER"); // por defecto, los registrados son USER
        usuarioRepository.save(u);
        return jwt.generateToken(u.getEmail(), List.of(u.getRol()));
    }

    /**
     * Valida credenciales y emite un JWT con el rol del usuario (USER o ADMIN).
     */
    public String loginAndIssueToken(String email, String rawPassword) {
        Usuarios u = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Credenciales inválidas"));
        if (!passwordEncoder.matches(rawPassword, u.getPassword())) {
            throw new BadRequestException("Credenciales inválidas");
        }
        return jwt.generateToken(u.getEmail(), List.of(u.getRol()));
    }
}
