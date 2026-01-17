package top.mryan2005.template.javabackend.Pojo.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerSubmitRequest {
    private Long questionId;
    private Long questionSetId;
    private String answer;
    private Integer timeSpent;
}
