package top.mryan2005.template.javabackend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import top.mryan2005.template.javabackend.Pojo.QuestionSet;
import java.util.List;

@Repository
public interface QuestionSetRepository extends JpaRepository<QuestionSet, Long> {
    List<QuestionSet> findByCreatorId(Long creatorId);
    List<QuestionSet> findByIsPublicTrue();
    
    @Query("SELECT COUNT(qs) FROM QuestionSet qs WHERE qs.creator.id = :creatorId")
    Long countByCreatorId(@Param("creatorId") Long creatorId);
}
