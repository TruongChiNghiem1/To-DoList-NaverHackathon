[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YHSq4TPZ)
# To-Do App – Preliminary Assignment Submission
⚠️ Please complete **all sections marked with the ✍️ icon** — these are required for your submission.

👀 Please Check ASSIGNMENT.md file in this repository for assignment requirements.

## 🚀 Project Setup & Usage
**How to install and run your project:**  
- Clone repository: `git clone https://github.com/NAVER-Vietnam-AI-Hackathon/web-track-naver-vietnam-ai-hackathon-TruongChiNghiem1.git`
- Install dependencies: `npm install`  
- Start development server: `npm run dev`
- Open browser: `http://localhost:5173`

## 🔗 Deployed Web URL or APK file
**Live Demo:** [https://to-do-list-naver-hackathon.vercel.app](https://to-do-list-naver-hackathon.vercel.app)

## 🎥 Demo Video
**Demo video link (≤ 2 minutes):**  
📌 **Video Upload Guideline:** when uploading your demo video to YouTube, please set the visibility to **Unlisted**.  
- “Unlisted” videos can only be viewed by users who have the link.  
- The video will not appear in search results or on your channel.  
- Share the link in your README so mentors can access it.  

**Demo Video:** [https://youtu.be/X0zcnvokigE](https://youtu.be/X0zcnvokigE)


## 💻 Project Introduction

### a. Overview

**Student Time Management Solution** là một ứng dụng quản lý công việc thông minh được thiết kế đặc biệt cho sinh viên Việt Nam. Ứng dụng giúp sinh viên tổ chức, theo dõi và hoàn thành các nhiệm vụ học tập một cách hiệu quả với các tính năng phân tích năng suất và giao diện thân thiện.

### b. Key Features & Function Manual

**🔹 Quản lý Task (CRUD Operations):**
- **Tạo mới:** Thêm task với tiêu đề, mô tả, độ ưu tiên, danh mục, hạn chót
- **Xem danh sách:** Hiển thị tất cả tasks với bộ lọc và sắp xếp linh hoạt
- **Chỉnh sửa:** Cập nhật thông tin task bất kỳ lúc nào
- **Xóa:** Loại bỏ task không cần thiết

**🔹 Calendar View:**
- Hiển thị tasks theo lịch tháng
- Click vào ngày để xem chi tiết tasks
- Giao diện trực quan với màu sắc phân biệt độ ưu tiên

**🔹 Analytics Dashboard:**
- **Tỷ lệ hoàn thành:** Phần trăm tasks đã hoàn thành
- **Tỷ lệ đúng hạn:** Phần trăm tasks hoàn thành đúng thời gian
- **Điểm năng suất:** Chỉ số tổng hợp đánh giá hiệu suất học tập
- **Thống kê chi tiết:** Số lượng tasks, thời gian trung bình, xu hướng trì hoãn

**🔹 Tính năng nâng cao:**
- **Phân trang:** Hiển thị 10 tasks/trang để tối ưu hiệu suất
- **Tìm kiếm:** Tìm kiếm theo tiêu đề và mô tả
- **Bộ lọc:** Lọc theo trạng thái (chờ, đang làm, hoàn thành)
- **Sắp xếp:** Theo hạn chót, độ ưu tiên, ngày tạo
- **Lưu trữ:** Dữ liệu được lưu tự động trong localStorage

### c. Unique Features (What's special about this app?)

**🎯 Thiết kế cho sinh viên Việt Nam:**
- Giao diện tiếng Việt hoàn toàn
- Phân loại tasks phù hợp với sinh viên (học tập, thi cử, dự án, cá nhân)
- Tính toán điểm năng suất dựa trên thói quen học tập

**📊 Hệ thống phân tích thông minh:**
- Điểm năng suất = (Tỷ lệ hoàn thành + Tỷ lệ đúng hạn) / 2
- Theo dõi xu hướng trì hoãn để cải thiện thói quen
- Thống kê thời gian thực tế vs ước tính

**🎨 Giao diện hiện đại:**
- Responsive design cho mọi thiết bị
- Icon system tùy chỉnh với Bootstrap Icons
- Màu sắc trực quan cho độ ưu tiên và trạng thái
- Animation mượt mà và UX tối ưu

### d. Technology Stack and Implementation Methods

**Frontend Framework:**
- **React 19.1.1** với TypeScript cho type safety
- **Vite** làm build tool nhanh và hiệu quả
- **CSS3** với Flexbox/Grid cho responsive layout

**State Management:**
- **React Hooks** (useState, useEffect) cho state management
- **Local Storage API** cho persistent data
- **Custom hooks** cho logic tái sử dụng

**UI/UX:**
- **Bootstrap Icons** cho icon system
- **Custom CSS** với CSS Variables
- **Responsive Design** với Mobile-first approach

**Development Tools:**
- **ESLint** cho code quality
- **TypeScript** cho type checking
- **Vite Dev Server** với HMR

### e. Service Architecture & Database structure (when used)

**Architecture Pattern:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │   State Layer   │    │   Data Layer   │
│                 │    │                 │    │                 │
│ • TaskList      │◄──►│ • useState      │◄──►│ • localStorage │
│ • CalendarView  │    │ • useEffect     │    │ • JSON format  │
│ • AnalyticsView │    │ • Custom hooks  │    │ • Auto-save    │
│ • TaskForm      │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Data Structure:**
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low'|'medium'|'high'|'urgent';
  category: 'study'|'work'|'personal'|'project'|'exam';
  dueDate: string;
  estimatedTime: number;
  actualTime?: number;
  status: 'pending'|'in-progress'|'completed';
  createdAt: string;
  completedAt?: string;
  procrastinationScore?: number;
}
```

**Storage Strategy:**
- **Client-side:** localStorage với JSON serialization
- **Auto-save:** Mỗi thay đổi được lưu ngay lập tức
- **Data validation:** TypeScript interfaces đảm bảo data integrity
- **Backup:** Export/Import functionality (có thể mở rộng)

## 🧠 Reflection

### a. If you had more time, what would you expand?

✍️ [Write your content here]


### b. If you integrate AI APIs more for your app, what would you do?

**🤖 AI-Powered Features:**

**1. Smart Task Management:**
- **Auto-categorization:** AI phân loại task tự động dựa trên nội dung
- **Priority Prediction:** Dự đoán độ ưu tiên dựa trên deadline và context
- **Time Estimation:** AI ước tính thời gian hoàn thành dựa trên lịch sử
- **Smart Scheduling:** Tự động sắp xếp lịch học tối ưu

**2. Personalized Learning Assistant:**
- **Study Plan Generator:** Tạo kế hoạch học tập cá nhân hóa
- **Difficulty Assessment:** Đánh giá độ khó của từng môn học
- **Learning Style Detection:** Phát hiện phong cách học tập hiệu quả
- **Motivational Messages:** Tin nhắn động viên cá nhân hóa

**3. Advanced Analytics:**
- **Procrastination Prediction:** Dự đoán khả năng trì hoãn
- **Performance Forecasting:** Dự báo điểm số và kết quả học tập
- **Stress Level Monitoring:** Theo dõi mức độ căng thẳng
- **Optimal Study Time:** Gợi ý thời gian học tập hiệu quả nhất

**4. Natural Language Processing:**
- **Vietnamese NLP:** Xử lý ngôn ngữ tự nhiên tiếng Việt
- **Voice Commands:** Điều khiển app bằng giọng nói
- **Smart Search:** Tìm kiếm thông minh với semantic search
- **Auto-translation:** Dịch thuật tài liệu học tập

**5. Integration APIs:**
- **OpenAI GPT-4:** Chatbot học tập và trợ lý AI
- **Google Calendar API:** Đồng bộ với lịch Google
- **Notion API:** Tích hợp với Notion workspace
- **Zoom API:** Tự động tạo meeting cho nhóm học

## ✅ Checklist
- [x] Code runs without errors  
- [x] All required features implemented (add/edit/delete/complete tasks)  
- [x] All ✍️ sections are filled  
