const request = require("supertest");
const fs = require("fs");
const xlsx = require("xlsx");

const filePathRead = "data.xlsx";

const readFromExcel = () => {
  if (!fs.existsSync(filePathRead)) {
    console.log("⚠️ File Excel không tồn tại!");
    return [];
  }

  const workbook = xlsx.readFile(filePathRead);
  const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
  const worksheet = workbook.Sheets[sheetName];

  // Chuyển dữ liệu từ sheet sang JSON
  const data = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

  return data.map((row) => ({
    Question: row.Question || "",
    Answer: row.Answer || "",
  }));
};

// 📌 Sử dụng hàm để lấy danh sách câu hỏi và câu trả lời
const questionsTest = readFromExcel();
console.log("📌 Danh sách câu hỏi và câu trả lời:", questionsTest);

const questions = questionsTest.map((q) => ({
  Question: q.Question,
  Answer: q.Answer,
}));

// 📌 Hàm ghi kết quả test vào file Excel
const writeToExcel = (data) => {
  const filePath = "test_results.xlsx"; // 📝 File Excel lưu kết quả
  let workbook;
  let sheetName = "TestResults";

  // 🛑 Kiểm tra nếu file tồn tại -> Đọc file, nếu không -> tạo mới
  if (fs.existsSync(filePath)) {
    workbook = xlsx.readFile(filePath);
  } else {
    workbook = xlsx.utils.book_new();
  }

  let worksheet = workbook.Sheets[sheetName];

  // Nếu chưa có sheet, tạo mới
  if (!worksheet) {
    worksheet = xlsx.utils.aoa_to_sheet([
      [
        "Timestamp",
        "Status_API",
        "Input",
        "Actual_Response",
        "Expected_Response",
        "Status_Response(true=1,false=)",
      ], // Tiêu đề cột
    ]);
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  // ✅ Ghi dữ liệu test mới vào shee
  const newRow = [
    new Date().toISOString(), // Thời gian test
    data.status, // HTTP Status Code
    data.input, // Tin nhắn gửi vào chatbot
    data.response, // Phản hồi từ chatbot
    data.answer, // Phản hồi yêu cầu nhận được
    data.statusRes,
  ];

  // Chuyển dữ liệu hiện tại từ sheet thành mảng
  const existingData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  existingData.push(newRow);

  // Cập nhật sheet với dữ liệu mới
  const updatedSheet = xlsx.utils.aoa_to_sheet(existingData);
  workbook.Sheets[sheetName] = updatedSheet;

  // ✍️ Ghi file Excel
  xlsx.writeFile(workbook, filePath);
  console.log("✅ Test result logged in", filePath);
};
let check;

questions.map((item) =>
  describe("POST /asks", () => {
    it("should return chatbot response and log results", async () => {
      jest.setTimeout(18000);
      const inputData = {
        userQuery: item.Question,
      };

      const response = await request("http://localhost:8080")
        .post("/api/v1/chatbot/asks")
        .send(inputData)
        .set("Accept", "application/json");

      console.log("Response body:", response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("bot_response");

      if (response.body.bot_response === inputData.answer) {
        check = 1;
      } else {
        check - 0;
      }
      writeToExcel({
        status: response.status,
        input: inputData.userQuery,
        response: response.body.bot_response,
        answer: inputData.answer,
        statusRes: check,
      });
    });
  })
);
