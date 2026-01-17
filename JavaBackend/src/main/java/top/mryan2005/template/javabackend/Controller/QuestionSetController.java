package top.mryan2005.template.javabackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import top.mryan2005.template.javabackend.Pojo.QuestionSet;
import top.mryan2005.template.javabackend.Pojo.Dto.QuestionSetRequest;
import top.mryan2005.template.javabackend.Response.ApiResponse;
import top.mryan2005.template.javabackend.Service.QuestionSetService;
import java.util.List;

@RestController
@RequestMapping("/api/question-sets")
@CrossOrigin(origins = "*")
public class QuestionSetController {
    
    @Autowired
    private QuestionSetService questionSetService;
    
    @PostMapping
    public ApiResponse<QuestionSet> createQuestionSet(@RequestBody QuestionSetRequest request,
                                                     @RequestParam Long userId) {
        try {
            QuestionSet questionSet = questionSetService.createQuestionSet(request, userId);
            return ApiResponse.success("创建成功", questionSet);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ApiResponse<QuestionSet> updateQuestionSet(@PathVariable Long id,
                                                     @RequestBody QuestionSetRequest request,
                                                     @RequestParam Long userId) {
        try {
            QuestionSet questionSet = questionSetService.updateQuestionSet(id, request, userId);
            return ApiResponse.success("更新成功", questionSet);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ApiResponse<QuestionSet> getQuestionSetById(@PathVariable Long id) {
        try {
            QuestionSet questionSet = questionSetService.getQuestionSetById(id);
            return ApiResponse.success(questionSet);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping
    public ApiResponse<List<QuestionSet>> getAllQuestionSets() {
        try {
            List<QuestionSet> questionSets = questionSetService.getAllQuestionSets();
            return ApiResponse.success(questionSets);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/creator/{creatorId}")
    public ApiResponse<List<QuestionSet>> getQuestionSetsByCreator(@PathVariable Long creatorId) {
        try {
            List<QuestionSet> questionSets = questionSetService.getQuestionSetsByCreator(creatorId);
            return ApiResponse.success(questionSets);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/public")
    public ApiResponse<List<QuestionSet>> getPublicQuestionSets() {
        try {
            List<QuestionSet> questionSets = questionSetService.getPublicQuestionSets();
            return ApiResponse.success(questionSets);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteQuestionSet(@PathVariable Long id, @RequestParam Long userId) {
        try {
            questionSetService.deleteQuestionSet(id, userId);
            return ApiResponse.success("删除成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
