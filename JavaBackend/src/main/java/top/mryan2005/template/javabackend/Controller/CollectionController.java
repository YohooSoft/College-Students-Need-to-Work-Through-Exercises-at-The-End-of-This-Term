package top.mryan2005.template.javabackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import top.mryan2005.template.javabackend.Pojo.Collection;
import top.mryan2005.template.javabackend.Response.ApiResponse;
import top.mryan2005.template.javabackend.Service.CollectionService;
import java.util.List;

@RestController
@RequestMapping("/api/collections")
@CrossOrigin(origins = "*")
public class CollectionController {
    
    @Autowired
    private CollectionService collectionService;
    
    @PostMapping
    public ApiResponse<Collection> addToCollection(@RequestParam Long questionId,
                                                  @RequestParam(required = false) String notes,
                                                  @RequestParam Long userId) {
        try {
            Collection collection = collectionService.addToCollection(questionId, notes, userId);
            return ApiResponse.success("收藏成功", collection);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ApiResponse<Void> removeFromCollection(@PathVariable Long id, @RequestParam Long userId) {
        try {
            collectionService.removeFromCollection(id, userId);
            return ApiResponse.success("取消收藏成功", null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PutMapping("/{id}/notes")
    public ApiResponse<Collection> updateCollectionNotes(@PathVariable Long id,
                                                        @RequestParam String notes,
                                                        @RequestParam Long userId) {
        try {
            Collection collection = collectionService.updateCollectionNotes(id, notes, userId);
            return ApiResponse.success("更新成功", collection);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/user/{userId}")
    public ApiResponse<List<Collection>> getUserCollections(@PathVariable Long userId) {
        try {
            List<Collection> collections = collectionService.getUserCollections(userId);
            return ApiResponse.success(collections);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/check")
    public ApiResponse<Boolean> isCollected(@RequestParam Long userId, @RequestParam Long questionId) {
        try {
            boolean isCollected = collectionService.isCollected(userId, questionId);
            return ApiResponse.success(isCollected);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
