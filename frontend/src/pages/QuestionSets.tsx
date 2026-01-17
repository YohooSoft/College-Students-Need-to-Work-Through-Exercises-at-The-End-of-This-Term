import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionSetAPI } from '../api';
import type { QuestionSet } from '../api';
import { useAuth } from '../AuthContext';

const QuestionSets: React.FC = () => {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'my' | 'public'>('all');
  const { user } = useAuth();

  useEffect(() => {
    loadQuestionSets();
  }, [filter, user]);

  const loadQuestionSets = async () => {
    try {
      setLoading(true);
      let response;
      
      if (filter === 'my' && user) {
        response = await questionSetAPI.getByCreator(user.id);
      } else if (filter === 'public') {
        response = await questionSetAPI.getPublic();
      } else {
        response = await questionSetAPI.getAll();
      }
      
      if (response.data.success) {
        setQuestionSets(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load question sets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>试卷列表</h2>
        <Link 
          to="/question-sets/create" 
          style={{ 
            padding: '10px 20px', 
            background: '#28a745', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px' 
          }}
        >
          创建试卷
        </Link>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setFilter('all')}
          style={{ 
            padding: '8px 16px', 
            background: filter === 'all' ? '#007bff' : '#e0e0e0',
            color: filter === 'all' ? 'white' : 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          全部试卷
        </button>
        <button 
          onClick={() => setFilter('public')}
          style={{ 
            padding: '8px 16px', 
            background: filter === 'public' ? '#007bff' : '#e0e0e0',
            color: filter === 'public' ? 'white' : 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          公开试卷
        </button>
        {user && (
          <button 
            onClick={() => setFilter('my')}
            style={{ 
              padding: '8px 16px', 
              background: filter === 'my' ? '#007bff' : '#e0e0e0',
              color: filter === 'my' ? 'white' : 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            我的试卷
          </button>
        )}
      </div>

      {loading ? (
        <p>加载中...</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {questionSets.length === 0 ? (
            <p>暂无试卷</p>
          ) : (
            questionSets.map((set) => (
              <div 
                key={set.id} 
                style={{ 
                  padding: '20px', 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  background: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>{set.title}</h3>
                    {set.description && (
                      <p style={{ color: '#666', marginBottom: '15px' }}>{set.description}</p>
                    )}
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', fontSize: '14px', color: '#666' }}>
                      <span>📝 {set.questions.length} 道题</span>
                      {set.timeLimit && <span>⏱️ {set.timeLimit} 分钟</span>}
                      {set.totalScore && <span>💯 总分: {set.totalScore}</span>}
                      <span>{set.isPublic ? '🌐 公开' : '🔒 私有'}</span>
                      <span>👤 创建者: {set.creator.username}</span>
                    </div>
                  </div>
                  <Link 
                    to={`/question-sets/${set.id}`}
                    style={{ 
                      padding: '8px 16px', 
                      background: '#007bff', 
                      color: 'white', 
                      textDecoration: 'none', 
                      borderRadius: '5px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    开始答题
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionSets;
