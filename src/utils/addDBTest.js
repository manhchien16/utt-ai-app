const addData = async () => {
  try {
    const data = await faqCollection.insertMany([
      {
        Question: "Học phí của trường là bao nhiêu?",
        Answer: "Học phí phụ thuộc vào ngành học và bậc đào tạo.",
      },
      {
        Question: "Thời gian nhập học là khi nào?",
        Answer: "Thời gian nhập học thường vào tháng 8 hoặc tháng 9 hàng năm.",
      },
    ]);

    console.log("Dữ liệu đã được thêm:", data);
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu:", error);
  }
};
