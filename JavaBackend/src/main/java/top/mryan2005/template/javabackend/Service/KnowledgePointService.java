package top.mryan2005.template.javabackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import top.mryan2005.template.javabackend.Pojo.KnowledgePoint;
import top.mryan2005.template.javabackend.Pojo.User;
import top.mryan2005.template.javabackend.Pojo.Dto.KnowledgePointRequest;
import top.mryan2005.template.javabackend.Repository.KnowledgePointRepository;
import top.mryan2005.template.javabackend.Exception.ResourceNotFoundException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class KnowledgePointService {
    
    @Autowired
    private KnowledgePointRepository knowledgePointRepository;
    
    @Autowired
    private UserService userService;
    
    @Transactional
    public KnowledgePoint createKnowledgePoint(KnowledgePointRequest request, Long userId) {
        User creator = userService.getUserById(userId);
        
        KnowledgePoint knowledgePoint = new KnowledgePoint();
        knowledgePoint.setTitle(request.getTitle());
        knowledgePoint.setContent(request.getContent());
        knowledgePoint.setDifficulty(request.getDifficulty());
        knowledgePoint.setCategory(request.getCategory());
        knowledgePoint.setCreator(creator);
        knowledgePoint.setCreatedAt(LocalDateTime.now());
        knowledgePoint.setUpdatedAt(LocalDateTime.now());
        
        return knowledgePointRepository.save(knowledgePoint);
    }
    
    @Transactional
    public KnowledgePoint updateKnowledgePoint(Long id, KnowledgePointRequest request, Long userId) {
        KnowledgePoint knowledgePoint = knowledgePointRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("知识点不存在"));
        
        if (!knowledgePoint.getCreator().getId().equals(userId)) {
            throw new IllegalArgumentException("无权限修改此知识点");
        }
        
        knowledgePoint.setTitle(request.getTitle());
        knowledgePoint.setContent(request.getContent());
        knowledgePoint.setDifficulty(request.getDifficulty());
        knowledgePoint.setCategory(request.getCategory());
        knowledgePoint.setUpdatedAt(LocalDateTime.now());
        
        return knowledgePointRepository.save(knowledgePoint);
    }
    
    public KnowledgePoint getKnowledgePointById(Long id) {
        return knowledgePointRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("知识点不存在"));
    }
    
    public List<KnowledgePoint> getAllKnowledgePoints() {
        return knowledgePointRepository.findAll();
    }
    
    public Page<KnowledgePoint> searchKnowledgePoints(String keyword, 
                                                      KnowledgePoint.DifficultyLevel difficulty,
                                                      String category,
                                                      Pageable pageable) {
        return knowledgePointRepository.searchKnowledgePoints(keyword, difficulty, category, pageable);
    }
    
    public List<KnowledgePoint> getKnowledgePointsByCreator(Long creatorId) {
        return knowledgePointRepository.findByCreatorId(creatorId);
    }
    
    public Page<KnowledgePoint> getKnowledgePointsByCategory(String category, Pageable pageable) {
        return knowledgePointRepository.findByCategory(category, pageable);
    }
    
    @Transactional
    public void deleteKnowledgePoint(Long id, Long userId) {
        KnowledgePoint knowledgePoint = knowledgePointRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("知识点不存在"));
        
        if (!knowledgePoint.getCreator().getId().equals(userId)) {
            throw new IllegalArgumentException("无权限删除此知识点");
        }
        
        knowledgePointRepository.delete(knowledgePoint);
    }
}
