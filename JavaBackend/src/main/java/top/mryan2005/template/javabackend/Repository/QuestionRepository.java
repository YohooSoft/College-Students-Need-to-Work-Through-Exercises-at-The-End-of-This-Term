package top.mryan2005.template.javabackend.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import top.mryan2005.template.javabackend.Pojo.Question;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    @Query("SELECT q FROM Question q WHERE " +
           "(:keyword IS NULL OR LOWER(q.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(q.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:type IS NULL OR q.type = :type) " +
           "AND (:difficulty IS NULL OR q.difficulty = :difficulty)")
    Page<Question> searchQuestions(@Param("keyword") String keyword,
                                   @Param("type") Question.QuestionType type,
                                   @Param("difficulty") Question.DifficultyLevel difficulty,
                                   Pageable pageable);
    
    List<Question> findByCreatorId(Long creatorId);
    
    @Query("SELECT q FROM Question q WHERE q.tags LIKE CONCAT('%', :tag, '%')")
    Page<Question> findByTag(@Param("tag") String tag, Pageable pageable);
    
    @Query("SELECT COUNT(q) FROM Question q WHERE q.creator.id = :creatorId")
    Long countByCreatorId(@Param("creatorId") Long creatorId);
}
