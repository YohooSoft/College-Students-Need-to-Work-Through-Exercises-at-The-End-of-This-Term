package top.mryan2005.template.javabackend.Pojo;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "exam_papers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamPaper {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 500)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;
    
    @ManyToMany
    @JoinTable(
        name = "exam_paper_questions",
        joinColumns = @JoinColumn(name = "exam_paper_id"),
        inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private List<Question> questions;
    
    @Column(name = "time_limit")
    private Integer timeLimit; // 时间限制（分钟）
    
    @Column(name = "total_score")
    private Integer totalScore; // 总分
    
    @Column(name = "pass_score")
    private Integer passScore; // 及格分
    
    @Column(name = "is_public")
    private Boolean isPublic = false; // 是否公开
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ExamStatus status = ExamStatus.DRAFT; // 试卷状态
    
    @Column(name = "start_time")
    private LocalDateTime startTime; // 考试开始时间
    
    @Column(name = "end_time")
    private LocalDateTime endTime; // 考试结束时间
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public enum ExamStatus {
        DRAFT,      // 草稿
        PUBLISHED,  // 已发布
        STARTED,    // 进行中
        ENDED,      // 已结束
        ARCHIVED    // 已归档
    }
}
