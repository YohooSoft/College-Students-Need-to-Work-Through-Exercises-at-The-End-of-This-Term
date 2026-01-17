package top.mryan2005.template.javabackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import top.mryan2005.template.javabackend.Pojo.ExamPaper;
import top.mryan2005.template.javabackend.Pojo.Dto.ExamPaperRequest;
import top.mryan2005.template.javabackend.Response.ApiResponse;
import top.mryan2005.template.javabackend.Service.ExamPaperService;

import java.util.List;

@RestController
@RequestMapping("/api/exam-papers")
@CrossOrigin(origins = "*")
public class ExamPaperController {
    
    @Autowired
    private ExamPaperService examPaperService;
    
    @PostMapping
    public ApiResponse<ExamPaper> createExamPaper(
            @RequestParam Long userId,
            @RequestBody ExamPaperRequest request) {
        try {
            ExamPaper examPaper = examPaperService.createExamPaper(userId, request);
            return ApiResponse.success(examPaper);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ApiResponse<ExamPaper> updateExamPaper(
            @PathVariable Long id,
            @RequestBody ExamPaperRequest request) {
        try {
            ExamPaper examPaper = examPaperService.updateExamPaper(id, request);
            return ApiResponse.success(examPaper);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PostMapping("/{id}/publish")
    public ApiResponse<ExamPaper> publishExamPaper(@PathVariable Long id) {
        try {
            ExamPaper examPaper = examPaperService.publishExamPaper(id);
            return ApiResponse.success(examPaper);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ApiResponse<ExamPaper> getExamPaper(@PathVariable Long id) {
        try {
            ExamPaper examPaper = examPaperService.getExamPaperById(id);
            return ApiResponse.success(examPaper);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping
    public ApiResponse<List<ExamPaper>> getAllExamPapers() {
        try {
            List<ExamPaper> examPapers = examPaperService.getAllExamPapers();
            return ApiResponse.success(examPapers);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/public")
    public ApiResponse<List<ExamPaper>> getPublicExamPapers() {
        try {
            List<ExamPaper> examPapers = examPaperService.getPublicExamPapers();
            return ApiResponse.success(examPapers);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/creator/{creatorId}")
    public ApiResponse<List<ExamPaper>> getExamPapersByCreator(@PathVariable Long creatorId) {
        try {
            List<ExamPaper> examPapers = examPaperService.getExamPapersByCreator(creatorId);
            return ApiResponse.success(examPapers);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/status/{status}")
    public ApiResponse<List<ExamPaper>> getExamPapersByStatus(@PathVariable String status) {
        try {
            ExamPaper.ExamStatus examStatus = ExamPaper.ExamStatus.valueOf(status.toUpperCase());
            List<ExamPaper> examPapers = examPaperService.getExamPapersByStatus(examStatus);
            return ApiResponse.success(examPapers);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/search")
    public ApiResponse<List<ExamPaper>> searchExamPapers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isPublic) {
        try {
            List<ExamPaper> examPapers = examPaperService.searchExamPapers(keyword, isPublic);
            return ApiResponse.success(examPapers);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteExamPaper(@PathVariable Long id) {
        try {
            examPaperService.deleteExamPaper(id);
            return ApiResponse.success(null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
