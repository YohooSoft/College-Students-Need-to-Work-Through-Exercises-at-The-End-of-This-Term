package top.mryan2005.template.javabackend.Pojo.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionSetRequest {
    private String title;
    private String description;
    private List<Long> questionIds;
    private Integer timeLimit;
    private Integer totalScore;
    private Boolean isPublic;
}
