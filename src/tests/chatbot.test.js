const request = require("supertest");
const fs = require("fs");
const xlsx = require("xlsx");
// const questionsTest = [
//   {
//     _id: "67db36ca2f93d2eff2fa66d2",
//     ID: "Q008",
//     Question: "Khi nào có giấy báo trúng tuyển",
//     Answer:
//       "Thông tin về thời gian có giấy báo trúng tuyển hiện đang cập nhật, em theo dõi thêm trên website của Nhà trường nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66d3",
//     ID: "Q014",
//     Question: "Cho em hỏi học ngành này sau ra trường làm gì ạ",
//     Answer: "Em muốn tìm hiểu về ngành nào?",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66d4",
//     ID: "Q018",
//     Question:
//       "Trường có xét điểm thi Đánh giá năng lực và Đánh giá tư duy không ?",
//     Answer:
//       "Năm 2025, Nhà trường có 4 phương thức xét tuyển. Chi tiết hơn ở đây em nhé: https://utt.edu.vn/tuyensinh/tuyen-sinh/dai-hoc-chinh-quy/phuong-huong-tuyen-sinh-dai-hoc-chinh-quy-nam-2025-a16088.html",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66d5",
//     ID: "Q026",
//     Question: "Học quân sự ở trường bao lâu ạ?",
//     Answer:
//       "Tùy kế hoạch mỗi năm nhưng thường các bạn sẽ học quân sự ở năm thứ 2 và sẽ có thông báo cụ thể sau em nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66d6",
//     ID: "Q035",
//     Question:
//       "Em đăng kí xét tuyển thành công rồi, giờ em có đổi được nguyện vọng không ạ?",
//     Answer: "Có thể được em nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66d7",
//     ID: "Q036",
//     Question:
//       "Em đăng kí xét tuyển thành công rồi, giờ em xét thêm nguyện vọng được không ạ?",
//     Answer: "Có thể được em nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66d8",
//     ID: "Q040",
//     Question: "Em nộp thừa tiền xét tuyển thì lấy lại như thế nào ạ?",
//     Answer: "Em liên hệ văn phòng tuyển sinh của Nhà trường nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66d9",
//     ID: "Q043",
//     Question:
//       "Em đợi có kết quả xét tuyển rồi em đóng tiền lệ phí xét tuyển được không ?",
//     Answer: "Không được em nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66da",
//     ID: "Q063",
//     Question:
//       "Phương thức tuyển sinh chính của trường trong 2 năm gần nhất là gì?",
//     Answer:
//       "Năm nay Nhà trường có 4 phương thức xét tuyển, nhưng chủ yếu vẫn là xét tuyển sử dụng kết quả thi tốt nghiệp THPT và xét tuyển kết hợp theo đề án riêng của Trường.",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66db",
//     ID: "Q079",
//     Question: "Số sinh viên nhập học ngành Thương mại điện tử là bao nhiêu?",
//     Answer: "Năm 2024 là 204 sinh viên em nhé!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66dc",
//     ID: "Q080",
//     Question: "Số sinh viên tốt nghiệp ngành Thương mại điện tử là bao nhiêu?",
//     Answer: "Khoá gần nhất tốt nghiệp có 114 sinh viên em nhé!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66dd",
//     ID: "Q090",
//     Question:
//       "Số chỉ tiêu tuyển sinh của ngành Hệ thống thông tin là bao nhiêu?",
//     Answer: "Năm nay khoảng 300 chỉ tiêu em nhé!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66de",
//     ID: "Q091",
//     Question: "Số sinh viên nhập học ngành Hệ thống thông tin là bao nhiêu?",
//     Answer: "Đối với khoá 75 là 275 sinh viên em nhé!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66df",
//     ID: "Q092",
//     Question: "Số sinh viên tốt nghiệp ngành Hệ thống thông tin là bao nhiêu?",
//     Answer: "Khoá gần nhất có 177 sinh viên tốt nghiệp!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66e0",
//     ID: "Q093",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Hệ thống thông tin là bao nhiêu?",
//     Answer: "Có khoảng 95.45% sinh viên tốt nghiệp có việc làm!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66e1",
//     ID: "Q094",
//     Question:
//       "Số chỉ tiêu tuyển sinh của ngành Công nghệ thông tin là bao nhiêu?",
//     Answer: "Năm nay là 630 chỉ tiêu em nhé!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66e2",
//     ID: "Q096",
//     Question: "Số sinh viên tốt nghiệp ngành Công nghệ thông tin là bao nhiêu?",
//     Answer: "Khoá gần nhất có 310 sinh viên tốt nghiệp!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66e3",
//     ID: "Q101",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Công nghệ kỹ thuật công trình xây dựng là bao nhiêu?",
//     Answer: "Khoảng 94.85% em nhé!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66e4",
//     ID: "Q108",
//     Question:
//       "Số sinh viên tốt nghiệp ngành Công nghệ kỹ thuật cơ khí là bao nhiêu?",
//     Answer: "168",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66e5",
//     ID: "Q111",
//     Question:
//       "Số sinh viên nhập học ngành Công nghệ kỹ thuật cơ điện tử là bao nhiêu?",
//     Answer: "Đối với Khoá 75 là 210 sinh viên!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66e6",
//     ID: "Q113",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Công nghệ kỹ thuật cơ điện tử là bao nhiêu?",
//     Answer: "Có khoảng 92.65% sinh viên tốt nghiệp có việc làm!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66e7",
//     ID: "Q114",
//     Question:
//       "Số chỉ tiêu tuyển sinh của ngành Công nghệ kỹ thuật ô tô là bao nhiêu?",
//     Answer: "510",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66e8",
//     ID: "Q116",
//     Question:
//       "Số sinh viên tốt nghiệp ngành Công nghệ kỹ thuật ô tô là bao nhiêu?",
//     Answer: "520",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66e9",
//     ID: "Q124",
//     Question:
//       "Số sinh viên tốt nghiệp ngành Công nghệ kỹ thuật môi trường là bao nhiêu?",
//     Answer: "7",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66ea",
//     ID: "Q128",
//     Question:
//       "Số sinh viên tốt nghiệp ngành Logistics và quản lý chuỗi cung ứng là bao nhiêu?",
//     Answer: "113",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66eb",
//     ID: "Q129",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Logistics và quản lý chuỗi cung ứng là bao nhiêu?",
//     Answer: "96.63%",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66ec",
//     ID: "Q131",
//     Question: "Số sinh viên nhập học ngành Kinh tế xây dựng là bao nhiêu?",
//     Answer: "262",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66ed",
//     ID: "Q132",
//     Question: "Số sinh viên tốt nghiệp ngành Kinh tế xây dựng là bao nhiêu?",
//     Answer: "57",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66ee",
//     ID: "Q133",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Kinh tế xây dựng là bao nhiêu?",
//     Answer: "95.38%",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66ef",
//     ID: "Q135",
//     Question: "Số sinh viên nhập học ngành Khai thác vận tải là bao nhiêu?",
//     Answer: "425",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f0",
//     ID: "Q138",
//     Question: "Tên trường là gì",
//     Answer: "Trường Đại học Công nghệ Giao thông vận tải (UTT)",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f1",
//     ID: "Q139",
//     Question: "Mã trường là gì?",
//     Answer: "GTA",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f2",
//     ID: "Q142",
//     Question: "Địa chỉ các trang mạng xã hội của cơ sở đào tạo?",
//     Answer:
//       "Fanpage: https://www.facebook.com/utt.vn; Zalo: https://zalo.me/dhcngtvt",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f3",
//     ID: "Q149",
//     Question:
//       "Ai là Ủy viên Ban Thường vụ Đảng ủy của Trường Đại học Công nghệ Giao thông vận tải?",
//     Answer: "Đ/c Nguyễn Văn Lâm",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f4",
//     ID: "Q006",
//     Question: "Cho em hỏi trường có hạn xét tuyển đển khi nào",
//     Answer: "Thông tin đang cập nhật em nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f5",
//     ID: "Q012",
//     Question:
//       "Cho em hỏi em xét tuyển học bạ online được không hay đến trực tiếp",
//     Answer:
//       "Thí sinh xét  tuyển online nhé, trong trường hợp khó khăn có thể đến VP tuyển sinh thầy cô HD làm online",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f6",
//     ID: "Q016",
//     Question: "Điều kiện để học song song 2 văn bằng là gì ạ?",
//     Answer:
//       "Thời hạn nhận đơn học song song 2 chuyển ngành là trước khi học kỳ mới 4 tuần, em phải đảm bảo ngành chính của em điểm luôn phải trên 2.0",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f7",
//     ID: "Q017",
//     Question: "Trường có cần điều kiện ngoại ngữ khi xét tuyển không ?",
//     Answer: "Không cần em nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f8",
//     ID: "Q021",
//     Question: "Chỉ tiêu tuyển sinh năm nay của trường là bao nhiêu ạ ?",
//     Answer:
//       "Theo HD thông báo tuyển sinh 2025, tổng chỉ tiêu dự kiến khoảng 6.000 sinh viên",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f9",
//     ID: "Q022",
//     Question: "Trường mình có xét tuyển học bạ đợt 2 không ạ ?",
//     Answer:
//       "Năm nay Nhà trường chỉ xét tuyển duy nhất 1 đợt và không có đợt 2 em nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66fa",
//     ID: "Q029",
//     Question: "Trường mình xét tuyển mấy nguyện vọng ạ",
//     Answer: "Trường xét tuyển tối đa 5 nguyện vọng",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66fb",
//     ID: "Q031",
//     Question: "Trường có đồng phục không ạ?",
//     Answer: "Nhà trường có đồng phục em nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66fc",
//     ID: "Q037",
//     Question: "Em đăng kí thành công rồi nhưng sao vẫn chưa nhận được mail ạ ?",
//     Answer:
//       "Nếu bạn đã đăng ký thành công nhưng vẫn chưa nhận được email, có thể do một số nguyên nhân sau:\nThời gian xử lý: Trường có thể cần một chút thời gian để xử lý và gửi email xác nhận.\nKiểm tra hộp thư rác: Đôi khi email có thể bị lọc vào hộp thư rác, vì vậy bạn nên kiểm tra cả hộp thư rác.\nKiểm tra thông tin đăng ký: Đảm bảo rằng địa chỉ email bạn cung cấp khi đăng ký là chính xác.\nLiên hệ với trường: Nếu vẫn chưa nhận được email, bạn có thể liên hệ trực tiếp với phòng tuyển sinh của trường để được hỗ trợ. Số điện thoại tư vấn tuyển sinh của trường là 02435526713.",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66fd",
//     ID: "Q038",
//     Question:
//       "Em nộp tiền xét tuyển thành công rồi, nhà trường có gửi biên lai xác nhận không ạ?",
//     Answer: "Em giữ lịch sử giao dịch chuyển khoản thành công là được em nhé",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66fe",
//     ID: "Q039",
//     Question:
//       "Trường cho em hỏi làm thế nào để biết được mình chuyển khoản thành công chưa ạ?",
//     Answer: "Em giữ lịch sử giao dịch chuyển khoản thành công là được em nhé",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66ff",
//     ID: "Q045",
//     Question:
//       "Trường đăng ký lịch học cho sinh viên hay sinh viên được tự chọn lịch học ạ?",
//     Answer: "Nhà trường sẽ đăng ký lịch học kỳ chính cho các bạn.",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6700",
//     ID: "Q046",
//     Question: "Trường mình có ngành nào học bằng tiêng anh không ạ?",
//     Answer: "Em liên hệ cô Lệ tư vấn nhé: 0986899639",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6701",
//     ID: "Q047",
//     Question: "Em tốt nghiệp trước năm 2025 có được xét tuyển không ạ ?",
//     Answer: "Có em nhé",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6702",
//     ID: "Q051",
//     Question: "Trường mình trực thuộc Trường GTVT Cầu Giấy đúng ko ạ?",
//     Answer:
//       "Trường Đại học Công nghệ Giao thông Vận tải không trực thuộc Trường Đại học Giao thông Vận tải Cầu Giấy. Cả hai trường đều chuyên đào tạo về lĩnh vực giao thông vận tải nhưng là hai đơn vị độc lập. Trường Đại học Công nghệ Giao thông Vận tải có trụ sở tại số 54 Triều Khúc, Thanh Xuân, Hà Nộ",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6703",
//     ID: "Q054",
//     Question: "Tên cơ sở đào tạo là gì?",
//     Answer: "TRƯỜNG ĐH CÔNG NGHỆ GIAO THÔNG VẬN TẢI",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6704",
//     ID: "Q055",
//     Question: "Mã trường của cơ sở đào tạo là gì?",
//     Answer: "GTA",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6705",
//     ID: "Q056",
//     Question: "Địa chỉ trụ sở chính của trường là gì?",
//     Answer: "Phường Đồng Tâm, Tp. Vĩnh Yên, Tỉnh Vĩnh Phúc",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6706",
//     ID: "Q060",
//     Question: "Zalo của trường là gì?",
//     Answer: "https://zalo.me/dhcngtvt",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6707",
//     ID: "Q061",
//     Question: "Số điện thoại liên hệ tuyển sinh là gì?",
//     Answer: "02435526713",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6708",
//     ID: "Q062",
//     Question: "Tình hình việc làm của sinh viên sau tốt nghiệp như thế nào?",
//     Answer:
//       "Kết quả khảo sát cho thấy tỷ lệ sinh viên có việc làm sau 12 tháng từ khi tốt nghiệp được công khai trên trang: https://utt.edu.vn/tuyensinh/tuyen-sinh/dai-hoc-chinh-quy-n756.html",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6709",
//     ID: "Q065",
//     Question:
//       "Ngành Công nghệ kỹ thuật ô tô có tỷ lệ sinh viên có việc làm sau tốt nghiệp là bao nhiêu?",
//     Answer: "96.15%",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa670a",
//     ID: "Q071",
//     Question: "Trường có tuyển sinh theo phương thức nào khác không?",
//     Answer:
//       "Có, xét tuyển dựa trên điểm thi đánh giá tư duy do ĐH Bách khoa Hà Nội tổ chức.",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa670b",
//     ID: "Q072",
//     Question: "Chính sách ưu tiên trong xét tuyển của trường là gì?",
//     Answer:
//       "Cộng điểm ưu tiên cho thí sinh đạt giải HSG cấp tỉnh/thành phố, có chứng chỉ IELTS ≥ 4.5, hoặc có thành tích học sinh giỏi.",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa670c",
//     ID: "Q077",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Quản trị kinh doanh là bao nhiêu?",
//     Answer: "90.24%",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa670d",
//     ID: "Q082",
//     Question:
//       "Số chỉ tiêu tuyển sinh của ngành Tài chính - Ngân hàng là bao nhiêu?",
//     Answer: "360",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa670e",
//     ID: "Q083",
//     Question: "Số sinh viên nhập học ngành Tài chính - Ngân hàng là bao nhiêu?",
//     Answer: "334",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa670f",
//     ID: "Q086",
//     Question: "Số chỉ tiêu tuyển sinh của ngành Kế toán là bao nhiêu?",
//     Answer: "410",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6710",
//     ID: "Q088",
//     Question: "Số sinh viên tốt nghiệp ngành Kế toán là bao nhiêu?",
//     Answer: "282",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6711",
//     ID: "Q103",
//     Question:
//       "Số sinh viên nhập học ngành Công nghệ kỹ thuật giao thông là bao nhiêu?",
//     Answer: "201",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6712",
//     ID: "Q104",
//     Question:
//       "Số sinh viên tốt nghiệp ngành Công nghệ kỹ thuật giao thông là bao nhiêu?",
//     Answer: "156",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6713",
//     ID: "Q107",
//     Question:
//       "Số sinh viên nhập học ngành Công nghệ kỹ thuật cơ khí là bao nhiêu?",
//     Answer: "290",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6714",
//     ID: "Q109",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Công nghệ kỹ thuật cơ khí là bao nhiêu?",
//     Answer: "91.95%",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6715",
//     ID: "Q110",
//     Question:
//       "Số chỉ tiêu tuyển sinh của ngành Công nghệ kỹ thuật cơ điện tử là bao nhiêu?",
//     Answer: "320",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6716",
//     ID: "Q117",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Công nghệ kỹ thuật ô tô là bao nhiêu?",
//     Answer: "96.15%",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6717",
//     ID: "Q121",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Công nghệ kỹ thuật điện tử - viễn thông là bao nhiêu?",
//     Answer: "93.81%",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6718",
//     ID: "Q123",
//     Question:
//       "Số sinh viên nhập học ngành Công nghệ kỹ thuật môi trường là bao nhiêu?",
//     Answer: "62",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6719",
//     ID: "Q126",
//     Question:
//       "Số chỉ tiêu tuyển sinh của ngành Logistics và quản lý chuỗi cung ứng là bao nhiêu?",
//     Answer: "350",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa671a",
//     ID: "Q141",
//     Question: "Địa chỉ trang thông tin điện tử của cơ sở đào tạo?",
//     Answer: "utt.edu.vn",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa671b",
//     ID: "Q144",
//     Question:
//       "Ai là Hiệu trưởng của Trường Đại học Công nghệ Giao thông vận tải?",
//     Answer: "PGS.TS Nguyễn Hoàng Long",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa671c",
//     ID: "Q146",
//     Question:
//       "Ai là Bí thư Đảng ủy của Trường Đại học Công nghệ Giao thông vận tải?",
//     Answer: "Đ/c Vũ Ngọc Khiêm",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa671d",
//     ID: "Q147",
//     Question:
//       "Ai là Phó Bí thư Đảng ủy của Trường Đại học Công nghệ Giao thông vận tải?",
//     Answer: "Đ/c Nguyễn Hoàng Long",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa671e",
//     ID: "Q003",
//     Question: "Trường cho em xin đề án tuyển sinh năm nay",
//     Answer:
//       "Đề án tuyển sinh năm 2025 của trường bao gồm 4 phương thức tuyển sinh: xét tuyển thẳng, xét tuyển dựa trên kết quả thi tốt nghiệp THPT, xét tuyển học bạ kết hợp, và xét tuyển qua kết quả thi đánh giá tư duy/năng lực",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa671f",
//     ID: "Q004",
//     Question: "Cho em hỏi trường có xét tuyển theo hình thức học bạ không ạ",
//     Answer: "Có, trường có xét tuyển theo hình thức học bạ kết hợp",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6720",
//     ID: "Q005",
//     Question: "Cho em hỏi trường xét tổ hợp các khối nào",
//     Answer:
//       "Trường Đại học Công nghệ Giao thông Vận tải sử dụng tổng cộng 16 tổ hợp môn xét tuyển. Các tổ hợp xét tuyển sẽ được tính tương đương nhau, không có sự chênh lệch giữa các tổ hợp.\nA00: Toán, Vật lý, Hóa học\tA01: Toán, Vật lý, Tiếng Anh\tD01: Toán, Ngữ văn, Tiếng Anh\tD07: Toán, Hóa học, Tiếng Anh\nC00: Ngữ văn, Lịch sử, Địa lý\tC01: Ngữ văn, Toán, Lịch sử\tC04: Ngữ văn, Toán, Địa lý\tG01: Toán, Công nghệ, Tiếng Anh\nG02: Toán, Tin học, Tiếng Anh\tG03: Toán, GD kinh tế và pháp luật, Tiếng Anh\tG04: Toán, Ngữ văn, Vật lý\tG05: Toán, Ngữ văn, Hóa học\nG06: Toán, Ngữ văn, Sinh học\tG07: Toán, Ngữ văn, Tin học\tG08: Toán, Ngữ văn, Công nghệ\tG09: Toán, Ngữ văn, GD kinh tế và pháp luật",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6721",
//     ID: "Q013",
//     Question:
//       "Cho em hỏi học trường mình sau tốt nghiệp bằng cử nhân hay kỹ sư ạ",
//     Answer: "Tùy thuộc vào ngành em học nhé",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6722",
//     ID: "Q028",
//     Question:
//       "Sau khi xét tuyển tại trường, em có cần xét tuyển trên cổng thông tin của Bộ Giáo Dục không ạ?",
//     Answer:
//       "Theo thông tin từ đề án tuyển sinh năm 2025 của Trường Đại học Công nghệ Giao thông Vận tải, thí sinh cần đăng ký xét tuyển trên Cổng thông tin tuyển sinh của Bộ Giáo dục và Đào tạo12. Cụ thể:\nĐối với phương thức xét tuyển dựa trên kết quả thi tốt nghiệp THPT, thí sinh cần đăng ký trực tuyến theo hướng dẫn của Bộ Giáo dục và Đào tạo1.\nVới phương thức xét tuyển dựa trên kết quả thi đánh giá tư duy và đánh giá năng lực, thí sinh cũng cần đăng ký trực tuyến qua Cổng thông tin tuyển sinh của Bộ Giáo dục và Đào tạo1.\nVì vậy, sau khi xét tuyển tại trường, bạn vẫn cần thực hiện đăng ký xét tuyển trên cổng thông tin của Bộ Giáo dục và Đào tạo để hoàn tất quy trình xét tuyển",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6723",
//     ID: "Q033",
//     Question: "Trường cho em xin số điện thoại tư vấn tuyển sinh ạ",
//     Answer: "Hotline: 02435526713",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6724",
//     ID: "Q034",
//     Question:
//       "Trường cho em hỏi, sao em chưa nhận được mail trúng tuyển của trường ?",
//     Answer:
//       "Nếu bạn chưa nhận được email trúng tuyển từ Trường Đại học Công nghệ Giao thông Vận tải, có thể do một số nguyên nhân sau:\n1. Thời gian gửi email: Trường thường gửi thông báo trúng tuyển sau khi công bố điểm chuẩn, thông thường là sau ngày 19 tháng 8 hàng năm\n2. Kiểm tra hộp thư rác: Đôi khi email có thể bị lọc vào hộp thư rác, vì vậy bạn nên kiểm tra cả hộp thư rác.\n3. Kiểm tra thông tin đăng ký: Đảm bảo rằng địa chỉ email bạn cung cấp khi đăng ký xét tuyển là chính xác.\n4. Liên hệ với trường: Nếu vẫn chưa nhận được email, bạn có thể liên hệ trực tiếp với phòng tuyển sinh của trường để được hỗ trợ. Số điện thoại tư vấn tuyển sinh của trường là 024355267137.\n5. Kiểm tra kết quả trúng tuyển trực tuyến: Bạn cũng có thể kiểm tra kết quả trúng tuyển trực tuyến trên hệ thống xét tuyển của Bộ Giáo dục và Đào tạo hoặc trang web của trường",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6725",
//     ID: "Q041",
//     Question:
//       "Em xét tuyển không đỗ thì Trường có trả lại tiền xét tuyển không ạ?",
//     Answer:
//       "Lệ phí xét tuyển được sử dụng để chi trả cho quá trình xử lý hồ sơ và không được hoàn lại, bất kể kết quả xét tuyển.",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6726",
//     ID: "Q049",
//     Question: "Em muốn nhận học bổng thì phải làm thế nào ạ?",
//     Answer:
//       "Trường mình có nhiều loại học bổng, đặc biệt là với sinh viên năm nhất, trong tuần Sinh hoạt công dân các thầy cô sẽ nói cụ thể",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6727",
//     ID: "Q052",
//     Question:
//       "Em quên đăng ký nguyện vọng trên trang của Bộ rồi, hiện có cách nào đăng ký lại không ạ?",
//     Answer: "Không em",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6728",
//     ID: "Q057",
//     Question: "Cơ sở đào tạo có những phân hiệu nào?",
//     Answer:
//       "Phân hiệu Hà Nội: 54 Triều Khúc, Thanh Xuân, Tp. Hà Nội; Trung tâm đào tạo Thái Nguyên: P. Tân Thịnh, Tp. Thái Nguyên, T. Thái Nguyên",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6729",
//     ID: "Q084",
//     Question:
//       "Số sinh viên tốt nghiệp ngành Tài chính - Ngân hàng là bao nhiêu?",
//     Answer: "88",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa672a",
//     ID: "Q085",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Tài chính - Ngân hàng là bao nhiêu?",
//     Answer: "93.41%",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa672b",
//     ID: "Q087",
//     Question: "Số sinh viên nhập học ngành Kế toán là bao nhiêu?",
//     Answer: "477",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa672c",
//     ID: "Q097",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Công nghệ thông tin là bao nhiêu?",
//     Answer: "91.38%",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa672d",
//     ID: "Q099",
//     Question:
//       "Số sinh viên nhập học ngành Công nghệ kỹ thuật công trình xây dựng là bao nhiêu?",
//     Answer: "261",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa672e",
//     ID: "Q102",
//     Question:
//       "Số chỉ tiêu tuyển sinh của ngành Công nghệ kỹ thuật giao thông là bao nhiêu?",
//     Answer: "270",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa672f",
//     ID: "Q115",
//     Question:
//       "Số sinh viên nhập học ngành Công nghệ kỹ thuật ô tô là bao nhiêu?",
//     Answer: "489",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6730",
//     ID: "Q118",
//     Question:
//       "Số chỉ tiêu tuyển sinh của ngành Công nghệ kỹ thuật điện tử - viễn thông là bao nhiêu?",
//     Answer: "250",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6731",
//     ID: "Q119",
//     Question:
//       "Số sinh viên nhập học ngành Công nghệ kỹ thuật điện tử - viễn thông là bao nhiêu?",
//     Answer: "267",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6732",
//     ID: "Q122",
//     Question:
//       "Số chỉ tiêu tuyển sinh của ngành Công nghệ kỹ thuật môi trường là bao nhiêu?",
//     Answer: "100",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6733",
//     ID: "Q125",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Công nghệ kỹ thuật môi trường là bao nhiêu?",
//     Answer: "92.62%",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6734",
//     ID: "Q134",
//     Question:
//       "Số chỉ tiêu tuyển sinh của ngành Khai thác vận tải là bao nhiêu?",
//     Answer: "425",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6735",
//     ID: "Q136",
//     Question: "Số sinh viên tốt nghiệp ngành Khai thác vận tải là bao nhiêu?",
//     Answer: "72",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6736",
//     ID: "Q137",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Khai thác vận tải là bao nhiêu?",
//     Answer: "100%",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6737",
//     ID: "Q002",
//     Question: "Cho em hỏi đăng ký túc xá trường mình",
//     Answer: "E liên hệ với cô Hoài phụ trách KTX nhé 0914325892",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6738",
//     ID: "Q009",
//     Question: "Em đăng kí xét tuyển ở vĩnh phúc có được học ở hà nội không",
//     Answer:
//       "Thí sinh đăng kí ở cơ sở nào sẽ học cơ sở đó, ngành nào học tại Vĩnh Phúc sẽ có mở ngoặc bên cạnh, không có là mặc định Hà nội",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6739",
//     ID: "Q010",
//     Question: "Cho em xin điểm chuẩn vào trường",
//     Answer:
//       "Thí sinh tham khảo điểm chuẩn năm 2024: https://utt.edu.vn/tuyensinh/tuyen-sinh-dai-hoc/thong-bao-diem-chuan-xet-tuyen-som-dai-hoc-chinh-quy-phuong-thuc-xet-tuyen-hoc-ba-ket-hop-dot-1-nam-2024-a15622.html",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa673a",
//     ID: "Q015",
//     Question: "Sau khi trúng tuyển vào trường em có được chuyển ngành không?",
//     Answer:
//       "Theo quy định của Bộ Giáo dục, sinh viên năm nhất không được chuyển ngành, chuyển trường, chuyển lớp",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa673b",
//     ID: "Q019",
//     Question: "Lệ phí xét tuyển học bạ vào trường mình là bao nhiêu ?",
//     Answer: "50 nghìn đồng 1 bộ hồ sơ xét tuyển ",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa673c",
//     ID: "Q023",
//     Question: "Trường có mấy cơ sở vậy ạ?",
//     Answer:
//       "Nhà trường có 3 cơ sở đào tạo tại Hà nội, Vĩnh Phúc và Thái Nguyên. Sinh viên học tại 3 cơ sở đều chung nhau: Chương trình đào tạo, giáo trình bài giảng, giảng viên, cùng Bằng tốt nghiệp",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa673d",
//     ID: "Q024",
//     Question: "Mục đối tượng trong phần đăng kí xét tuyển em điền gì ạ?",
//     Answer:
//       "Em thuộc đối tượng con thương bệnh binh, đối tượng ưu tiên thì điền không thì bỏ qua nhé",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa673e",
//     ID: "Q025",
//     Question: "Năm đầu đã phải đi học quân sự tại cơ cở khác luôn không ạ?",
//     Answer: "Không em",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa673f",
//     ID: "Q027",
//     Question: "Trường xét tuyển học bạ chưa ạ ?",
//     Answer: "Trường xét tuyển học bạ online từ ngày....",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6740",
//     ID: "Q030",
//     Question: "Thứ tự nguyện vọng có ảnh hưởng đến kết quả xét tuyển không ạ?",
//     Answer:
//       "Có em, nhà trường xét tuyển theo thứ tự nguyện vọng, trúng tuyển tại NV nào sẽ dừng tại NV đó",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6741",
//     ID: "Q032",
//     Question: "Khi nào trường nhập học ạ ?",
//     Answer: "Hiện chưa có thông tin này, bạn có thể hỏi lại sau",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6742",
//     ID: "Q042",
//     Question: "Trường cho em hỏi cách tra cứu kết quả trúng tuyển ?",
//     Answer:
//       'Để tra cứu kết quả trúng tuyển vào Trường Đại học Công nghệ Giao thông Vận tải, bạn có thể thực hiện theo các bước sau:\nTra cứu trên website của trường:\nTruy cập vào trang web tuyển sinh của trường tại địa chỉ https://xettuyen.utc.edu.vn/.\nTìm đến mục "Tra cứu kết quả tuyển sinh".\nNhập mã số thí sinh hoặc số báo danh và thông tin cần thiết khác để tra cứu kết quả.\nTra cứu trên hệ thống của Bộ Giáo dục và Đào tạo:\nTruy cập vào địa chỉ http://thisinh.thitotnghiepthpt.edu.vn/.\nĐăng nhập bằng số CMND/CCCD/Mã định danh và mật khẩu đã được cấp.\nChọn mục "Tra cứu kết quả xét tuyển sinh" để xem kết quả.\nNếu cần hỗ trợ thêm, bạn có thể liên hệ với Văn phòng Tuyển sinh của trường qua số điện thoại 0243.552.67133.',
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6743",
//     ID: "Q044",
//     Question:
//       "Em có BHYT theo hộ giao đình rồi thì có phải tham gia BHYT theo trường không ạ?",
//     Answer: "Trong tuần sinh hoạt công dân trường sẽ có hướng dẫn",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6744",
//     ID: "Q048",
//     Question: "Em muốn đăng ký học vượt để ra trường trước hạn được không ạ?",
//     Answer: "Được em",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6745",
//     ID: "Q050",
//     Question: "Trường mình là trường công lập hay dân lập ạ?",
//     Answer: "Trường công lập em nhé",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6746",
//     ID: "Q058",
//     Question: "Trang thông tin điện tử của trường là gì?",
//     Answer: "utt.edu.vn",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6747",
//     ID: "Q059",
//     Question: "Fanpage Facebook của trường là gì?",
//     Answer: "https://www.facebook.com/utt.vn",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6748",
//     ID: "Q064",
//     Question:
//       "Điểm trúng tuyển của ngành Quản trị kinh doanh năm 2023 là bao nhiêu?",
//     Answer: "28 (học bạ KH), 22.85 (THPT)",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6749",
//     ID: "Q066",
//     Question: "Mức học phí dự kiến cho năm học 2025-2026 là bao nhiêu?",
//     Answer:
//       "520,000đ/1 tín chỉ cho chương trình đại trà, 1.5 lần mức này cho chương trình tăng cường ngoại ngữ.",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa674a",
//     ID: "Q067",
//     Question: "Các phương thức xét tuyển của trường là gì?",
//     Answer:
//       "Xét tuyển thẳng, xét học bạ kết hợp, xét tuyển dựa trên điểm thi tốt nghiệp THPT, xét tuyển dựa trên điểm thi đánh giá tư duy.",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa674b",
//     ID: "Q070",
//     Question:
//       "Chỉ tiêu tuyển sinh của ngành Logistics và quản lý chuỗi cung ứng năm 2024 là bao nhiêu?",
//     Answer: "180 (học bạ KH), 70 (THPT)",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa674c",
//     ID: "Q074",
//     Question:
//       "Số chỉ tiêu tuyển sinh của ngành Quản trị kinh doanh là bao nhiêu?",
//     Answer: "440",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa674d",
//     ID: "Q075",
//     Question: "Số sinh viên nhập học ngành Quản trị kinh doanh là bao nhiêu?",
//     Answer: "391",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa674e",
//     ID: "Q076",
//     Question: "Số sinh viên tốt nghiệp ngành Quản trị kinh doanh là bao nhiêu?",
//     Answer: "180",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa674f",
//     ID: "Q078",
//     Question:
//       "Số chỉ tiêu tuyển sinh của ngành Thương mại điện tử là bao nhiêu?",
//     Answer: "230",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6750",
//     ID: "Q081",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Thương mại điện tử là bao nhiêu?",
//     Answer: "96.04%",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6751",
//     ID: "Q089",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Kế toán là bao nhiêu?",
//     Answer: "92.51%",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6752",
//     ID: "Q095",
//     Question: "Số sinh viên nhập học ngành Công nghệ thông tin là bao nhiêu?",
//     Answer: "634",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6753",
//     ID: "Q098",
//     Question:
//       "Số chỉ tiêu tuyển sinh của ngành Công nghệ kỹ thuật công trình xây dựng là bao nhiêu?",
//     Answer: "290",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6754",
//     ID: "Q100",
//     Question:
//       "Số sinh viên tốt nghiệp ngành Công nghệ kỹ thuật công trình xây dựng là bao nhiêu?",
//     Answer: "101",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6755",
//     ID: "Q105",
//     Question:
//       "Tỷ lệ sinh viên có việc làm sau tốt nghiệp ngành Công nghệ kỹ thuật giao thông là bao nhiêu?",
//     Answer: "94.15%",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6756",
//     ID: "Q106",
//     Question:
//       "Số chỉ tiêu tuyển sinh của ngành Công nghệ kỹ thuật cơ khí là bao nhiêu?",
//     Answer: "250",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6757",
//     ID: "Q112",
//     Question:
//       "Số sinh viên tốt nghiệp ngành Công nghệ kỹ thuật cơ điện tử là bao nhiêu?",
//     Answer: "162",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6758",
//     ID: "Q120",
//     Question:
//       "Số sinh viên tốt nghiệp ngành Công nghệ kỹ thuật điện tử - viễn thông là bao nhiêu?",
//     Answer: "98",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa6759",
//     ID: "Q127",
//     Question:
//       "Số sinh viên nhập học ngành Logistics và quản lý chuỗi cung ứng là bao nhiêu?",
//     Answer: "346",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa675a",
//     ID: "Q130",
//     Question: "Số chỉ tiêu tuyển sinh của ngành Kinh tế xây dựng là bao nhiêu?",
//     Answer: "340",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa675b",
//     ID: "Q140",
//     Question: "Địa chỉ các trụ sở?",
//     Answer:
//       "Trụ sở chính: Phường Đồng Tâm, Tp. Vĩnh Yên, Tỉnh Vĩnh Phúc; Phân hiệu Hà Nội: 54 Triều Khúc, Thanh Xuân, Tp. Hà Nội; Trung tâm đào tạo Thái Nguyên: P. Tân Thịnh, Tp. Thái Nguyên, T. Thái Nguyên",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa675c",
//     ID: "Q143",
//     Question: "Số điện thoại liên hệ tuyển sinh?",
//     Answer: "Văn phòng tuyển sinh: 02435526713",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa675d",
//     ID: "Q145",
//     Question:
//       "Ai là các Phó Hiệu trưởng của Trường Đại học Công nghệ Giao thông vận tải?",
//     Answer: "TS. Nguyễn Mạnh Hùng, TS. Nguyễn Văn Lâm, TS. Trần Hà Thanh",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa675e",
//     ID: "Q148",
//     Question:
//       "Ai là Ủy viên Ban Thường vụ Đảng ủy, Chủ nhiệm UBKT của Trường Đại học Công nghệ Giao thông vận tải?",
//     Answer: "Đ/c Nguyễn Mạnh Hùng",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
// ];

// const questionsTest = [
//   {
//     _id: "67db36ca2f93d2eff2fa66d2",
//     ID: "Q008",
//     Question: "bao gio co giay bao trung tuyen",
//     Answer:
//       "Thông tin về thời gian có giấy báo trúng tuyển hiện đang cập nhật, em theo dõi thêm trên website của Nhà trường nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66d3",
//     ID: "Q014",
//     Question: "hoc nganh nay sau ra truong lam gi",
//     Answer: "Em muốn tìm hiểu về ngành nào?",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66d4",
//     ID: "Q018",
//     Question: "co xet diem thi danh gia nang luc khong",
//     Answer:
//       "Năm 2025, Nhà trường có 4 phương thức xét tuyển. Chi tiết hơn ở đây em nhé: https://utt.edu.vn/tuyensinh/tuyen-sinh/dai-hoc-chinh-quy/phuong-huong-tuyen-sinh-dai-hoc-chinh-quy-nam-2025-a16088.html",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66d5",
//     ID: "Q026",
//     Question: "hoc quan su trong bao lau",
//     Answer:
//       "Tùy kế hoạch mỗi năm nhưng thường các bạn sẽ học quân sự ở năm thứ 2 và sẽ có thông báo cụ thể sau em nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66d6",
//     ID: "Q035",
//     Question: "dang ki xet tuyen thanh con roi, co doi duoc nguyen vong khong",
//     Answer: "Có thể được em nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66d8",
//     ID: "Q040",
//     Question: "no tien bi thua thi lay lai nhu nao",
//     Answer: "Em liên hệ văn phòng tuyển sinh của Nhà trường nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66da",
//     ID: "Q063",
//     Question: "phuong thuc tuyen sinh chinh cua truong",
//     Answer:
//       "Năm nay Nhà trường có 4 phương thức xét tuyển, nhưng chủ yếu vẫn là xét tuyển sử dụng kết quả thi tốt nghiệp THPT và xét tuyển kết hợp theo đề án riêng của Trường.",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66db",
//     ID: "Q079",
//     Question: "so sinh vien nhap hoc nganh thuong mai dien tu",
//     Answer: "Năm 2024 là 204 sinh viên em nhé!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66dc",
//     ID: "Q080",
//     Question: "so sinh vien tot nghiep nganh thuong mai dien tu",
//     Answer: "Khoá gần nhất tốt nghiệp có 114 sinh viên em nhé!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66dd",
//     ID: "Q090",
//     Question: "chi tieu tuyen sinh nganh he thong thong tin",
//     Answer: "Năm nay khoảng 300 chỉ tiêu em nhé!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66de",
//     ID: "Q091",
//     Question: "so sinh vien nhanh hoc nganh he thong",
//     Answer: "Đối với khoá 75 là 275 sinh viên em nhé!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66e0",
//     ID: "Q093",
//     Question:
//       "Ty le sinh vien co viec lam sau khi ra truong nganh he thong thong tin",
//     Answer: "Có khoảng 95.45% sinh viên tốt nghiệp có việc làm!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66e1",
//     ID: "Q094",
//     Question: "chi tieu tuyen sinh nganh cong nghe thong tin",
//     Answer: "Năm nay là 630 chỉ tiêu em nhé!",
//     CreatedTime: "2025-03-13 08:29:28.365000",
//     UpdatedTime: "2025-03-13 08:29:28.365000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f0",
//     ID: "Q138",
//     Question: "ten cua truong",
//     Answer: "Trường Đại học Công nghệ Giao thông vận tải (UTT)",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f1",
//     ID: "Q139",
//     Question: "Ma truong",
//     Answer: "GTA",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f2",
//     ID: "Q142",
//     Question: "dia chi trang mang xa hoi",
//     Answer:
//       "Fanpage: https://www.facebook.com/utt.vn; Zalo: https://zalo.me/dhcngtvt",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f3",
//     ID: "Q149",
//     Question: "ai la uy ban thuong vu cua truong",
//     Answer: "Đ/c Nguyễn Văn Lâm",
//     CreatedTime: "2025-03-13 08:29:32.277000",
//     UpdatedTime: "2025-03-13 08:29:32.277000",
//     Type: 1,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f4",
//     ID: "Q006",
//     Question: "truong minh co han xet tuyen den khi nao",
//     Answer: "Thông tin đang cập nhật em nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f5",
//     ID: "Q012",
//     Question: "xet tuyen hoc ba Online duoc khong",
//     Answer:
//       "Thí sinh xét  tuyển online nhé, trong trường hợp khó khăn có thể đến VP tuyển sinh thầy cô HD làm online",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f6",
//     ID: "Q016",
//     Question: "hoc song song 2 van bang",
//     Answer:
//       "Thời hạn nhận đơn học song song 2 chuyển ngành là trước khi học kỳ mới 4 tuần, em phải đảm bảo ngành chính của em điểm luôn phải trên 2.0",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
//   {
//     _id: "67db36ca2f93d2eff2fa66f7",
//     ID: "Q017",
//     Question: "co can dieu kien ngoai ngu khi xet tuyen khong",
//     Answer: "Không cần em nhé!",
//     CreatedTime: "2025-03-13T12:34:56.789Z",
//     UpdatedTime: "2025-03-13T12:34:56.789Z",
//     Type: null,
//   },
// ];

const filePathRead = "testdata.xlsx";

// function removeDiacritics(str) {
//   return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
// }

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
  describe("POST /chatbot/asks", () => {
    it("should return chatbot response and log results", async () => {
      jest.setTimeout(10000);
      const inputData = { userQuery: item.Question, answer: item.Answer };

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
