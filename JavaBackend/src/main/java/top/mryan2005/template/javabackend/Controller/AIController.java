package top.mryan2005.template.javabackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import top.mryan2005.template.javabackend.Response.ApiResponse;
import top.mryan2005.template.javabackend.Service.AIService;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {
    
    @Autowired(required = false)
    private AIService aiService;
    
    @PostMapping("/explain")
    public ApiResponse<String> generateExplanation(@RequestBody ExplanationRequest request) {
        try {
            if (aiService == null) {
                return ApiResponse.error("AI服务未配置");
            }
            
            String explanation = aiService.generateExplanation(
                request.getQuestionTitle(),
                request.getQuestionContent(),
                request.getAnswer()
            );
            return ApiResponse.success(explanation);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PostMapping("/grade-essay")
    public ApiResponse<AIService.AIGradingResult> gradeEssay(@RequestBody EssayGradingRequest request) {
        try {
            if (aiService == null) {
                return ApiResponse.error("AI服务未配置");
            }
            
            AIService.AIGradingResult result = aiService.gradeEssay(
                request.getQuestionContent(),
                request.getExpectedAnswer(),
                request.getStudentAnswer()
            );
            return ApiResponse.success(result);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    // Request DTOs
    public static class ExplanationRequest {
        private String questionTitle;
        private String questionContent;
        private String answer;
        
        public String getQuestionTitle() { return questionTitle; }
        public void setQuestionTitle(String questionTitle) { this.questionTitle = questionTitle; }
        public String getQuestionContent() { return questionContent; }
        public void setQuestionContent(String questionContent) { this.questionContent = questionContent; }
        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }
    }
    
    public static class EssayGradingRequest {
        private String questionContent;
        private String expectedAnswer;
        private String studentAnswer;
        
        public String getQuestionContent() { return questionContent; }
        public void setQuestionContent(String questionContent) { this.questionContent = questionContent; }
        public String getExpectedAnswer() { return expectedAnswer; }
        public void setExpectedAnswer(String expectedAnswer) { this.expectedAnswer = expectedAnswer; }
        public String getStudentAnswer() { return studentAnswer; }
        public void setStudentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; }
    }
}
