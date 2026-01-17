# 试题管理系统 (Exam Management System)

这是一个完整的试题管理系统，支持多用户使用，包含搜题、组题、做题、收录题目、自动判题等功能。

## 系统架构

### 后端技术栈
- **Java 17** - 编程语言
- **Spring Boot 3.5.7** - 后端框架
- **Spring Data JPA** - 数据持久化
- **Spring Security** - 安全框架
- **Microsoft SQL Server** - 数据库
- **MyBatis** - SQL映射框架
- **Maven** - 项目管理

### 前端技术栈
- **Angular 21** - 前端框架
- **TypeScript** - 类型安全的JavaScript
- **Angular CLI** - 构建工具
- **Angular Router** - 路由管理
- **Angular HttpClient** - HTTP客户端

## 功能特性

### 用户管理
- 用户注册和登录
- 三种用户角色：普通用户、VIP、SVIP
- 用户认证和授权

### 题目管理
- **题目类型支持**：
  - 单选题 (SINGLE_CHOICE)
  - 多选题 (MULTIPLE_CHOICE)
  - 判断题 (TRUE_FALSE)
  - 填空题 (FILL_BLANK)
  - 简答题 (SHORT_ANSWER)
  
- **难度级别**：
  - 简单 (EASY)
  - 中等 (MEDIUM)
  - 困难 (HARD)

- **题目功能**：
  - 创建题目
  - 搜索题目（关键词、类型、难度）
  - 标签分类
  - 题目详情查看
  - 修改和删除题目

### 组卷功能
- 创建试卷/题集
- 选择多个题目组成试卷
- 设置时间限制和总分
- 公开/私有试卷设置

### 答题功能
- 提交答案
- 自动判题
- 智能评分
- 查看答题历史
- 答案解析

### 收藏功能
- 收藏感兴趣的题目
- 添加个人笔记
- 管理收藏夹

## 数据库设计

### 主要数据表

1. **users** - 用户表
   - id, username, password, email, fullName, role, createdAt, updatedAt

2. **questions** - 题目表
   - id, title, content, type, options, answer, explanation, difficulty, tags, creatorId, createdAt, updatedAt

3. **question_sets** - 试卷表
   - id, title, description, creatorId, timeLimit, totalScore, isPublic, createdAt, updatedAt

4. **user_answers** - 答题记录表
   - id, userId, questionId, questionSetId, answer, isCorrect, score, timeSpent, submittedAt

5. **collections** - 收藏表
   - id, userId, questionId, notes, createdAt

## 快速开始

### 前置要求
- Java 17+
- Node.js 18+
- SQL Server
- Maven 3.6+

### 后端启动

1. 配置数据库
```bash
cd JavaBackend
```

编辑 `src/main/resources/application-dev.properties`：
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=yourdb;encrypt=false;trustServerCertificate=true
spring.datasource.username=your_username
spring.datasource.password=your_password
```

2. 启动后端
```bash
mvn spring-boot:run
```

后端将在 `http://localhost:8080` 运行

### 前端启动

1. 安装依赖
```bash
cd frontend
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

前端将在 `http://localhost:5173` 运行

## API 文档

### 认证接口

#### 注册
```
POST /api/auth/register
Body: { username, password, email, fullName }
```

#### 登录
```
POST /api/auth/login
Body: { username, password }
```

### 题目接口

#### 创建题目
```
POST /api/questions?userId={userId}
Body: QuestionRequest
```

#### 搜索题目
```
GET /api/questions/search?keyword={keyword}&type={type}&difficulty={difficulty}&page={page}&size={size}
```

#### 获取题目详情
```
GET /api/questions/{id}
```

### 试卷接口

#### 创建试卷
```
POST /api/question-sets?userId={userId}
Body: QuestionSetRequest
```

#### 获取公开试卷
```
GET /api/question-sets/public
```

### 答题接口

#### 提交答案
```
POST /api/answers/submit?userId={userId}
Body: { questionId, questionSetId, answer, timeSpent }
```

#### 获取答题历史
```
GET /api/answers/user/{userId}
```

### 收藏接口

#### 添加收藏
```
POST /api/collections?questionId={questionId}&userId={userId}&notes={notes}
```

#### 获取用户收藏
```
GET /api/collections/user/{userId}
```

## 系统特点

### 自动判题算法
- **单选题/判断题**: 精确匹配
- **多选题**: 选项排序后比较
- **填空题/简答题**: 关键词匹配（可扩展为AI评分）

### 评分机制
根据题目难度自动评分：
- 简单题: 5分
- 中等题: 10分
- 困难题: 15分

### 安全性
- 密码加密存储（BCrypt）
- CORS跨域支持
- SQL注入防护（JPA/MyBatis参数化查询）

## 项目结构

```
.
├── JavaBackend/                 # 后端项目
│   ├── src/main/java/
│   │   └── top/mryan2005/template/javabackend/
│   │       ├── Config/         # 配置类
│   │       ├── Controller/     # REST控制器
│   │       ├── Service/        # 业务逻辑
│   │       ├── Repository/     # 数据访问
│   │       ├── Pojo/          # 实体类和DTO
│   │       ├── Exception/      # 异常处理
│   │       └── Response/       # 响应封装
│   └── src/main/resources/     # 配置文件
│
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── pages/              # 页面组件
│   │   ├── api.ts             # API客户端
│   │   ├── AuthContext.tsx    # 认证上下文
│   │   └── App.tsx            # 主应用
│   └── package.json
│
└── README.md
```

## 开发计划

- [x] 后端基础架构
- [x] 用户认证系统
- [x] 题目CRUD功能
- [x] 试卷管理
- [x] 答题和判题
- [x] 收藏功能
- [x] 前端界面
- [ ] 试卷管理界面
- [ ] 成绩统计分析
- [ ] AI智能判题
- [ ] 题目推荐系统

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License
