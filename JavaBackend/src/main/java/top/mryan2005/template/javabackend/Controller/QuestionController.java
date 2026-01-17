package top.mryan2005.template.javabackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import top.mryan2005.template.javabackend.Pojo.Question;
import top.mryan2005.template.javabackend.Pojo.Dto.QuestionRequest;
import top.mryan2005.template.javabackend.Response.ApiResponse;
import top.mryan2005.template.javabackend.Service.QuestionService;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {
    
    @Autowired
    private QuestionService questionService;
    
    @PostMapping
    public ApiResponse<Question> createQuestion(@RequestBody QuestionRequest request, 
                                               @RequestParam Long userId) {
        try {
            Question question = questionService.createQuestion(request, userId);
            return ApiResponse.success("创建成功", question);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ApiResponse<Question> updateQuestion(@PathVariable Long id,
                                               @RequestBody QuestionRequest request,
                                               @RequestParam Long userId) {
        try {
            Question question = questionService.updateQuestion(id, request, userId);
            return ApiResponse.success("更新成功", question);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ApiResponse<Question> getQuestionById(@PathVariable Long id) {
        try {
            Question question = questionService.getQuestionById(id);
            return ApiResponse.success(question);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping
    public ApiResponse<List<Question>> getAllQuestions() {
        try {
            List<Question> questions = questionService.getAllQuestions();
            return ApiResponse.success(questions);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/search")
    public ApiResponse<Page<Question>> searchQuestions(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Question.QuestionType type,
            @RequestParam(required = false) Question.DifficultyLevel difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Question> questions = questionService.searchQuestions(keyword, type, difficulty, pageable);
            return ApiResponse.success(questions);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/creator/{creatorId}")
    public ApiResponse<List<Question>> getQuestionsByCreator(@PathVariable Long creatorId) {
        try {
            List<Question> questions = questionService.getQuestionsByCreator(creatorId);
            return ApiResponse.success(questions);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/tag/{tag}")
    public ApiResponse<Page<Question>> getQuestionsByTag(
            @PathVariable String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Question> questions = questionService.getQuestionsByTag(tag, pageable);
            return ApiResponse.success(questions);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteQuestion(@PathVariable Long id, @RequestParam Long userId) {
        try {
            questionService.deleteQuestion(id, userId);
            return ApiResponse.success("删除成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
