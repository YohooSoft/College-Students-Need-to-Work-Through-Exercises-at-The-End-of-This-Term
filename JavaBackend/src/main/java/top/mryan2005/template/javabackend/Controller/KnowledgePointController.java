package top.mryan2005.template.javabackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import top.mryan2005.template.javabackend.Pojo.KnowledgePoint;
import top.mryan2005.template.javabackend.Pojo.Dto.KnowledgePointRequest;
import top.mryan2005.template.javabackend.Response.ApiResponse;
import top.mryan2005.template.javabackend.Service.KnowledgePointService;
import java.util.List;

@RestController
@RequestMapping("/api/knowledge-points")
@CrossOrigin(origins = "*")
public class KnowledgePointController {
    
    @Autowired
    private KnowledgePointService knowledgePointService;
    
    @PostMapping
    public ApiResponse<KnowledgePoint> createKnowledgePoint(@RequestBody KnowledgePointRequest request,
                                                           @RequestParam Long userId) {
        try {
            KnowledgePoint knowledgePoint = knowledgePointService.createKnowledgePoint(request, userId);
            return ApiResponse.success("创建成功", knowledgePoint);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ApiResponse<KnowledgePoint> updateKnowledgePoint(@PathVariable Long id,
                                                           @RequestBody KnowledgePointRequest request,
                                                           @RequestParam Long userId) {
        try {
            KnowledgePoint knowledgePoint = knowledgePointService.updateKnowledgePoint(id, request, userId);
            return ApiResponse.success("更新成功", knowledgePoint);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ApiResponse<KnowledgePoint> getKnowledgePointById(@PathVariable Long id) {
        try {
            KnowledgePoint knowledgePoint = knowledgePointService.getKnowledgePointById(id);
            return ApiResponse.success(knowledgePoint);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping
    public ApiResponse<List<KnowledgePoint>> getAllKnowledgePoints() {
        try {
            List<KnowledgePoint> knowledgePoints = knowledgePointService.getAllKnowledgePoints();
            return ApiResponse.success(knowledgePoints);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/search")
    public ApiResponse<Page<KnowledgePoint>> searchKnowledgePoints(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) KnowledgePoint.DifficultyLevel difficulty,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<KnowledgePoint> knowledgePoints = knowledgePointService.searchKnowledgePoints(
                keyword, difficulty, category, pageable);
            return ApiResponse.success(knowledgePoints);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/creator/{creatorId}")
    public ApiResponse<List<KnowledgePoint>> getKnowledgePointsByCreator(@PathVariable Long creatorId) {
        try {
            List<KnowledgePoint> knowledgePoints = knowledgePointService.getKnowledgePointsByCreator(creatorId);
            return ApiResponse.success(knowledgePoints);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/category/{category}")
    public ApiResponse<Page<KnowledgePoint>> getKnowledgePointsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<KnowledgePoint> knowledgePoints = knowledgePointService.getKnowledgePointsByCategory(category, pageable);
            return ApiResponse.success(knowledgePoints);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteKnowledgePoint(@PathVariable Long id, @RequestParam Long userId) {
        try {
            knowledgePointService.deleteKnowledgePoint(id, userId);
            return ApiResponse.success("删除成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
