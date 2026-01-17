package top.mryan2005.template.javabackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import top.mryan2005.template.javabackend.Response.ApiResponse;
import top.mryan2005.template.javabackend.Service.GradeStatisticsService;

import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {
    
    @Autowired
    private GradeStatisticsService gradeStatisticsService;
    
    @GetMapping("/exam-paper/{examPaperId}")
    public ApiResponse<Map<String, Object>> getExamPaperStatistics(@PathVariable Long examPaperId) {
        try {
            Map<String, Object> statistics = gradeStatisticsService.getExamPaperStatistics(examPaperId);
            return ApiResponse.success(statistics);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/user/{userId}")
    public ApiResponse<Map<String, Object>> getUserStatistics(@PathVariable Long userId) {
        try {
            Map<String, Object> statistics = gradeStatisticsService.getUserStatistics(userId);
            return ApiResponse.success(statistics);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/question/{questionId}")
    public ApiResponse<Map<String, Object>> getQuestionStatistics(@PathVariable Long questionId) {
        try {
            Map<String, Object> statistics = gradeStatisticsService.getQuestionStatistics(questionId);
            return ApiResponse.success(statistics);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
