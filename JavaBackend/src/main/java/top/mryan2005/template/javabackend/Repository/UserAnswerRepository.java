package top.mryan2005.template.javabackend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import top.mryan2005.template.javabackend.Pojo.UserAnswer;
import java.util.List;

@Repository
public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {
    List<UserAnswer> findByUserId(Long userId);
    List<UserAnswer> findByUserIdAndQuestionSetId(Long userId, Long questionSetId);
    List<UserAnswer> findByQuestionId(Long questionId);
    
    @Query("SELECT COUNT(DISTINCT ua.question.id) FROM UserAnswer ua WHERE ua.user.id = :userId")
    Long countDistinctQuestionsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(ua) FROM UserAnswer ua WHERE ua.user.id = :userId AND ua.isCorrect = true")
    Long countCorrectAnswersByUserId(@Param("userId") Long userId);
}
