package top.mryan2005.template.javabackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import top.mryan2005.template.javabackend.Pojo.Question;
import top.mryan2005.template.javabackend.Pojo.QuestionSet;
import top.mryan2005.template.javabackend.Pojo.User;
import top.mryan2005.template.javabackend.Pojo.UserAnswer;
import top.mryan2005.template.javabackend.Pojo.Dto.AnswerSubmitRequest;
import top.mryan2005.template.javabackend.Repository.UserAnswerRepository;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnswerService {
    
    @Autowired
    private UserAnswerRepository userAnswerRepository;
    
    @Autowired
    private QuestionService questionService;
    
    @Autowired
    private QuestionSetService questionSetService;
    
    @Autowired
    private UserService userService;
    
    @Transactional
    public UserAnswer submitAnswer(AnswerSubmitRequest request, Long userId) {
        User user = userService.getUserById(userId);
        Question question = questionService.getQuestionById(request.getQuestionId());
        QuestionSet questionSet = null;
        
        if (request.getQuestionSetId() != null) {
            questionSet = questionSetService.getQuestionSetById(request.getQuestionSetId());
        }
        
        // 判题逻辑
        boolean isCorrect = checkAnswer(question, request.getAnswer());
        
        UserAnswer userAnswer = new UserAnswer();
        userAnswer.setUser(user);
        userAnswer.setQuestion(question);
        userAnswer.setQuestionSet(questionSet);
        userAnswer.setAnswer(request.getAnswer());
        userAnswer.setIsCorrect(isCorrect);
        userAnswer.setTimeSpent(request.getTimeSpent());
        userAnswer.setSubmittedAt(LocalDateTime.now());
        
        // 计算分数
        if (isCorrect) {
            userAnswer.setScore(calculateScore(question));
        } else {
            userAnswer.setScore(0);
        }
        
        return userAnswerRepository.save(userAnswer);
    }
    
    private boolean checkAnswer(Question question, String userAnswer) {
        String correctAnswer = question.getAnswer().trim().toLowerCase();
        String submittedAnswer = userAnswer.trim().toLowerCase();
        
        switch (question.getType()) {
            case SINGLE_CHOICE:
            case TRUE_FALSE:
                return correctAnswer.equals(submittedAnswer);
            case MULTIPLE_CHOICE:
                // 对于多选题，需要排序后比较
                String[] correctOptions = correctAnswer.split(",");
                String[] submittedOptions = submittedAnswer.split(",");
                java.util.Arrays.sort(correctOptions);
                java.util.Arrays.sort(submittedOptions);
                return java.util.Arrays.equals(correctOptions, submittedOptions);
            case FILL_BLANK:
            case SHORT_ANSWER:
                // 简单的字符串包含判断，实际应用中可以使用更复杂的算法
                return correctAnswer.contains(submittedAnswer) || submittedAnswer.contains(correctAnswer);
            default:
                return false;
        }
    }
    
    private Integer calculateScore(Question question) {
        // 根据题目难度计算分数
        switch (question.getDifficulty()) {
            case EASY:
                return 5;
            case MEDIUM:
                return 10;
            case HARD:
                return 15;
            default:
                return 10;
        }
    }
    
    public List<UserAnswer> getUserAnswers(Long userId) {
        return userAnswerRepository.findByUserId(userId);
    }
    
    public List<UserAnswer> getUserAnswersByQuestionSet(Long userId, Long questionSetId) {
        return userAnswerRepository.findByUserIdAndQuestionSetId(userId, questionSetId);
    }
}
