package top.mryan2005.template.javabackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import top.mryan2005.template.javabackend.Exception.ResourceNotFoundException;
import top.mryan2005.template.javabackend.Pojo.ExamPaper;
import top.mryan2005.template.javabackend.Pojo.Question;
import top.mryan2005.template.javabackend.Pojo.User;
import top.mryan2005.template.javabackend.Pojo.Dto.ExamPaperRequest;
import top.mryan2005.template.javabackend.Repository.ExamPaperRepository;
import top.mryan2005.template.javabackend.Repository.QuestionRepository;
import top.mryan2005.template.javabackend.Repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExamPaperService {
    
    @Autowired
    private ExamPaperRepository examPaperRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public ExamPaper createExamPaper(Long creatorId, ExamPaperRequest request) {
        User creator = userRepository.findById(creatorId)
            .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));
        
        ExamPaper examPaper = new ExamPaper();
        examPaper.setTitle(request.getTitle());
        examPaper.setDescription(request.getDescription());
        examPaper.setCreator(creator);
        examPaper.setTimeLimit(request.getTimeLimit());
        examPaper.setTotalScore(request.getTotalScore());
        examPaper.setPassScore(request.getPassScore());
        examPaper.setIsPublic(request.getIsPublic() != null ? request.getIsPublic() : false);
        examPaper.setStartTime(request.getStartTime());
        examPaper.setEndTime(request.getEndTime());
        examPaper.setStatus(ExamPaper.ExamStatus.DRAFT);
        
        if (request.getQuestionIds() != null && !request.getQuestionIds().isEmpty()) {
            List<Question> questions = questionRepository.findAllById(request.getQuestionIds());
            examPaper.setQuestions(questions);
        }
        
        return examPaperRepository.save(examPaper);
    }
    
    @Transactional
    public ExamPaper updateExamPaper(Long id, ExamPaperRequest request) {
        ExamPaper examPaper = examPaperRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("试卷不存在"));
        
        examPaper.setTitle(request.getTitle());
        examPaper.setDescription(request.getDescription());
        examPaper.setTimeLimit(request.getTimeLimit());
        examPaper.setTotalScore(request.getTotalScore());
        examPaper.setPassScore(request.getPassScore());
        examPaper.setIsPublic(request.getIsPublic());
        examPaper.setStartTime(request.getStartTime());
        examPaper.setEndTime(request.getEndTime());
        examPaper.setUpdatedAt(LocalDateTime.now());
        
        if (request.getQuestionIds() != null) {
            List<Question> questions = questionRepository.findAllById(request.getQuestionIds());
            examPaper.setQuestions(questions);
        }
        
        return examPaperRepository.save(examPaper);
    }
    
    @Transactional
    public ExamPaper publishExamPaper(Long id) {
        ExamPaper examPaper = examPaperRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("试卷不存在"));
        
        examPaper.setStatus(ExamPaper.ExamStatus.PUBLISHED);
        examPaper.setUpdatedAt(LocalDateTime.now());
        
        return examPaperRepository.save(examPaper);
    }
    
    public ExamPaper getExamPaperById(Long id) {
        return examPaperRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("试卷不存在"));
    }
    
    public List<ExamPaper> getAllExamPapers() {
        return examPaperRepository.findAll();
    }
    
    public List<ExamPaper> getPublicExamPapers() {
        return examPaperRepository.findByIsPublicTrue();
    }
    
    public List<ExamPaper> getExamPapersByCreator(Long creatorId) {
        return examPaperRepository.findByCreatorId(creatorId);
    }
    
    public List<ExamPaper> getExamPapersByStatus(ExamPaper.ExamStatus status) {
        return examPaperRepository.findByStatus(status);
    }
    
    public List<ExamPaper> searchExamPapers(String keyword, Boolean isPublic) {
        return examPaperRepository.searchExamPapers(keyword, isPublic);
    }
    
    @Transactional
    public void deleteExamPaper(Long id) {
        if (!examPaperRepository.existsById(id)) {
            throw new ResourceNotFoundException("试卷不存在");
        }
        examPaperRepository.deleteById(id);
    }
}
