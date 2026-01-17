package top.mryan2005.template.javabackend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import top.mryan2005.template.javabackend.Pojo.ExamPaper;
import java.util.List;

@Repository
public interface ExamPaperRepository extends JpaRepository<ExamPaper, Long> {
    List<ExamPaper> findByCreatorId(Long creatorId);
    List<ExamPaper> findByIsPublicTrue();
    List<ExamPaper> findByStatus(ExamPaper.ExamStatus status);
    
    @Query("SELECT ep FROM ExamPaper ep WHERE " +
           "(ep.title LIKE %:keyword% OR ep.description LIKE %:keyword%) " +
           "AND (:isPublic IS NULL OR ep.isPublic = :isPublic)")
    List<ExamPaper> searchExamPapers(@Param("keyword") String keyword, 
                                     @Param("isPublic") Boolean isPublic);
}
