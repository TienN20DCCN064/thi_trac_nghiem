# 📝 Online Multiple-Choice Exam System

## 🎯 Introduction
The **Online Multiple-Choice Exam System** is an application that allows users to participate in online multiple-choice exams, while also enabling administrators to manage questions, exams, and evaluate results. Users can register, log in, take exams, and view their results immediately after submission.

## 📺 Demo
🎥 Video demo website:  
👉 https://www.youtube.com/watch?v=WxE7SrDnLA8



## 🛠️ Công nghệ sử dụng
- **Frontend:** React + Vite
- **Backend:** Node.js + Express, Python + Flask
- **Database:** MySQL (use PhpMyAdmin)
- **Xác thực:** JWT
- **Lưu trữ ảnh/file:** Cloudinary
- **Yêu cầu Node:** >= 16
- **Yêu cầu Python:** >= 3.10

## 📁 Installation & Running
### Clone code
```bash
# Clone repository (frontend)
git clone https://github.com/TienN20DCCN064/thi_trac_nghiem.git
cd thi_trac_nghiem

# Install list
npm install

# Chạy frontend
npm run dev
```

The frontend will run by default at: http://localhost:5173

### Backend
If the backend is in a separate repository, clone the corresponding backend repository.
```bash
# List install
npm install
npm install express mysql2 cors moment jsonwebtoken
py -m pip install flask-cors
py -m pip install cloudinary

# Run frontend
npm run dev

```
The backend runs on the port configured in `.env` or `http://localhost:5173`.
### Biến môi trường (.env)
Create a `.env` file in the backend directory with the following variables (replace the sample values with your actual configuration):

```
JWT_SECRET=YOUR_JWT_SECRET
JWT_EXPIRES_IN=1h
DTB_HOST=localhost
DTB_USER=root
DTB_PASSWORD=your_db_password
DTB_NAME=your_database_name
PASSWORD_CRYPTO=your_password_secret
SALT_ROUNDS_CRYPTO=10
EMAIL_SENDER=youremail@gmail.com
EMAIL_PASSWORD=your_email_password_or_app_password
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

Short explanation:
- `JWT_SECRET`:Secret key used to sign JWT tokens
- `JWT_EXPIRES_IN`: JWT expiration time (exampls: `1h`, `7d`)
- `DTB_*`: MySQL database connection configuration
- `PASSWORD_CRYPTO`, `SALT_ROUNDS_CRYPTO`: Password encryption configuration
- `EMAIL_*`: Email sending configuration
- `CLOUD_*`: Cloudinary configuration for uploading images/files

## 🧪 Database
- Use MySQL (PhpMyAdmin/Laragon) to create a database with the name specified in `DTB_NAME` in `.env`.
- If a schema file is provided (e.g., `thi_trac_nghiem_1.sql`), import it into the database..

## 🧩 Cách sử dụng
- Access the frontend interface at `http://localhost:5173`.
- Log in or use the “Forgot Password” feature.
- Select an exam, complete it, and submit.
- View the results immediately after submission.

---
