package top.mryan2005.template.javabackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import top.mryan2005.template.javabackend.Pojo.User;
import top.mryan2005.template.javabackend.Pojo.Dto.LoginRequest;
import top.mryan2005.template.javabackend.Pojo.Dto.RegisterRequest;
import top.mryan2005.template.javabackend.Pojo.Dto.UserStatistics;
import top.mryan2005.template.javabackend.Repository.UserRepository;
import top.mryan2005.template.javabackend.Repository.UserAnswerRepository;
import top.mryan2005.template.javabackend.Repository.QuestionRepository;
import top.mryan2005.template.javabackend.Repository.QuestionSetRepository;
import top.mryan2005.template.javabackend.Exception.ResourceNotFoundException;
import java.time.LocalDateTime;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private UserAnswerRepository userAnswerRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private QuestionSetRepository questionSetRepository;
    
    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("用户名已存在");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("邮箱已被注册");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole(User.UserRole.NORMAL);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }
    
    public User login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("密码错误");
        }
        
        return user;
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));
    }
    
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));
    }
    
    public java.util.List<User> searchUsers(String keyword) {
        return userRepository.searchUsers(keyword);
    }
    
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public UserStatistics getUserStatistics(Long userId) {
        User user = getUserById(userId);
        
        // 获取统计数据
        Long completedQuestionsCount = userAnswerRepository.countDistinctQuestionsByUserId(userId);
        Long correctAnswersCount = userAnswerRepository.countCorrectAnswersByUserId(userId);
        Long addedQuestionsCount = questionRepository.countByCreatorId(userId);
        Long createdQuestionSetsCount = questionSetRepository.countByCreatorId(userId);
        
        // 计算总得分
        Integer totalScore = userAnswerRepository.findByUserId(userId).stream()
            .mapToInt(ua -> ua.getScore() != null ? ua.getScore() : 0)
            .sum();
        
        UserStatistics stats = new UserStatistics();
        stats.setUserId(userId);
        stats.setUsername(user.getUsername());
        stats.setFullName(user.getFullName());
        stats.setRole(user.getRole().name());
        stats.setCompletedQuestionsCount(completedQuestionsCount);
        stats.setCorrectAnswersCount(correctAnswersCount);
        stats.setAddedQuestionsCount(addedQuestionsCount);
        stats.setCreatedQuestionSetsCount(createdQuestionSetsCount);
        stats.setTotalScore(totalScore);
        
        return stats;
    }
}
