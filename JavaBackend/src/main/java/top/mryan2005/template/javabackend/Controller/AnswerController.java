package top.mryan2005.template.javabackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import top.mryan2005.template.javabackend.Pojo.UserAnswer;
import top.mryan2005.template.javabackend.Pojo.Dto.AnswerSubmitRequest;
import top.mryan2005.template.javabackend.Response.ApiResponse;
import top.mryan2005.template.javabackend.Service.AnswerService;
import java.util.List;

@RestController
@RequestMapping("/api/answers")
@CrossOrigin(origins = "*")
public class AnswerController {
    
    @Autowired
    private AnswerService answerService;
    
    @PostMapping("/submit")
    public ApiResponse<UserAnswer> submitAnswer(@RequestBody AnswerSubmitRequest request,
                                               @RequestParam Long userId) {
        try {
            UserAnswer userAnswer = answerService.submitAnswer(request, userId);
            return ApiResponse.success("提交成功", userAnswer);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/user/{userId}")
    public ApiResponse<List<UserAnswer>> getUserAnswers(@PathVariable Long userId) {
        try {
            List<UserAnswer> answers = answerService.getUserAnswers(userId);
            return ApiResponse.success(answers);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/user/{userId}/question-set/{questionSetId}")
    public ApiResponse<List<UserAnswer>> getUserAnswersByQuestionSet(
            @PathVariable Long userId,
            @PathVariable Long questionSetId) {
        try {
            List<UserAnswer> answers = answerService.getUserAnswersByQuestionSet(userId, questionSetId);
            return ApiResponse.success(answers);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
