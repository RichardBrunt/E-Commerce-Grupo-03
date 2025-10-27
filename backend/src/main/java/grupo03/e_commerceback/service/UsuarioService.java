package grupo03.e_commerceback.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import grupo03.e_commerceback.modelo.Usuarios;
import grupo03.e_commerceback.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public Optional<Usuarios> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public boolean existeEmail(String email) {
        return Boolean.TRUE.equals(usuarioRepository.existsByEmail(email));
    }

    @Transactional
    public Usuarios guardar(Usuarios usuario) {
        // Aquí puedes hashear contraseña, validar unicidad, etc.
        return usuarioRepository.save(usuario);
    }
}
