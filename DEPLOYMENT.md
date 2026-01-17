# 部署指南 (Deployment Guide)

本文档提供了试题管理系统的详细部署步骤。

## 目录
1. [环境准备](#环境准备)
2. [数据库配置](#数据库配置)
3. [后端部署](#后端部署)
4. [前端部署](#前端部署)
5. [生产环境配置](#生产环境配置)
6. [故障排除](#故障排除)

## 环境准备

### 系统要求
- **操作系统**: Linux/Windows/macOS
- **Java**: 17 或更高版本
- **Node.js**: 18 或更高版本
- **数据库**: Microsoft SQL Server 2019 或更高版本
- **Maven**: 3.6+ (后端构建)
- **npm**: 9+ (前端构建)

### 安装 Java 17

**Linux (Ubuntu/Debian)**:
```bash
sudo apt update
sudo apt install openjdk-17-jdk
java -version
```

**Windows**:
1. 下载 [OpenJDK 17](https://adoptium.net/)
2. 安装并配置环境变量 JAVA_HOME

**macOS**:
```bash
brew install openjdk@17
```

### 安装 Node.js

**使用 nvm (推荐)**:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

**或直接下载**: https://nodejs.org/

### 安装 SQL Server

**Windows**:
1. 下载 SQL Server Express
2. 按照向导安装

**Linux**:
```bash
# Ubuntu
sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/mssql-server-2019.list)"
sudo apt-get update
sudo apt-get install -y mssql-server
sudo /opt/mssql/bin/mssql-conf setup
```

**Docker (推荐用于开发)**:
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
   -p 1433:1433 --name sqlserver \
   -d mcr.microsoft.com/mssql/server:2019-latest
```

## 数据库配置

### 1. 创建数据库

连接到 SQL Server 并执行:
```sql
CREATE DATABASE ExamSystemDB;
GO
```

### 2. 配置数据库用户

```sql
USE ExamSystemDB;
GO

CREATE LOGIN examuser WITH PASSWORD = 'YourPassword123!';
CREATE USER examuser FOR LOGIN examuser;

-- 授予权限
ALTER ROLE db_owner ADD MEMBER examuser;
GO
```

### 3. 验证连接

```bash
sqlcmd -S localhost -U examuser -P YourPassword123! -d ExamSystemDB
```

## 后端部署

### 开发环境

1. **克隆项目**:
```bash
git clone https://github.com/YohooSoft/College-Students-Need-to-Work-Through-Exercises-at-The-End-of-This-Term.git
cd College-Students-Need-to-Work-Through-Exercises-at-The-End-of-This-Term/JavaBackend
```

2. **配置数据库连接**:

编辑 `src/main/resources/application-dev.properties`:
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=ExamSystemDB;encrypt=false;trustServerCertificate=true
spring.datasource.username=examuser
spring.datasource.password=YourPassword123!
```

3. **启动后端**:
```bash
mvn clean install
mvn spring-boot:run
```

后端将在 `http://localhost:8080` 启动。

### 生产环境

1. **打包应用**:
```bash
mvn clean package -DskipTests
```

2. **运行 JAR 文件**:
```bash
java -jar target/javabackend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

3. **使用 systemd (Linux)**:

创建服务文件 `/etc/systemd/system/exam-backend.service`:
```ini
[Unit]
Description=Exam Management System Backend
After=syslog.target network.target

[Service]
User=www-data
ExecStart=/usr/bin/java -jar /opt/exam-system/javabackend-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启动服务:
```bash
sudo systemctl daemon-reload
sudo systemctl start exam-backend
sudo systemctl enable exam-backend
```

## 前端部署

### 开发环境

1. **进入前端目录**:
```bash
cd frontend
```

2. **安装依赖**:
```bash
npm install
```

3. **配置 API 地址**:

编辑 `src/api.ts`，确保 `API_BASE_URL` 指向后端:
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

4. **启动开发服务器**:
```bash
npm run dev
```

前端将在 `http://localhost:5173` 启动。

### 生产环境

1. **构建生产版本**:
```bash
npm run build
```

构建文件将生成在 `dist/` 目录。

2. **使用 Nginx 部署**:

安装 Nginx:
```bash
# Ubuntu/Debian
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

配置 Nginx (`/etc/nginx/sites-available/exam-system`):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/exam-system/frontend/dist;
    index index.html;

    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

启用站点:
```bash
sudo ln -s /etc/nginx/sites-available/exam-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

3. **使用 PM2 部署 (备选方案)**:

```bash
npm install -g pm2
npm install -g serve

# 启动服务
pm2 serve dist 3000 --name "exam-frontend" --spa
pm2 save
pm2 startup
```

## 生产环境配置

### 安全配置

1. **修改默认密码**:

编辑 `application.properties`:
```properties
# 修改 JWT 密钥
app.jwt.secret=your-very-long-secret-key-here-at-least-256-bits

# 修改 OpenRouter API Key (如果使用)
openrouter.api-key=your-api-key-here
```

2. **启用 HTTPS**:

使用 Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

3. **配置防火墙**:

```bash
# Ubuntu/Debian
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 1433/tcp  # SQL Server (仅内网)
sudo ufw enable
```

### 性能优化

1. **后端 JVM 参数**:
```bash
java -Xms512m -Xmx2048m -XX:+UseG1GC \
  -jar javabackend-0.0.1-SNAPSHOT.jar
```

2. **数据库索引**:

```sql
-- 为常用查询字段添加索引
CREATE INDEX idx_questions_type ON questions(type);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_creator ON questions(creator_id);
CREATE INDEX idx_user_answers_user ON user_answers(user_id);
CREATE INDEX idx_collections_user ON collections(user_id);
```

3. **Nginx 缓存**:

在 Nginx 配置中添加:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=exam_cache:10m max_size=100m;

location /api {
    proxy_cache exam_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
}
```

## 故障排除

### 后端无法启动

**问题**: 端口 8080 被占用
```bash
# 查找占用端口的进程
sudo lsof -i :8080
# 或
sudo netstat -tulpn | grep 8080

# 修改端口
# 在 application.properties 添加:
server.port=8081
```

**问题**: 数据库连接失败
```bash
# 检查 SQL Server 状态
sudo systemctl status mssql-server

# 测试连接
sqlcmd -S localhost -U examuser -P password -d ExamSystemDB

# 检查防火墙
sudo ufw status
```

### 前端无法访问后端

**问题**: CORS 错误

在后端 SecurityConfig.java 中确保已配置 CORS:
```java
http.cors(cors -> cors.configurationSource(request -> {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Arrays.asList("http://localhost:5173", "https://your-domain.com"));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    config.setAllowedHeaders(Arrays.asList("*"));
    return config;
}));
```

### 性能问题

**问题**: 查询缓慢

1. 检查数据库索引
2. 启用查询日志:
```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

3. 使用连接池:
```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

## 监控和日志

### 日志配置

在 `application.properties` 中:
```properties
logging.level.root=INFO
logging.level.top.mryan2005.template.javabackend=DEBUG
logging.file.name=/var/log/exam-system/backend.log
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
```

### 使用 Prometheus + Grafana (可选)

1. 添加 actuator 依赖到 pom.xml
2. 配置 Prometheus
3. 创建 Grafana 仪表板

## 备份策略

### 数据库备份

```bash
# 创建备份脚本
#!/bin/bash
BACKUP_DIR="/backup/exam-system"
DATE=$(date +%Y%m%d_%H%M%S)

sqlcmd -S localhost -U examuser -P password \
  -Q "BACKUP DATABASE ExamSystemDB TO DISK='$BACKUP_DIR/exam_db_$DATE.bak'"

# 删除7天前的备份
find $BACKUP_DIR -name "*.bak" -mtime +7 -delete
```

### 定时备份 (crontab)

```bash
# 每天凌晨2点备份
0 2 * * * /opt/scripts/backup-db.sh
```

## 总结

完成以上步骤后，系统应该可以正常运行。访问:
- 前端: http://your-domain.com
- 后端 API: http://your-domain.com/api
- 健康检查: http://your-domain.com/api/actuator/health

如遇问题，请查看日志或提交 Issue。
