import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questionAPI, answerAPI, collectionAPI, Question } from '../api';
import { useAuth } from '../AuthContext';

const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isCollected, setIsCollected] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestion();
    if (user && id) {
      checkCollection();
    }
  }, [id, user]);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      const response = await questionAPI.getById(Number(id));
      if (response.data.success) {
        setQuestion(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load question:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCollection = async () => {
    try {
      const response = await collectionAPI.isCollected(user!.id, Number(id));
      if (response.data.success) {
        setIsCollected(response.data.data);
      }
    } catch (error) {
      console.error('Failed to check collection:', error);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('请先登录');
      navigate('/login');
      return;
    }

    try {
      const response = await answerAPI.submit(
        { questionId: Number(id), answer },
        user.id
      );
      if (response.data.success) {
        setResult(response.data.data);
        alert(`提交成功！${response.data.data.isCorrect ? '答案正确！' : '答案错误'} 得分: ${response.data.data.score}`);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert('提交失败');
    }
  };

  const handleCollection = async () => {
    if (!user) {
      alert('请先登录');
      navigate('/login');
      return;
    }

    try {
      if (isCollected) {
        // 取消收藏逻辑需要先获取collection id
        alert('取消收藏功能需要完善');
      } else {
        const response = await collectionAPI.add(Number(id), undefined, user.id);
        if (response.data.success) {
          setIsCollected(true);
          alert('收藏成功');
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.message || '操作失败');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>加载中...</div>;
  if (!question) return <div style={{ padding: '20px' }}>题目不存在</div>;

  const getQuestionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      SINGLE_CHOICE: '单选题',
      MULTIPLE_CHOICE: '多选题',
      TRUE_FALSE: '判断题',
      FILL_BLANK: '填空题',
      SHORT_ANSWER: '简答题',
    };
    return types[type] || type;
  };

  const renderOptions = () => {
    if (!question.options) return null;
    
    try {
      const options = JSON.parse(question.options);
      return (
        <div style={{ marginTop: '15px' }}>
          <h4>选项:</h4>
          {Array.isArray(options) ? (
            options.map((option: any, index: number) => (
              <div key={index} style={{ padding: '8px', marginBottom: '5px', background: '#f5f5f5', borderRadius: '4px' }}>
                {typeof option === 'string' ? option : `${option.key}. ${option.value}`}
              </div>
            ))
          ) : (
            Object.entries(options).map(([key, value]) => (
              <div key={key} style={{ padding: '8px', marginBottom: '5px', background: '#f5f5f5', borderRadius: '4px' }}>
                {key}. {String(value)}
              </div>
            ))
          )}
        </div>
      );
    } catch (e) {
      return <div style={{ marginTop: '15px' }}><p>选项: {question.options}</p></div>;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}>
        ← 返回
      </button>

      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
          <h2 style={{ margin: 0 }}>{question.title}</h2>
          <button 
            onClick={handleCollection}
            style={{ 
              padding: '8px 16px', 
              cursor: 'pointer', 
              background: isCollected ? '#ffc107' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            {isCollected ? '已收藏' : '收藏'}
          </button>
        </div>

        <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
          <span style={{ padding: '4px 12px', background: '#e3f2fd', color: '#1976d2', borderRadius: '4px' }}>
            {getQuestionTypeLabel(question.type)}
          </span>
          <span style={{ padding: '4px 12px', background: '#f3e5f5', color: '#7b1fa2', borderRadius: '4px' }}>
            难度: {question.difficulty}
          </span>
        </div>

        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <h3>题目内容:</h3>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{question.content}</p>
        </div>

        {renderOptions()}

        {question.tags && (
          <div style={{ marginTop: '15px' }}>
            <strong>标签: </strong>
            {question.tags.split(',').map((tag, index) => (
              <span key={index} style={{ marginLeft: '5px', padding: '2px 8px', background: '#e0e0e0', borderRadius: '3px', fontSize: '12px' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ marginTop: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
          <h3>提交答案</h3>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="请输入你的答案..."
            style={{ width: '100%', minHeight: '100px', padding: '10px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
          <button 
            onClick={handleSubmit}
            style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            提交答案
          </button>
        </div>

        {result && (
          <div style={{ marginTop: '20px', padding: '15px', background: result.isCorrect ? '#d4edda' : '#f8d7da', borderRadius: '8px' }}>
            <h4>{result.isCorrect ? '✓ 回答正确！' : '✗ 回答错误'}</h4>
            <p>得分: {result.score}</p>
            {question.explanation && (
              <div>
                <h4>答案解析:</h4>
                <p>{question.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;
