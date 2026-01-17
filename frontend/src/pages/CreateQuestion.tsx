import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionAPI } from '../api';
import { useAuth } from '../AuthContext';

const CreateQuestion: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('SINGLE_CHOICE');
  const [options, setOptions] = useState('');
  const [answer, setAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [tags, setTags] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('请先登录');
      navigate('/login');
      return;
    }

    try {
      const response = await questionAPI.create({
        title,
        content,
        type,
        options,
        answer,
        explanation,
        difficulty,
        tags
      }, user.id);

      if (response.data.success) {
        alert('创建成功！');
        navigate('/');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || '创建失败');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>创建题目</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>题目标题:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>题目内容:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ width: '100%', minHeight: '100px', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>题目类型:</label>
          <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="SINGLE_CHOICE">单选题</option>
            <option value="MULTIPLE_CHOICE">多选题</option>
            <option value="TRUE_FALSE">判断题</option>
            <option value="FILL_BLANK">填空题</option>
            <option value="SHORT_ANSWER">简答题</option>
            <option value="ESSAY">概述题 (支持Markdown、Mermaid、LaTeX)</option>
          </select>
        </div>

        <div>
          <label>选项 (JSON格式，如: {`{"A":"选项A","B":"选项B"}`}):</label>
          <textarea
            value={options}
            onChange={(e) => setOptions(e.target.value)}
            placeholder='{"A":"选项A","B":"选项B","C":"选项C","D":"选项D"}'
            style={{ width: '100%', minHeight: '80px', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>正确答案:</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>答案解析:</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            style={{ width: '100%', minHeight: '80px', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>难度:</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="EASY">简单</option>
            <option value="MEDIUM">中等</option>
            <option value="HARD">困难</option>
          </select>
        </div>

        <div>
          <label>标签 (逗号分隔):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="数学,代数,线性方程"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
            创建题目
          </button>
          <button type="button" onClick={() => navigate('/')} style={{ padding: '10px 20px', cursor: 'pointer', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}>
            取消
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion;
