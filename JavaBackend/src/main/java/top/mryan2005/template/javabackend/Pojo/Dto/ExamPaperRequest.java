package top.mryan2005.template.javabackend.Pojo.Dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ExamPaperRequest {
    private String title;
    private String description;
    private List<Long> questionIds;
    private Integer timeLimit;
    private Integer totalScore;
    private Integer passScore;
    private Boolean isPublic;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
