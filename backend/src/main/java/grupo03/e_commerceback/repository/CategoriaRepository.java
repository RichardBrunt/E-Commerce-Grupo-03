package grupo03.e_commerceback.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import grupo03.e_commerceback.modelo.categorias;

@Repository
public interface CategoriaRepository extends JpaRepository<categorias, Long> {
}
