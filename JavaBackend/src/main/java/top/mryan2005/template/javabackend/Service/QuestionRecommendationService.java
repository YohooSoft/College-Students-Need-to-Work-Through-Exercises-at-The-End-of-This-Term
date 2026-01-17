package top.mryan2005.template.javabackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import top.mryan2005.template.javabackend.Pojo.Question;
import top.mryan2005.template.javabackend.Pojo.UserAnswer;
import top.mryan2005.template.javabackend.Repository.QuestionRepository;
import top.mryan2005.template.javabackend.Repository.UserAnswerRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuestionRecommendationService {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private UserAnswerRepository userAnswerRepository;
    
    /**
     * 基于用户答题历史推荐题目
     */
    public List<Question> recommendQuestionsForUser(Long userId, int limit) {
        List<UserAnswer> userAnswers = userAnswerRepository.findByUserId(userId);
        
        if (userAnswers.isEmpty()) {
            // 如果用户没有答题记录，推荐随机题目
            return getRandomQuestions(limit);
        }
        
        // 分析用户的弱项
        Map<Question.QuestionType, Long> typeErrorCount = userAnswers.stream()
            .filter(answer -> answer.getIsCorrect() == null || !answer.getIsCorrect())
            .map(UserAnswer::getQuestion)
            .collect(Collectors.groupingBy(Question::getType, Collectors.counting()));
        
        Map<Question.DifficultyLevel, Long> difficultyErrorCount = userAnswers.stream()
            .filter(answer -> answer.getIsCorrect() == null || !answer.getIsCorrect())
            .map(UserAnswer::getQuestion)
            .collect(Collectors.groupingBy(Question::getDifficulty, Collectors.counting()));
        
        // 获取已答过的题目ID
        Set<Long> answeredQuestionIds = userAnswers.stream()
            .map(answer -> answer.getQuestion().getId())
            .collect(Collectors.toSet());
        
        // 获取所有题目
        List<Question> allQuestions = questionRepository.findAll();
        
        // 推荐策略：优先推荐用户错误率高的类型和难度的题目
        List<Question> recommendedQuestions = allQuestions.stream()
            .filter(q -> !answeredQuestionIds.contains(q.getId())) // 过滤已答题目
            .sorted((q1, q2) -> {
                // 计算推荐分数
                long score1 = typeErrorCount.getOrDefault(q1.getType(), 0L) * 2 
                            + difficultyErrorCount.getOrDefault(q1.getDifficulty(), 0L);
                long score2 = typeErrorCount.getOrDefault(q2.getType(), 0L) * 2 
                            + difficultyErrorCount.getOrDefault(q2.getDifficulty(), 0L);
                return Long.compare(score2, score1); // 降序排列
            })
            .limit(limit)
            .collect(Collectors.toList());
        
        // 如果推荐的题目不足，补充随机题目
        if (recommendedQuestions.size() < limit) {
            List<Question> randomQuestions = allQuestions.stream()
                .filter(q -> !answeredQuestionIds.contains(q.getId()))
                .filter(q -> !recommendedQuestions.contains(q))
                .limit(limit - recommendedQuestions.size())
                .collect(Collectors.toList());
            recommendedQuestions.addAll(randomQuestions);
        }
        
        return recommendedQuestions;
    }
    
    /**
     * 基于题目相似度推荐
     */
    public List<Question> recommendSimilarQuestions(Long questionId, int limit) {
        Question baseQuestion = questionRepository.findById(questionId)
            .orElseThrow(() -> new RuntimeException("题目不存在"));
        
        List<Question> allQuestions = questionRepository.findAll();
        
        return allQuestions.stream()
            .filter(q -> !q.getId().equals(questionId))
            .sorted((q1, q2) -> {
                // 相似度评分：相同类型+3分，相同难度+2分，相同标签+1分
                int score1 = calculateSimilarityScore(baseQuestion, q1);
                int score2 = calculateSimilarityScore(baseQuestion, q2);
                return Integer.compare(score2, score1);
            })
            .limit(limit)
            .collect(Collectors.toList());
    }
    
    /**
     * 根据难度推荐题目
     */
    public List<Question> recommendByDifficulty(Question.DifficultyLevel difficulty, int limit) {
        List<Question> questions = questionRepository.findAll();
        
        return questions.stream()
            .filter(q -> q.getDifficulty() == difficulty)
            .limit(limit)
            .collect(Collectors.toList());
    }
    
    /**
     * 智能推荐：基于学习曲线
     */
    public List<Question> smartRecommend(Long userId, int limit) {
        List<UserAnswer> userAnswers = userAnswerRepository.findByUserId(userId);
        
        if (userAnswers.isEmpty()) {
            // 新用户：从简单题目开始
            return recommendByDifficulty(Question.DifficultyLevel.EASY, limit);
        }
        
        // 计算用户的正确率
        long correctCount = userAnswers.stream()
            .filter(answer -> answer.getIsCorrect() != null && answer.getIsCorrect())
            .count();
        double correctRate = (double) correctCount / userAnswers.size();
        
        // 根据正确率推荐不同难度
        Question.DifficultyLevel recommendedDifficulty;
        if (correctRate < 0.5) {
            recommendedDifficulty = Question.DifficultyLevel.EASY;
        } else if (correctRate < 0.75) {
            recommendedDifficulty = Question.DifficultyLevel.MEDIUM;
        } else {
            recommendedDifficulty = Question.DifficultyLevel.HARD;
        }
        
        // 获取已答过的题目ID
        Set<Long> answeredQuestionIds = userAnswers.stream()
            .map(answer -> answer.getQuestion().getId())
            .collect(Collectors.toSet());
        
        List<Question> allQuestions = questionRepository.findAll();
        
        return allQuestions.stream()
            .filter(q -> !answeredQuestionIds.contains(q.getId()))
            .filter(q -> q.getDifficulty() == recommendedDifficulty)
            .limit(limit)
            .collect(Collectors.toList());
    }
    
    private List<Question> getRandomQuestions(int limit) {
        List<Question> allQuestions = questionRepository.findAll();
        Collections.shuffle(allQuestions);
        return allQuestions.stream().limit(limit).collect(Collectors.toList());
    }
    
    private int calculateSimilarityScore(Question q1, Question q2) {
        int score = 0;
        
        if (q1.getType() == q2.getType()) {
            score += 3;
        }
        
        if (q1.getDifficulty() == q2.getDifficulty()) {
            score += 2;
        }
        
        // 检查标签相似度
        if (q1.getTags() != null && q2.getTags() != null) {
            String[] tags1 = q1.getTags().split(",");
            String[] tags2 = q2.getTags().split(",");
            long commonTags = Arrays.stream(tags1)
                .filter(tag -> Arrays.asList(tags2).contains(tag))
                .count();
            score += (int) commonTags;
        }
        
        return score;
    }
}
