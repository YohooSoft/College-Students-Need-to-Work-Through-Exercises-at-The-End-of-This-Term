import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionAPI } from '../api';
import type { Question } from '../api';
import { useAuth } from '../AuthContext';

const Home: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionAPI.getAll();
      if (response.data.success) {
        setQuestions(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await questionAPI.search({ keyword: searchKeyword });
      if (response.data.success) {
        setQuestions(response.data.data.content || response.data.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      SINGLE_CHOICE: '单选题',
      MULTIPLE_CHOICE: '多选题',
      TRUE_FALSE: '判断题',
      FILL_BLANK: '填空题',
      SHORT_ANSWER: '简答题',
      ESSAY: '概述题',
    };
    return types[type] || type;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const levels: Record<string, string> = {
      EASY: '简单',
      MEDIUM: '中等',
      HARD: '困难',
    };
    return levels[difficulty] || difficulty;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>题库管理系统</h1>
      
      {user && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '5px' }}>
          <p>欢迎, {user.fullName || user.username}! 
            <span style={{ marginLeft: '10px', color: '#666' }}>
              角色: {user.role === 'SVIP' ? 'SVIP会员' : user.role === 'VIP' ? 'VIP会员' : '普通用户'}
            </span>
          </p>
        </div>
      )}

      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Link to="/questions/search" style={{ padding: '10px 20px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          搜索题目
        </Link>
        <Link to="/questions/create" style={{ padding: '10px 20px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          创建题目
        </Link>
        <Link to="/question-sets" style={{ padding: '10px 20px', background: '#17a2b8', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          试卷列表
        </Link>
        <Link to="/question-sets/create" style={{ padding: '10px 20px', background: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '5px' }}>
          组卷
        </Link>
        <Link to="/collections" style={{ padding: '10px 20px', background: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          收藏夹
        </Link>
        <Link to="/my-answers" style={{ padding: '10px 20px', background: '#9b59b6', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          我的答题
        </Link>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="搜索题目..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1, padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '5px' }}
        />
        <button onClick={handleSearch} style={{ padding: '10px 20px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          搜索
        </button>
      </div>

      {loading ? (
        <p>加载中...</p>
      ) : (
        <div>
          <h2>题目列表 ({questions.length})</h2>
          {questions.length === 0 ? (
            <p>暂无题目</p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {questions.map((question) => (
                <div key={question.id} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, flex: 1 }}>{question.title}</h3>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <span style={{ padding: '2px 8px', background: '#e3f2fd', color: '#1976d2', borderRadius: '3px', fontSize: '12px' }}>
                        {getQuestionTypeLabel(question.type)}
                      </span>
                      <span style={{ padding: '2px 8px', background: '#f3e5f5', color: '#7b1fa2', borderRadius: '3px', fontSize: '12px' }}>
                        {getDifficultyLabel(question.difficulty)}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: '#666', marginBottom: '10px' }}>{question.content.substring(0, 200)}...</p>
                  {question.tags && (
                    <div style={{ marginBottom: '10px' }}>
                      {question.tags.split(',').map((tag, index) => (
                        <span key={index} style={{ marginRight: '5px', padding: '2px 8px', background: '#e0e0e0', borderRadius: '3px', fontSize: '12px' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link to={`/questions/${question.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                    查看详情 →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
