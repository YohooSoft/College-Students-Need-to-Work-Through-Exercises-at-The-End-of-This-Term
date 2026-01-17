package top.mryan2005.template.javabackend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import top.mryan2005.template.javabackend.Pojo.QuestionSet;
import java.util.List;

@Repository
public interface QuestionSetRepository extends JpaRepository<QuestionSet, Long> {
    List<QuestionSet> findByCreatorId(Long creatorId);
    List<QuestionSet> findByIsPublicTrue();
}
