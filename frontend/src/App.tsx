import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuestionDetail from './pages/QuestionDetail';
import CreateQuestion from './pages/CreateQuestion';
import QuestionSets from './pages/QuestionSets';
import Collections from './pages/Collections';
import MyAnswers from './pages/MyAnswers';
import './App.css';

function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ 
      padding: '15px 20px', 
      background: '#2c3e50', 
      color: 'white',
      marginBottom: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          题库管理系统
        </Link>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {user ? (
            <>
              <span>欢迎, {user.username}</span>
              <button 
                onClick={logout} 
                style={{ 
                  padding: '8px 16px', 
                  cursor: 'pointer', 
                  background: '#e74c3c', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px' 
                }}
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>登录</Link>
              <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>注册</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
            <Route path="/questions/create" element={<CreateQuestion />} />
            <Route path="/question-sets" element={<QuestionSets />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/my-answers" element={<MyAnswers />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
