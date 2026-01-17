package top.mryan2005.template.javabackend.Pojo.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import top.mryan2005.template.javabackend.Pojo.Question;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRequest {
    private String title;
    private String content;
    private Question.QuestionType type;
    private String options; // JSON格式
    private String answer;
    private String explanation;
    private Question.DifficultyLevel difficulty;
    private String tags;
    private List<Long> knowledgePointIds; // 关联的知识点ID列表
}
