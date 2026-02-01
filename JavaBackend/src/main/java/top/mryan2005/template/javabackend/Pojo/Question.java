package top.mryan2005.template.javabackend.Pojo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 2000)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;
    
    @Column(columnDefinition = "TEXT")
    private String options; // JSON格式存储选项
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer; // 正确答案
    
    @Column(columnDefinition = "TEXT")
    private String explanation; // 答案解析
    
    @Column(columnDefinition = "TEXT")
    private String aiExplanation; // AI讲解
    
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty = DifficultyLevel.MEDIUM;
    
    @Column(length = 500)
    private String tags; // 标签，逗号分隔
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;
    
    @ManyToMany
    @JoinTable(
        name = "question_knowledge_points",
        joinColumns = @JoinColumn(name = "question_id"),
        inverseJoinColumns = @JoinColumn(name = "knowledge_point_id")
    )
    private List<KnowledgePoint> knowledgePoints;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public enum QuestionType {
        SINGLE_CHOICE,    // 单选题
        MULTIPLE_CHOICE,  // 多选题
        TRUE_FALSE,       // 判断题
        FILL_BLANK,       // 填空题
        SHORT_ANSWER,     // 简答题
        ESSAY             // 概述题 (支持Markdown和Mermaid)
    }
    
    public enum DifficultyLevel {
        EASY,
        MEDIUM,
        HARD
    }
}
