package top.mryan2005.template.javabackend.Pojo.Dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStatistics {
    private Long userId;
    private String username;
    private String fullName;
    private String role;
    private Long completedQuestionsCount;   // 完成的题目数量
    private Long correctAnswersCount;       // 正确答案数量
    private Long addedQuestionsCount;       // 添加的题目数量
    private Long createdQuestionSetsCount;  // 创建的试卷数量
    private Integer totalScore;             // 总得分
}
