package top.mryan2005.template.javabackend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import top.mryan2005.template.javabackend.Pojo.UserAnswer;
import java.util.List;

@Repository
public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {
    List<UserAnswer> findByUserId(Long userId);
    List<UserAnswer> findByUserIdAndQuestionSetId(Long userId, Long questionSetId);
    List<UserAnswer> findByQuestionId(Long questionId);
}
