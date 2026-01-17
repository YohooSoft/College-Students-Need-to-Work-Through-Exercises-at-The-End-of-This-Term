package top.mryan2005.template.javabackend.Pojo;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "exam_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_paper_id", nullable = false)
    private ExamPaper examPaper;
    
    @Column(name = "score")
    private Integer score; // 得分
    
    @Column(name = "total_score")
    private Integer totalScore; // 总分
    
    @Column(name = "correct_count")
    private Integer correctCount; // 正确题数
    
    @Column(name = "total_count")
    private Integer totalCount; // 总题数
    
    @Column(name = "time_spent")
    private Integer timeSpent; // 用时（秒）
    
    @Column(name = "is_passed")
    private Boolean isPassed; // 是否通过
    
    @Column(columnDefinition = "TEXT")
    private String aiAnalysis; // AI分析报告
    
    @Column(name = "started_at")
    private LocalDateTime startedAt; // 开始时间
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt = LocalDateTime.now(); // 提交时间
}
