import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collectionAPI } from '../api';
import type { Collection } from '../api';
import { useAuth } from '../AuthContext';

const Collections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert('请先登录');
      navigate('/login');
      return;
    }
    loadCollections();
  }, [user]);

  const loadCollections = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await collectionAPI.getUserCollections(user.id);
      if (response.data.success) {
        setCollections(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (collectionId: number) => {
    if (!user || !confirm('确定要取消收藏吗？')) return;
    
    try {
      const response = await collectionAPI.remove(collectionId, user.id);
      if (response.data.success) {
        alert('取消收藏成功');
        loadCollections();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || '操作失败');
    }
  };

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

  if (loading) return <div style={{ padding: '20px' }}>加载中...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2>我的收藏</h2>
      
      {collections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>还没有收藏任何题目</p>
          <Link 
            to="/" 
            style={{ 
              display: 'inline-block',
              padding: '10px 20px', 
              background: '#007bff', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '5px' 
            }}
          >
            去浏览题目
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
          {collections.map((collection) => (
            <div 
              key={collection.id} 
              style={{ 
                padding: '20px', 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                background: '#fff' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0 }}>{collection.question.title}</h3>
                    <span style={{ 
                      padding: '2px 8px', 
                      background: '#e3f2fd', 
                      color: '#1976d2', 
                      borderRadius: '3px', 
                      fontSize: '12px' 
                    }}>
                      {getQuestionTypeLabel(collection.question.type)}
                    </span>
                  </div>
                  
                  <p style={{ color: '#666', marginBottom: '10px' }}>
                    {collection.question.content.substring(0, 150)}...
                  </p>
                  
                  {collection.notes && (
                    <div style={{ 
                      padding: '10px', 
                      background: '#fffbf0', 
                      borderLeft: '3px solid #ffc107', 
                      marginTop: '10px' 
                    }}>
                      <strong>笔记: </strong>{collection.notes}
                    </div>
                  )}
                  
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                    收藏时间: {new Date(collection.createdAt).toLocaleString()}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                  <Link 
                    to={`/questions/${collection.question.id}`}
                    style={{ 
                      padding: '8px 16px', 
                      background: '#007bff', 
                      color: 'white', 
                      textDecoration: 'none', 
                      borderRadius: '5px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    查看详情
                  </Link>
                  <button
                    onClick={() => handleRemove(collection.id)}
                    style={{ 
                      padding: '8px 16px', 
                      background: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    取消收藏
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
