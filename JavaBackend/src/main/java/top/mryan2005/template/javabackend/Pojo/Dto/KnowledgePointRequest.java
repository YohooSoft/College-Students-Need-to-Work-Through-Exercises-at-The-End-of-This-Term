package top.mryan2005.template.javabackend.Pojo.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import top.mryan2005.template.javabackend.Pojo.KnowledgePoint;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgePointRequest {
    private String title;
    private String content;
    private KnowledgePoint.DifficultyLevel difficulty;
    private String category;
}
