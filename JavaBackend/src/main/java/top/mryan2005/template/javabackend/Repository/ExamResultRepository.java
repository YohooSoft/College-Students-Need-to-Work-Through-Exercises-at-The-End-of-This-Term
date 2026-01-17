package top.mryan2005.template.javabackend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import top.mryan2005.template.javabackend.Pojo.ExamResult;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    List<ExamResult> findByUserId(Long userId);
    List<ExamResult> findByExamPaperId(Long examPaperId);
    Optional<ExamResult> findByUserIdAndExamPaperId(Long userId, Long examPaperId);
    
    @Query("SELECT AVG(er.score) FROM ExamResult er WHERE er.examPaper.id = :examPaperId")
    Double getAverageScoreByExamPaper(@Param("examPaperId") Long examPaperId);
    
    @Query("SELECT COUNT(er) FROM ExamResult er WHERE er.examPaper.id = :examPaperId AND er.isPassed = true")
    Long getPassedCountByExamPaper(@Param("examPaperId") Long examPaperId);
}
