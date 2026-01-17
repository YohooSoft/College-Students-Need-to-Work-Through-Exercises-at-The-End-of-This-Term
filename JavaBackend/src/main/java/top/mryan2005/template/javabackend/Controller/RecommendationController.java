package top.mryan2005.template.javabackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import top.mryan2005.template.javabackend.Pojo.Question;
import top.mryan2005.template.javabackend.Response.ApiResponse;
import top.mryan2005.template.javabackend.Service.QuestionRecommendationService;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {
    
    @Autowired
    private QuestionRecommendationService recommendationService;
    
    @GetMapping("/user/{userId}")
    public ApiResponse<List<Question>> recommendForUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<Question> questions = recommendationService.recommendQuestionsForUser(userId, limit);
            return ApiResponse.success(questions);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/similar/{questionId}")
    public ApiResponse<List<Question>> recommendSimilar(
            @PathVariable Long questionId,
            @RequestParam(defaultValue = "5") int limit) {
        try {
            List<Question> questions = recommendationService.recommendSimilarQuestions(questionId, limit);
            return ApiResponse.success(questions);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/difficulty/{difficulty}")
    public ApiResponse<List<Question>> recommendByDifficulty(
            @PathVariable String difficulty,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            Question.DifficultyLevel level = Question.DifficultyLevel.valueOf(difficulty.toUpperCase());
            List<Question> questions = recommendationService.recommendByDifficulty(level, limit);
            return ApiResponse.success(questions);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/smart/{userId}")
    public ApiResponse<List<Question>> smartRecommend(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<Question> questions = recommendationService.smartRecommend(userId, limit);
            return ApiResponse.success(questions);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
