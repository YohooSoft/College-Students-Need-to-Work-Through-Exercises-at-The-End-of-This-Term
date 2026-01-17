package top.mryan2005.template.javabackend.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import top.mryan2005.template.javabackend.Pojo.KnowledgePoint;
import java.util.List;

@Repository
public interface KnowledgePointRepository extends JpaRepository<KnowledgePoint, Long> {
    
    @Query("SELECT kp FROM KnowledgePoint kp WHERE " +
           "(:keyword IS NULL OR LOWER(kp.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(kp.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:difficulty IS NULL OR kp.difficulty = :difficulty) " +
           "AND (:category IS NULL OR kp.category = :category)")
    Page<KnowledgePoint> searchKnowledgePoints(@Param("keyword") String keyword,
                                               @Param("difficulty") KnowledgePoint.DifficultyLevel difficulty,
                                               @Param("category") String category,
                                               Pageable pageable);
    
    List<KnowledgePoint> findByCreatorId(Long creatorId);
    
    @Query("SELECT kp FROM KnowledgePoint kp WHERE kp.category = :category")
    Page<KnowledgePoint> findByCategory(@Param("category") String category, Pageable pageable);
}
