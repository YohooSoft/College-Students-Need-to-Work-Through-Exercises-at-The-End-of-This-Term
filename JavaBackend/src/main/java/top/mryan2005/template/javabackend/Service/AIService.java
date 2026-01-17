package top.mryan2005.template.javabackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;

@Service
public class AIService {
    
    @Autowired(required = false)
    private OpenAiChatModel chatModel;
    
    /**
     * 生成AI讲解
     */
    public String generateExplanation(String questionTitle, String questionContent, String answer) {
        if (chatModel == null) {
            return "AI服务未配置";
        }
        
        try {
            String prompt = String.format(
                "请为以下题目生成详细的讲解说明：\n\n" +
                "题目：%s\n" +
                "内容：%s\n" +
                "答案：%s\n\n" +
                "请提供清晰、易懂的讲解，帮助学生理解这道题目。",
                questionTitle, questionContent, answer
            );
            
            return chatModel.call(prompt);
        } catch (Exception e) {
            return "AI讲解生成失败：" + e.getMessage();
        }
    }
    
    /**
     * AI判题 - 用于概述题（Essay类型）
     * 支持Markdown、Mermaid和LaTeX格式
     */
    public AIGradingResult gradeEssay(String questionContent, String expectedAnswer, String studentAnswer) {
        if (chatModel == null) {
            return new AIGradingResult(false, 0, "AI服务未配置", "");
        }
        
        try {
            String prompt = String.format(
                "你是一位经验丰富的教师，请评判学生的概述题答案。\n\n" +
                "题目：%s\n\n" +
                "参考答案：%s\n\n" +
                "学生答案：%s\n\n" +
                "请按以下格式返回评判结果：\n" +
                "1. 第一行：CORRECT 或 INCORRECT\n" +
                "2. 第二行：分数（0-100）\n" +
                "3. 第三行开始：详细的评语和建议\n\n" +
                "评分标准：\n" +
                "- 内容准确性（40分）\n" +
                "- 逻辑清晰度（30分）\n" +
                "- 完整性（20分）\n" +
                "- 表达能力（10分）\n\n" +
                "注意：学生答案可能包含Markdown格式、Mermaid图表或LaTeX公式，请考虑格式的正确性。",
                questionContent, expectedAnswer, studentAnswer
            );
            
            String response = chatModel.call(prompt);
            return parseAIGradingResponse(response);
            
        } catch (Exception e) {
            return new AIGradingResult(false, 0, "AI判题失败：" + e.getMessage(), "");
        }
    }
    
    /**
     * 解析AI判题响应
     */
    private AIGradingResult parseAIGradingResponse(String response) {
        try {
            String[] lines = response.split("\n", 3);
            
            boolean isCorrect = lines.length > 0 && lines[0].trim().toUpperCase().contains("CORRECT");
            
            int score = 0;
            if (lines.length > 1) {
                String scoreLine = lines[1].trim().replaceAll("[^0-9]", "");
                if (!scoreLine.isEmpty()) {
                    score = Integer.parseInt(scoreLine);
                }
            }
            
            String feedback = lines.length > 2 ? lines[2].trim() : "";
            
            return new AIGradingResult(isCorrect, score, feedback, response);
            
        } catch (Exception e) {
            return new AIGradingResult(false, 0, "解析AI响应失败", response);
        }
    }
    
    /**
     * AI判题结果
     */
    public static class AIGradingResult {
        private boolean correct;
        private int score;
        private String feedback;
        private String rawResponse;
        
        public AIGradingResult(boolean correct, int score, String feedback, String rawResponse) {
            this.correct = correct;
            this.score = score;
            this.feedback = feedback;
            this.rawResponse = rawResponse;
        }
        
        public boolean isCorrect() {
            return correct;
        }
        
        public int getScore() {
            return score;
        }
        
        public String getFeedback() {
            return feedback;
        }
        
        public String getRawResponse() {
            return rawResponse;
        }
    }
}
