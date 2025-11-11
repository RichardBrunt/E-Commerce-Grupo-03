package controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dto.AuthRequest;
import dto.AuthResponse;
import dto.RegisterRequest;
import service.AuthService;
import jakarta.validation.Valid;

/**
 * Endpoints públicos de autenticación:
 * - POST /register: registra usuario (USER) y devuelve token
 * - POST /login: valida credenciales y devuelve token
 */
@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        String token = authService.registerAndIssueToken(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        String token = authService.loginAndIssueToken(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
