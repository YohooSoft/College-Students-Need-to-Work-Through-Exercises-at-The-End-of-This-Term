package top.mryan2005.template.javabackend.Pojo;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "question_sets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionSet {
    
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
        name = "question_set_questions",
        joinColumns = @JoinColumn(name = "question_set_id"),
        inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private List<Question> questions;
    
    @Column(name = "time_limit")
    private Integer timeLimit; // 时间限制（分钟）
    
    @Column(name = "total_score")
    private Integer totalScore; // 总分
    
    @Column(name = "is_public")
    private Boolean isPublic = false; // 是否公开
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
