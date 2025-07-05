const tuyenSinhCollection = require("../app/models/diemchuan");
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const classifyAndExtractUserQuery = async (userQuery) => {
  const systemPrompt = `
    Bạn là hệ thống phân loại và trích xuất thông tin từ câu hỏi tuyển sinh của thí sinh.
    1. Nếu câu hỏi là loại "cộng điểm học bạ" hoặc "tính điểm ưu tiên học bạ" hoặc "tổng điểm thưởng", "tổng điểm ưu tiên", dựa vào thông tin sau: 
    Region: KV1 (miền núi, vùng núi, ven biển, hải đảo, biên giới, các thôn đặc biệt khó khăn, xã an toàn khu, ...), KV2-NT (khu vực nông thôn không thuộc KV1), KV2 (các thị xã, thành phố trực thuộc tỉnh; các thị xã, huyện ngoại thành ), KV3 (quận nội thành, thành phố).
    Policy: UT1 hoặc UT2
    hãy xuất ra JSON sau (nếu có):
    {
      "query_type": "tinh_diem_hoc_ba_uutien",
      "original_score": <số điểm thi>,
      "ielts_score": <điểm IELTS>,
      "good_grade_years": <số năm học sinh giỏi>,
      "region": <khu vực ưu tiên như KV1, KV2, KV2-NT, KV3>,
      "policy": <UT1, UT2>
    }
    2. Nếu câu hỏi là như:
    "em được XX điểm học bạ có đỗ vào ngành ... không?", 
    "em được XX điểm thi THPT có đỗ vào ngành ... không?", 
    "XX điểm thpt đỗ gì ko ạ ?"
    hãy xuất ra JSON sau:
    {
      "query_type": "du_doan_do_nganh",
      "field": "<tên ngành>",
      "score_type": "<thpt or học bạ>",
      "score": <số điểm của thí sinh>
    }
    3. Nếu không nhận diện được, trả về:
    {
      "query_type": "unknown"
    }
    Chỉ xuất ra nội dung JSON hợp lệ (bắt đầu bằng '{', kết thúc bằng '}'), không thêm văn bản thừa, không có bình luận.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userQuery },
      ],
    });

    const content = response.choices[0].message.content;
    // console.log("content", content);

    try {
      const parsed = JSON.parse(content);
      // console.log(content);
      // console.log(parsed);

      if (typeof parsed === "object" && parsed !== null) {
        const query_type = parsed.query_type || "unknown";
        if (query_type === "du_doan_do_nganh") {
          return {
            query_type,
            extracted: {
              field: parsed.field || null,
              score_type: parsed.score_type || null,
              score: parsed.score,
            },
          };
        } else if (query_type === "tinh_diem_hoc_ba_uutien") {
          return {
            query_type,
            extracted: {
              original_score: parsed.original_score,
              ielts_score: parsed.ielts_score || null,
              good_grade_years: parsed.good_grade_years || null,
              region: parsed.region || null,
              policy: parsed.policy || null,
            },
          };
        }
      }
    } catch (error) {
      throw new Error(`❌ JSON decode error: ${error.message}`);
    }
    return { query_type: "unknown", extracted: {} };
  } catch (error) {
    console.error(`OpenAI API error: ${error.message}`);
    return { query_type: "unknown", extracted: {} };
  }
};

// Tải dữ liệu điểm chuẩn từ tuyenSinhCollection
async function loadScoreData() {
  try {
    const data = await tuyenSinhCollection.find({}, { projection: { _id: 0 } });
    return data;
  } catch (error) {
    console.error(`Error loading score data: ${error.message}`);
    return [];
  }
}

// Tìm kiếm điểm chuẩn
function findMatchingScores(data, scoreType, field, score) {
  scoreType = scoreType.toLowerCase();
  if (field) {
    const filtered = data.filter(
      (item) =>
        item.ScoreType.toLowerCase() === scoreType &&
        item.Field.toLowerCase().includes(field.toLowerCase())
    );
    const results = [];
    for (const year of [2023, 2024, 2025]) {
      const rows = filtered.filter((item) => item.Year === year);
      for (const row of rows) {
        const passingScore = parseFloat(row.Score);
        const status =
          score >= passingScore ? "✔️ Đủ điểm" : "❌ Không đủ điểm";
        results.push({
          Year: year,
          Field: row.Field,
          Score: passingScore,
          Status: status,
        });
      }
    }
    return results;
  } else {
    const filtered = data.filter(
      (item) =>
        item.ScoreType.toLowerCase() === scoreType &&
        [2024, 2025].includes(item.Year) &&
        item.Score <= score
    );
    return filtered.map((item) => ({
      Field: item.Field,
      Year: item.Year,
      Score: item.Score,
    }));
  }
}

// Xử lý câu hỏi người dùng
async function handleAdmissionQuery(userInput) {
  const parsed = await classifyAndExtractUserQuery(userInput);
  const query_type = parsed.query_type;
  let generatedAnswer;

  if (query_type === "du_doan_do_nganh") {
    const { score, field, score_type } = parsed.extracted;
    const data = await loadScoreData();

    if (score !== null && score !== undefined) {
      if (!score_type) {
        const warning_msg =
          "❗ Vui lòng nhập lại câu hỏi kèm theo loại điểm (THPT hoặc học bạ). " +
          "Bạn có thể hỏi: *Em được 25 điểm THPT, liệu có đỗ ngành Công nghệ thông tin không ạ?*";
        // console.log(warning_msg);
        generatedAnswer = warning_msg;
      } else {
        if (field) {
          // console.log(
          //   `🔍 Tra cứu điểm ngành **${field}**, loại điểm **${score_type}**, điểm của bạn: **${score}**`
          // );
          const results = findMatchingScores(data, score_type, field, score);
          if (results.length) {
            const result_texts = results.map(
              (item) =>
                `- Năm ${item.Year} | Ngành: **${item.Field}** | Điểm chuẩn: **${item.Score}** → ${item.Status}`
            );
            generatedAnswer = result_texts.join("\n");
          } else {
            const warning_msg =
              "⚠️ Không tìm thấy thông tin điểm chuẩn phù hợp cho ngành đã nhập.";
            // console.log(warning_msg);
            generatedAnswer = warning_msg;
          }
        } else {
          // console.log(
          //   `🔍 Đang tra cứu các ngành phù hợp với điểm **${score}**, loại điểm **${score_type}**...`
          // );
          const matches = findMatchingScores(data, score_type, null, score);
          if (matches.length) {
            // console.log("### ✅ Các ngành bạn có thể đủ điều kiện xét tuyển:");
            // console.log(matches);
            generatedAnswer =
              "✅ Một số ngành bạn có thể đủ điều kiện xét tuyển:\n" +
              matches
                .map(
                  (row) => `- ${row.Field} (${row.Score} điểm, năm ${row.Year})`
                )
                .join("\n");
          } else {
            const warning_msg =
              "⚠️ Không có ngành nào phù hợp với mức điểm này.";
            // console.log(warning_msg);
            generatedAnswer = warning_msg;
          }
        }
      }
    } else {
      const warning_msg =
        "⚠️ Không phát hiện điểm trong câu hỏi. Vui lòng nhập điểm để tiếp tục tư vấn.";
      // console.log(warning_msg);
      generatedAnswer = warning_msg;
    }
  } else if (query_type === "tinh_diem_hoc_ba_uutien") {
    const { original_score, ielts_score, good_grade_years, region, policy } =
      parsed.extracted;
    let bonus = 0.0;
    let priority_region = 0.0;
    let priority_policy = 0.0;
    const max_score = 30.0;

    // Tính điểm cộng IELTS
    try {
      const ielts = ielts_score ? parseFloat(ielts_score) : null;
      if (ielts) {
        if (ielts >= 4.5 && ielts < 5.0) bonus += 0.75;
        else if (ielts >= 5.0 && ielts < 6.0) bonus += 1.0;
        else if (ielts >= 6.0 && ielts < 7.0) bonus += 1.25;
        else if (ielts >= 7.0) bonus += 1.5;
      }
    } catch {
      // Bỏ qua lỗi
    }

    // Tính điểm cộng học sinh giỏi
    try {
      const good_years = good_grade_years ? parseInt(good_grade_years) : null;
      if (good_years === 1) bonus += 0.3;
      else if (good_years === 2) bonus += 0.6;
      else if (good_years >= 3) bonus += 0.9;
    } catch {
      // Bỏ qua lỗi
    }

    // Tính điểm ưu tiên khu vực
    const regionUpper = region ? String(region).trim().toUpperCase() : "";
    if (regionUpper === "KV1") priority_region = 0.75;
    else if (regionUpper === "KV2-NT") priority_region = 0.5;
    else if (regionUpper === "KV2") priority_region = 0.25;
    else if (regionUpper === "KV3") priority_region = 0.0;

    // Tính điểm ưu tiên đối tượng
    const policyUpper = policy ? String(policy).trim().toUpperCase() : "";
    if (policyUpper === "UT1") priority_policy = 2.0;
    else if (policyUpper === "UT2") priority_policy = 1.0;

    const total_priority = priority_region + priority_policy;

    // Tính toán cuối cùng
    if (!original_score) {
      const total_added = (bonus + total_priority).toFixed(2);
      generatedAnswer =
        `✅ Bạn được cộng tổng cộng **${total_added} điểm**.\n\n` +
        `- Điểm cộng thưởng: **${bonus}**\n` +
        `- Điểm ưu tiên khu vực: **${priority_region}**\n` +
        `- Điểm ưu tiên đối tượng: **${priority_policy}**\n\n` +
        `➡️ Bạn có thể cộng thêm vào điểm học bạ khi xét tuyển theo phương thức học bạ kết hợp.`;
    } else {
      try {
        const originalScore = parseFloat(original_score);
        const combined_score = originalScore + bonus;
        let final_score, adjusted_total_priority;

        if (combined_score >= max_score) {
          final_score = max_score;
          adjusted_total_priority = 0;
        } else if (combined_score >= 22.5) {
          adjusted_total_priority = (
            ((max_score - combined_score) / 7.5) *
            total_priority
          ).toFixed(2);
          final_score = (
            combined_score + parseFloat(adjusted_total_priority)
          ).toFixed(2);
        } else {
          adjusted_total_priority = total_priority;
          final_score = (combined_score + total_priority).toFixed(2);
        }

        generatedAnswer =
          `✅ Điểm xét tuyển của bạn sau khi cộng:\n` +
          `- Điểm học bạ ban đầu: **${originalScore}**\n` +
          `- Điểm cộng thưởng: **${bonus}**\n` +
          `- Điểm ưu tiên khu vực: **${priority_region}**\n` +
          `- Điểm ưu tiên đối tượng: **${priority_policy}**\n` +
          `- Tổng điểm ưu tiên được cộng: **${adjusted_total_priority}**\n\n` +
          `➡️ **Tổng điểm xét tuyển: ${final_score}**`;
      } catch {
        generatedAnswer =
          "⚠️ Lỗi khi tính điểm xét tuyển. Vui lòng kiểm tra lại điểm đầu vào.";
      }
    }
  } else {
    generatedAnswer = null;
  }

  return generatedAnswer;
}

module.exports = {
  classifyAndExtractUserQuery,
  findMatchingScores,
  handleAdmissionQuery,
};
