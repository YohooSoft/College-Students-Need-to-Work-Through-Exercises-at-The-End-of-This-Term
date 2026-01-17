package top.mryan2005.template.javabackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import top.mryan2005.template.javabackend.Pojo.Question;
import top.mryan2005.template.javabackend.Pojo.User;
import top.mryan2005.template.javabackend.Pojo.Dto.QuestionRequest;
import top.mryan2005.template.javabackend.Repository.QuestionRepository;
import top.mryan2005.template.javabackend.Exception.ResourceNotFoundException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuestionService {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private UserService userService;
    
    @Transactional
    public Question createQuestion(QuestionRequest request, Long userId) {
        User creator = userService.getUserById(userId);
        
        Question question = new Question();
        question.setTitle(request.getTitle());
        question.setContent(request.getContent());
        question.setType(request.getType());
        question.setOptions(request.getOptions());
        question.setAnswer(request.getAnswer());
        question.setExplanation(request.getExplanation());
        question.setDifficulty(request.getDifficulty());
        question.setTags(request.getTags());
        question.setCreator(creator);
        question.setCreatedAt(LocalDateTime.now());
        question.setUpdatedAt(LocalDateTime.now());
        
        return questionRepository.save(question);
    }
    
    @Transactional
    public Question updateQuestion(Long id, QuestionRequest request, Long userId) {
        Question question = questionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("题目不存在"));
        
        if (!question.getCreator().getId().equals(userId)) {
            throw new IllegalArgumentException("无权限修改此题目");
        }
        
        question.setTitle(request.getTitle());
        question.setContent(request.getContent());
        question.setType(request.getType());
        question.setOptions(request.getOptions());
        question.setAnswer(request.getAnswer());
        question.setExplanation(request.getExplanation());
        question.setDifficulty(request.getDifficulty());
        question.setTags(request.getTags());
        question.setUpdatedAt(LocalDateTime.now());
        
        return questionRepository.save(question);
    }
    
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("题目不存在"));
    }
    
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }
    
    public Page<Question> searchQuestions(String keyword, Question.QuestionType type, 
                                         Question.DifficultyLevel difficulty, Pageable pageable) {
        return questionRepository.searchQuestions(keyword, type, difficulty, pageable);
    }
    
    public List<Question> getQuestionsByCreator(Long creatorId) {
        return questionRepository.findByCreatorId(creatorId);
    }
    
    public Page<Question> getQuestionsByTag(String tag, Pageable pageable) {
        return questionRepository.findByTag(tag, pageable);
    }
    
    @Transactional
    public void deleteQuestion(Long id, Long userId) {
        Question question = questionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("题目不存在"));
        
        if (!question.getCreator().getId().equals(userId)) {
            throw new IllegalArgumentException("无权限删除此题目");
        }
        
        questionRepository.delete(question);
    }
}
