package top.mryan2005.template.javabackend.Pojo.Dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionScore {
    private Long questionId;
    private Integer score;
}
