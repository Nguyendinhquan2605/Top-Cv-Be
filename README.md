# Top CV Backend - Hướng Dẫn Setup Dự Án

## 📋 Mô Tả Dự Án

Top CV Backend là một ứng dụng backend được xây dựng bằng NestJS, cung cấp các API cho hệ thống quản lý CV và việc làm. Dự án bao gồm các tính năng như quản lý người dùng, công ty, công việc, CV, và gửi email.

## 🛠️ Công Nghệ Sử Dụng

- **Framework:** NestJS
- **Database:** MongoDB với Mongoose
- **Authentication:** JWT + Passport
- **Email:** Nodemailer với Handlebars templates
- **File Upload:** Multer
- **Validation:** Class Validator
- **Language:** TypeScript

## 📦 Cài Đặt Dependencies

```bash
# Clone repository
git clone <repository-url>
cd top-cv-be

# Cài đặt dependencies
npm install
```

## ⚙️ Cấu Hình Environment Variables

Tạo file `.env` trong thư mục gốc của dự án với các biến môi trường sau:

```env
# Database Configuration
PORT=8080
MONGO_URI=mongodb+srv://<DBName>:<DBPassword>@cluster0.dxsbq.mongodb.net/top_cv
EMAIL_ADMIN=admin@gmail.com

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET=your-super-secret-jwt-key-here
JWT_ACCESS_EXPIRE=7d
JWT_REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRE=30d

# Init sample data
SHOULD_INIT=true
INIT_PASSWORD=123456 

# Config mail
EMAIL_HOST=smtp.gmail.com
EMAIL_AUTH_USER=
EMAIL_AUTH_PASS=
```

### 📝 Giải Thích Các Biến Môi Trường

#### **Database (MongoDB)**
- `MONGO_URI`: Đường dẫn database

#### **JWT Authentication**
- `JWT_SECRET`: Secret key để ký JWT token (nên dùng chuỗi dài và phức tạp)
- `JWT_EXPIRES_IN`: Thời gian hết hạn của access token (7d = 7 ngày)
- `JWT_REFRESH_SECRET`: Secret key cho refresh token
- `JWT_REFRESH_EXPIRES_IN`: Thời gian hết hạn của refresh token (30d = 30 ngày)

#### **Email (Gmail SMTP)**
- `EMAIL_HOST`: SMTP server của Gmail
- `EMAIL_PORT`: Port SMTP (587 cho TLS)
- `EMAIL_AUTH_USER`: Email Gmail của bạn
- `EMAIL_AUTH_PASS`: App Password của Gmail (không phải password thường)

#### **Server**
- `PORT`: Port chạy server (mặc định 8080)

## 🚀 Chạy Dự Án

### Development Mode
```bash
# Chạy với hot reload
npm run start:dev

# Hoặc
npm run dev
```

### Production Mode
```bash
# Build dự án
npm run build

# Chạy production
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## 📁 Cấu Trúc Thư Mục

```
src/
├── modules/
│   ├── auth/           # Authentication & Authorization
│   ├── users/          # User management
│   ├── companies/      # Company management
│   ├── jobs/           # Job management
│   ├── resumes/        # Resume management
│   ├── mail/           # Email service
│   ├── files/          # File upload service
│   ├── roles/          # Role management
│   ├── permissions/    # Permission management
│   ├── subscribers/    # Subscriber management
│   └── databases/      # Database utilities
├── core/               # Core utilities
├── decorator/          # Custom decorators
└── main.ts            # Application entry point
```

## 🔧 Scripts Có Sẵn

```bash
# Development
npm run start:dev      # Chạy với watch mode
npm run start:debug    # Chạy với debug mode

# Production
npm run build          # Build dự án
npm run start:prod     # Chạy production

# Utilities
npm run copy-templates # Copy email templates
npm run lint           # Lint code
npm run format         # Format code

# Testing
npm run test           # Chạy unit tests
npm run test:watch     # Chạy tests với watch mode
npm run test:e2e       # Chạy end-to-end tests
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/register` - Đăng ký
- `GET /api/v1/auth/account` - Lấy thông tin tài khoản
- `GET /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Đăng xuất

### Users
- `GET /api/v1/users` - Lấy danh sách users
- `POST /api/v1/users` - Tạo user mới
- `GET /api/v1/users/:id` - Lấy thông tin user
- `PATCH /api/v1/users/:id` - Cập nhật user
- `DELETE /api/v1/users/:id` - Xóa user

### Companies
- `GET /api/v1/companies` - Lấy danh sách companies
- `POST /api/v1/companies` - Tạo company mới
- `GET /api/v1/companies/:id` - Lấy thông tin company
- `PATCH /api/v1/companies/:id` - Cập nhật company
- `DELETE /api/v1/companies/:id` - Xóa company

### Jobs
- `GET /api/v1/jobs` - Lấy danh sách jobs
- `POST /api/v1/jobs` - Tạo job mới
- `GET /api/v1/jobs/:id` - Lấy thông tin job
- `PATCH /api/v1/jobs/:id` - Cập nhật job
- `DELETE /api/v1/jobs/:id` - Xóa job

### Mail
- `GET /api/v1/mail` - Test email service

### Files
- `POST /api/v1/files/upload` - Upload file đơn
- `POST /api/v1/files/upload-multiple` - Upload nhiều files

## 🔐 Authentication

Dự án sử dụng JWT authentication. Để truy cập các API được bảo vệ:

1. Đăng nhập qua `/api/v1/auth/login`
2. Lấy access token từ response
3. Thêm token vào header: `Authorization: Bearer <token>`

## 📧 Email Configuration

### Gmail Setup
1. Bật 2-Factor Authentication cho Gmail
2. Tạo App Password:
   - Vào Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Tạo password mới cho "Mail"
3. Sử dụng App Password trong `EMAIL_AUTH_PASS`

### Email Templates
Templates được lưu trong `public/templates/`:
- `job.hbs` - Template cho job notifications

## 🐛 Troubleshooting

### Lỗi Database Connection
```bash
# Kiểm tra MongoDB đang chạy
mongod --version

# Khởi động MongoDB
mongod
```

### Lỗi Email
- Kiểm tra App Password của Gmail
- Đảm bảo 2FA đã được bật
- Kiểm tra firewall/antivirus

### Lỗi Template
- Chạy `npm run copy-templates` để copy templates
- Kiểm tra file template trong `public/templates/`


---

*Cảm ơn bạn đã sử dụng Top CV Backend! 🚀*
