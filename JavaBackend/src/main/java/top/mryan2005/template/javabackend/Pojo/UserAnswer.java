package top.mryan2005.template.javabackend.Pojo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserAnswer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_set_id")
    private QuestionSet questionSet;
    
    @Column(columnDefinition = "TEXT")
    private String answer; // 用户答案
    
    @Column(name = "is_correct")
    private Boolean isCorrect; // 是否正确
    
    @Column
    private Integer score; // 得分
    
    @Column(name = "time_spent")
    private Integer timeSpent; // 花费时间（秒）
    
    @Column(name = "ai_feedback", columnDefinition = "TEXT")
    private String aiFeedback; // AI评语（用于概述题）
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt = LocalDateTime.now();
}
