package top.mryan2005.template.javabackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import top.mryan2005.template.javabackend.Pojo.Question;
import top.mryan2005.template.javabackend.Pojo.QuestionSet;
import top.mryan2005.template.javabackend.Pojo.User;
import top.mryan2005.template.javabackend.Pojo.Dto.QuestionSetRequest;
import top.mryan2005.template.javabackend.Repository.QuestionSetRepository;
import top.mryan2005.template.javabackend.Exception.ResourceNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionSetService {
    
    @Autowired
    private QuestionSetRepository questionSetRepository;
    
    @Autowired
    private QuestionService questionService;
    
    @Autowired
    private UserService userService;
    
    @Transactional
    public QuestionSet createQuestionSet(QuestionSetRequest request, Long userId) {
        User creator = userService.getUserById(userId);
        
        List<Question> questions = request.getQuestionIds().stream()
            .map(questionService::getQuestionById)
            .collect(Collectors.toList());
        
        QuestionSet questionSet = new QuestionSet();
        questionSet.setTitle(request.getTitle());
        questionSet.setDescription(request.getDescription());
        questionSet.setCreator(creator);
        questionSet.setQuestions(questions);
        questionSet.setTimeLimit(request.getTimeLimit());
        questionSet.setTotalScore(request.getTotalScore());
        questionSet.setIsPublic(request.getIsPublic() != null ? request.getIsPublic() : false);
        questionSet.setCreatedAt(LocalDateTime.now());
        questionSet.setUpdatedAt(LocalDateTime.now());
        
        return questionSetRepository.save(questionSet);
    }
    
    @Transactional
    public QuestionSet updateQuestionSet(Long id, QuestionSetRequest request, Long userId) {
        QuestionSet questionSet = questionSetRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("试卷不存在"));
        
        if (!questionSet.getCreator().getId().equals(userId)) {
            throw new IllegalArgumentException("无权限修改此试卷");
        }
        
        List<Question> questions = request.getQuestionIds().stream()
            .map(questionService::getQuestionById)
            .collect(Collectors.toList());
        
        questionSet.setTitle(request.getTitle());
        questionSet.setDescription(request.getDescription());
        questionSet.setQuestions(questions);
        questionSet.setTimeLimit(request.getTimeLimit());
        questionSet.setTotalScore(request.getTotalScore());
        questionSet.setIsPublic(request.getIsPublic());
        questionSet.setUpdatedAt(LocalDateTime.now());
        
        return questionSetRepository.save(questionSet);
    }
    
    public QuestionSet getQuestionSetById(Long id) {
        return questionSetRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("试卷不存在"));
    }
    
    public List<QuestionSet> getAllQuestionSets() {
        return questionSetRepository.findAll();
    }
    
    public List<QuestionSet> getQuestionSetsByCreator(Long creatorId) {
        return questionSetRepository.findByCreatorId(creatorId);
    }
    
    public List<QuestionSet> getPublicQuestionSets() {
        return questionSetRepository.findByIsPublicTrue();
    }
    
    @Transactional
    public void deleteQuestionSet(Long id, Long userId) {
        QuestionSet questionSet = questionSetRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("试卷不存在"));
        
        if (!questionSet.getCreator().getId().equals(userId)) {
            throw new IllegalArgumentException("无权限删除此试卷");
        }
        
        questionSetRepository.delete(questionSet);
    }
}
