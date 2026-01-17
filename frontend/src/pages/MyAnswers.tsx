import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { answerAPI } from '../api';
import type { UserAnswer } from '../api';
import { useAuth } from '../AuthContext';

const MyAnswers: React.FC = () => {
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert('请先登录');
      navigate('/login');
      return;
    }
    loadAnswers();
  }, [user]);

  const loadAnswers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await answerAPI.getUserAnswers(user.id);
      if (response.data.success) {
        setAnswers(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load answers:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = answers.length;
    const correct = answers.filter(a => a.isCorrect).length;
    const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
    const accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : '0';
    
    return { total, correct, totalScore, accuracy };
  };

  const stats = calculateStats();

  if (loading) return <div style={{ padding: '20px' }}>加载中...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2>我的答题记录</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginTop: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          padding: '20px', 
          background: '#e3f2fd', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976d2' }}>{stats.total}</div>
          <div style={{ color: '#666', marginTop: '5px' }}>总题数</div>
        </div>
        <div style={{ 
          padding: '20px', 
          background: '#e8f5e9', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4caf50' }}>{stats.correct}</div>
          <div style={{ color: '#666', marginTop: '5px' }}>正确数</div>
        </div>
        <div style={{ 
          padding: '20px', 
          background: '#fff3e0', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff9800' }}>{stats.accuracy}%</div>
          <div style={{ color: '#666', marginTop: '5px' }}>正确率</div>
        </div>
        <div style={{ 
          padding: '20px', 
          background: '#f3e5f5', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#9c27b0' }}>{stats.totalScore}</div>
          <div style={{ color: '#666', marginTop: '5px' }}>总得分</div>
        </div>
      </div>

      {answers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
          <p style={{ fontSize: '18px' }}>还没有答题记录</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {answers.map((answer) => (
            <div 
              key={answer.id} 
              style={{ 
                padding: '20px', 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                background: answer.isCorrect ? '#f1f8e9' : '#ffebee' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>{answer.question.title}</h3>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <strong>题目内容: </strong>
                    <span style={{ color: '#666' }}>{answer.question.content.substring(0, 100)}...</span>
                  </div>
                  
                  <div style={{ marginBottom: '5px' }}>
                    <strong>我的答案: </strong>
                    <span style={{ color: '#333' }}>{answer.answer}</span>
                  </div>
                  
                  <div style={{ marginBottom: '5px' }}>
                    <strong>正确答案: </strong>
                    <span style={{ color: '#333' }}>{answer.question.answer}</span>
                  </div>
                  
                  {answer.timeSpent && (
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
                      用时: {answer.timeSpent}秒 | 提交时间: {new Date(answer.submittedAt).toLocaleString()}
                    </div>
                  )}
                </div>
                
                <div style={{ 
                  padding: '10px 20px', 
                  background: answer.isCorrect ? '#4caf50' : '#f44336',
                  color: 'white',
                  borderRadius: '5px',
                  textAlign: 'center',
                  minWidth: '80px'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{answer.score}</div>
                  <div style={{ fontSize: '12px' }}>{answer.isCorrect ? '✓ 正确' : '✗ 错误'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAnswers;
