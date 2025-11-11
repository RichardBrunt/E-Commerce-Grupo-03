package app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

import modelo.Usuarios;
import repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication(
    scanBasePackages = {
        "config", "controller", "service", "repository", "security", "modelo", "dto"
    }
)
@EntityScan(basePackages = {"modelo"})
@EnableJpaRepositories(basePackages = {"repository"})
@ConfigurationPropertiesScan(basePackages = {"config"})
public class ECommercebackApplication {

    public static void main(String[] args) {
        SpringApplication.run(ECommercebackApplication.class, args);
    }

    @Bean
    CommandLineRunner seedAdmin(UsuarioRepository repo, PasswordEncoder encoder,
                                org.springframework.core.env.Environment env) {
        return args -> {
            // Permitir desactivar el seed en entornos no-dev
            boolean seedEnabled = env.getProperty("admin.seed.enabled", Boolean.class, true);
            if (!seedEnabled) return;
            String email = env.getProperty("admin.email", "admin@example.com");
            String pass = env.getProperty("admin.password", "admin123");
            if (repo.findByEmail(email).isEmpty()) {
                Usuarios admin = new Usuarios();
                admin.setNombre("Administrador");
                admin.setEmail(email);
                admin.setPassword(encoder.encode(pass));
                admin.setRol("ADMIN");
                repo.save(admin);
            }
        };
    }
}
