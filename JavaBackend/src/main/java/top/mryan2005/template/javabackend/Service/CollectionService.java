package top.mryan2005.template.javabackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import top.mryan2005.template.javabackend.Pojo.Collection;
import top.mryan2005.template.javabackend.Pojo.Question;
import top.mryan2005.template.javabackend.Pojo.User;
import top.mryan2005.template.javabackend.Repository.CollectionRepository;
import top.mryan2005.template.javabackend.Exception.ResourceNotFoundException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CollectionService {
    
    @Autowired
    private CollectionRepository collectionRepository;
    
    @Autowired
    private QuestionService questionService;
    
    @Autowired
    private UserService userService;
    
    @Transactional
    public Collection addToCollection(Long questionId, String notes, Long userId) {
        User user = userService.getUserById(userId);
        Question question = questionService.getQuestionById(questionId);
        
        if (collectionRepository.existsByUserIdAndQuestionId(userId, questionId)) {
            throw new IllegalArgumentException("该题目已在收藏夹中");
        }
        
        Collection collection = new Collection();
        collection.setUser(user);
        collection.setQuestion(question);
        collection.setNotes(notes);
        collection.setCreatedAt(LocalDateTime.now());
        
        return collectionRepository.save(collection);
    }
    
    @Transactional
    public void removeFromCollection(Long collectionId, Long userId) {
        Collection collection = collectionRepository.findById(collectionId)
            .orElseThrow(() -> new ResourceNotFoundException("收藏记录不存在"));
        
        if (!collection.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("无权限删除此收藏");
        }
        
        collectionRepository.delete(collection);
    }
    
    @Transactional
    public Collection updateCollectionNotes(Long collectionId, String notes, Long userId) {
        Collection collection = collectionRepository.findById(collectionId)
            .orElseThrow(() -> new ResourceNotFoundException("收藏记录不存在"));
        
        if (!collection.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("无权限修改此收藏");
        }
        
        collection.setNotes(notes);
        return collectionRepository.save(collection);
    }
    
    public List<Collection> getUserCollections(Long userId) {
        return collectionRepository.findByUserId(userId);
    }
    
    public boolean isCollected(Long userId, Long questionId) {
        return collectionRepository.existsByUserIdAndQuestionId(userId, questionId);
    }
}
