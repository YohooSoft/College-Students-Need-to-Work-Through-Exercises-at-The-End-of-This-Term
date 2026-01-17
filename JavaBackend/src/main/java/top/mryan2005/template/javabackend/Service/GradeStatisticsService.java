package top.mryan2005.template.javabackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import top.mryan2005.template.javabackend.Pojo.ExamResult;
import top.mryan2005.template.javabackend.Repository.ExamResultRepository;
import top.mryan2005.template.javabackend.Repository.UserAnswerRepository;
import top.mryan2005.template.javabackend.Pojo.UserAnswer;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GradeStatisticsService {
    
    @Autowired
    private ExamResultRepository examResultRepository;
    
    @Autowired
    private UserAnswerRepository userAnswerRepository;
    
    /**
     * 获取试卷的成绩统计
     */
    public Map<String, Object> getExamPaperStatistics(Long examPaperId) {
        List<ExamResult> results = examResultRepository.findByExamPaperId(examPaperId);
        
        Map<String, Object> statistics = new HashMap<>();
        
        if (results.isEmpty()) {
            statistics.put("totalSubmissions", 0);
            statistics.put("averageScore", 0.0);
            statistics.put("passRate", 0.0);
            statistics.put("maxScore", 0);
            statistics.put("minScore", 0);
            return statistics;
        }
        
        int totalSubmissions = results.size();
        double averageScore = results.stream()
            .mapToInt(ExamResult::getScore)
            .average()
            .orElse(0.0);
        
        long passedCount = results.stream()
            .filter(ExamResult::getIsPassed)
            .count();
        
        double passRate = (double) passedCount / totalSubmissions * 100;
        
        int maxScore = results.stream()
            .mapToInt(ExamResult::getScore)
            .max()
            .orElse(0);
        
        int minScore = results.stream()
            .mapToInt(ExamResult::getScore)
            .min()
            .orElse(0);
        
        // 分数分布
        Map<String, Integer> scoreDistribution = new HashMap<>();
        scoreDistribution.put("0-59", 0);
        scoreDistribution.put("60-69", 0);
        scoreDistribution.put("70-79", 0);
        scoreDistribution.put("80-89", 0);
        scoreDistribution.put("90-100", 0);
        
        for (ExamResult result : results) {
            int score = result.getScore();
            if (score < 60) {
                scoreDistribution.merge("0-59", 1, Integer::sum);
            } else if (score < 70) {
                scoreDistribution.merge("60-69", 1, Integer::sum);
            } else if (score < 80) {
                scoreDistribution.merge("70-79", 1, Integer::sum);
            } else if (score < 90) {
                scoreDistribution.merge("80-89", 1, Integer::sum);
            } else {
                scoreDistribution.merge("90-100", 1, Integer::sum);
            }
        }
        
        statistics.put("totalSubmissions", totalSubmissions);
        statistics.put("averageScore", Math.round(averageScore * 100.0) / 100.0);
        statistics.put("passRate", Math.round(passRate * 100.0) / 100.0);
        statistics.put("maxScore", maxScore);
        statistics.put("minScore", minScore);
        statistics.put("scoreDistribution", scoreDistribution);
        
        return statistics;
    }
    
    /**
     * 获取用户的成绩统计
     */
    public Map<String, Object> getUserStatistics(Long userId) {
        List<ExamResult> results = examResultRepository.findByUserId(userId);
        List<UserAnswer> answers = userAnswerRepository.findByUserId(userId);
        
        Map<String, Object> statistics = new HashMap<>();
        
        if (results.isEmpty() && answers.isEmpty()) {
            statistics.put("totalExams", 0);
            statistics.put("totalQuestions", 0);
            statistics.put("averageScore", 0.0);
            statistics.put("passRate", 0.0);
            statistics.put("correctRate", 0.0);
            return statistics;
        }
        
        int totalExams = results.size();
        double averageScore = results.stream()
            .mapToInt(ExamResult::getScore)
            .average()
            .orElse(0.0);
        
        long passedCount = results.stream()
            .filter(ExamResult::getIsPassed)
            .count();
        
        double passRate = totalExams > 0 ? (double) passedCount / totalExams * 100 : 0.0;
        
        int totalQuestions = answers.size();
        long correctAnswers = answers.stream()
            .filter(answer -> answer.getIsCorrect() != null && answer.getIsCorrect())
            .count();
        
        double correctRate = totalQuestions > 0 ? (double) correctAnswers / totalQuestions * 100 : 0.0;
        
        statistics.put("totalExams", totalExams);
        statistics.put("totalQuestions", totalQuestions);
        statistics.put("averageScore", Math.round(averageScore * 100.0) / 100.0);
        statistics.put("passRate", Math.round(passRate * 100.0) / 100.0);
        statistics.put("correctRate", Math.round(correctRate * 100.0) / 100.0);
        statistics.put("correctAnswers", correctAnswers);
        
        return statistics;
    }
    
    /**
     * 获取题目的统计数据
     */
    public Map<String, Object> getQuestionStatistics(Long questionId) {
        List<UserAnswer> answers = userAnswerRepository.findByQuestionId(questionId);
        
        Map<String, Object> statistics = new HashMap<>();
        
        if (answers.isEmpty()) {
            statistics.put("totalAttempts", 0);
            statistics.put("correctRate", 0.0);
            return statistics;
        }
        
        int totalAttempts = answers.size();
        long correctAnswers = answers.stream()
            .filter(answer -> answer.getIsCorrect() != null && answer.getIsCorrect())
            .count();
        
        double correctRate = (double) correctAnswers / totalAttempts * 100;
        
        statistics.put("totalAttempts", totalAttempts);
        statistics.put("correctRate", Math.round(correctRate * 100.0) / 100.0);
        statistics.put("correctAnswers", correctAnswers);
        
        return statistics;
    }
}
