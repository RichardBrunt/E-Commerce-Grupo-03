package controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import errors.BadRequestException;
import errors.ConflictException;
import errors.NotFoundException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }

        // Custom 400
        @ExceptionHandler(BadRequestException.class)
        public ResponseEntity<?> handleBadRequestCustom(BadRequestException ex) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(Map.of("error", ex.getMessage()));
        }

    // Método HTTP no soportado (p. ej. GET a un endpoint que es POST)
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<?> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(Map.of(
                        "error", "Método no permitido",
                        "method", ex.getMethod(),
                        "allowed", ex.getSupportedHttpMethods()
                ));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<?> handleConflict(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }

        // Custom 409
        @ExceptionHandler(ConflictException.class)
        public ResponseEntity<?> handleConflictCustom(ConflictException ex) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(Map.of("error", ex.getMessage()));
        }

        // Custom 404
        @ExceptionHandler(NotFoundException.class)
        public ResponseEntity<?> handleNotFound(NotFoundException ex) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of("error", ex.getMessage()));
        }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<?> handleConstraintViolation(ConstraintViolationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        fe -> fe.getField(),
                        fe -> fe.getDefaultMessage(),
                        (a, b) -> a,
                        HashMap::new
                ));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("validationErrors", errors));
    }

    // JSON mal formado o tipos inválidos en el body
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleNotReadable(HttpMessageNotReadableException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "error", "Cuerpo JSON inválido",
                        "detail", ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage()
                ));
    }

    // Tipos de parámetros incorrectos en path/query
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<?> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "error", "Parámetro inválido",
                        "param", ex.getName(),
                        "detail", ex.getMessage()
                ));

    }

    // Violaciones de integridad (FK/UK/NOT NULL) de la base de datos
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrity(DataIntegrityViolationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "error", "Violación de integridad de datos",
                        "detail", ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage()
                ));
    }

    // SQL malformado (e.g., columna inexistente tras migración)
    @ExceptionHandler(BadSqlGrammarException.class)
    public ResponseEntity<?> handleSqlGrammar(BadSqlGrammarException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "error", "Error SQL",
                        "detail", ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage()
                ));
    }

    // Otros errores de acceso a datos
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<?> handleDataAccess(DataAccessException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "error", "Error de acceso a datos",
                        "detail", ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage()
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error inesperado", "detail", ex.getMessage()));
    }
}
