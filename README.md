# AI Chatbot FAQ System

## Mô tả dự án

Dự án này xây dựng một chatbot AI để trả lời các câu hỏi thường gặp (FAQ) về tuyển sinh. Hệ thống sử dụng **TensorFlow.js**, **FAISS**, **OpenAI GPT-4**, và **MongoDB** để tìm kiếm câu hỏi phù hợp và cung cấp câu trả lời chính xác.

## Công nghệ sử dụng

- **Express.js**: Xây dựng server API.
- **MongoDB & Mongoose**: Lưu trữ và truy vấn dữ liệu FAQ.
- **TensorFlow.js & Universal Sentence Encoder (USE)**: Xử lý và mã hóa câu hỏi thành vector.
- **FAISS (Facebook AI Similarity Search)**: Tìm kiếm các câu hỏi có độ tương đồng cao.
- **OpenAI API (GPT-4)**: Tạo câu trả lời khi không tìm thấy câu hỏi phù hợp.
- **Compute-Cosine-Similarity**: Tính toán độ tương đồng giữa các câu hỏi.
- **Session & Body-Parser**: Xử lý yêu cầu HTTP và quản lý phiên.
- **Mammoth.js & FS-Extra**: Xử lý tệp tin và dữ liệu.

## Cài đặt

```bash
 truy cap pakage.json de xem phine ban tuong thich

```

### 1. Clone dự án

```bash
git clone https://github.com/your-repo-link.git
cd your-project-folder

```

### 2. Cài đặt các dependencies

```bash
npm install
```

### 3. Cấu hình môi trường `.env`

Tạo file `.env` trong thư mục gốc và điền thông tin:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/db_name
OPENAI_API_KEY=your_openai_api_key
PORT=3000
```

### 4 config docker

```bash
docker-compose up -d
```

### 5 Chạy ứng dụng

```bash
npm run dev
```

```run test
npx jest tests/chatbot.test.js --detectOpenHandles;
```

## API Endpoints

### 1. Xử lý câu hỏi người dùng

```http
POST /api/chat
```

**Request Body:**

```json
{
  "userQuery": "Trường có những ngành nào?",
  "userIP": "192.168.1.1"
}
```

**Response:**

```json
{
  "response": "Trường có các ngành như CNTT, Kinh tế, Y dược..."
}
```

## Ghi chú

- Nếu độ tương đồng của câu hỏi thấp hơn ngưỡng (ví dụ: 0.7), hệ thống sẽ gọi OpenAI để tạo câu trả lời mới.
- Các câu hỏi và câu trả lời được lưu trong **MongoDB** để cải thiện khả năng tìm kiếm sau này.

## Đóng góp

Nếu bạn muốn đóng góp vào dự án, hãy fork repository và tạo pull request. 🚀

## Liên hệ

- **Email**: vumanhchien101@@gmail.com
- **Github**: [manhchien16](https://github.com/manhchien16)

---

**© 2025 AI Chatbot FAQ System**
