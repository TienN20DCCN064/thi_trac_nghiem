
import hamChung from "./service.hamChung"; // Giả sử hamChung nằm trong thư mục utils

const hamChiTiet = {
  async getUserInfoByAccountId(accountId) {
    return getUserInfoByAccountId(accountId);
  },
  async getEmailByMaUser(ma_user) {
    return getEmailByMaUser(ma_user);
  },

  async getQuestionWithChoicesByChoiceId(choiceId) {
    return getQuestionWithChoicesByChoiceId(choiceId);
  },
  async getQuestionCountByChapter(ma_mh, trinh_do) {
    return getQuestionCountByChapter(ma_mh, trinh_do);
  },
  async countSoCauThiByidDangKyThi(id_dang_ky_thi) {
    return countSoCauThiByidDangKyThi(id_dang_ky_thi);
  }
};
// LOGIN
async function getUserInfoByAccountId(accountId) {
  const dataOneAccount = await hamChung.getOne("tai_khoan", accountId);
  let userInfo = null;
  if (dataOneAccount.vai_tro === "SinhVien") {
    const dataOne_taiKhoanSinhVien = await hamChung.getOne("tai_khoan_sinh_vien", dataOneAccount.id_tai_khoan);
    userInfo = await hamChung.getOne("sinh_vien", dataOne_taiKhoanSinhVien.ma_sv);
  }
  else if (dataOneAccount.vai_tro === "GiaoVien" || dataOneAccount.vai_tro === "GiaoVu") {
    const dataOne_taiKhoanGiaoVien = await hamChung.getOne("tai_khoan_giao_vien", dataOneAccount.id_tai_khoan);
    userInfo = await hamChung.getOne("giao_vien", dataOne_taiKhoanGiaoVien.ma_gv);
  }
  // Thêm email từ tài khoản vào đối tượng chi tiết
  if (userInfo) {
    userInfo.email = dataOneAccount.email || null;
  }
  return userInfo;
}
async function getEmailByMaUser(ma_user) {  
  const getAllAccountStudent = await hamChung.getAll("tai_khoan_sinh_vien");
  const getAllAccountTeacher = await hamChung.getAll("tai_khoan_giao_vien");
  const getAll = [...getAllAccountStudent, ...getAllAccountTeacher];
  let email = null;
  // tìm
  for (const user of getAll) {
    if (user.ma_user === ma_user) {
      const account = await hamChung.getOne("tai_khoan", user.id_tai_khoan);
      email = account.email || null;
      break;
    }
  }
  return email;
}
export async function getQuestionWithChoicesByChoiceId(choiceId) {
  const dataOneQuestion = await hamChung.getOne("cau_hoi", choiceId);

  // Lấy tất cả lựa chọn của câu hỏi này (giữ nguyên)
  let chon_lua = [];
  if (dataOneQuestion.loai === "chon_1") {
    const allChoices = await hamChung.getAll("chon_lua");
    chon_lua = allChoices.filter(c => c.id_ch === choiceId);

    // Nếu đáp án đúng chưa có trong chon_lua, chèn vào đầu danh sách
    if (dataOneQuestion.dap_an_dung &&
      !chon_lua.some(c => c.noi_dung === dataOneQuestion.dap_an_dung)) {
      chon_lua = [
        {
          id_chon_lua: "id_dung", // chỉ đổi id ở đáp án đúng
          id_ch: choiceId,        // thêm id_ch
          noi_dung: dataOneQuestion.dap_an_dung
        },
        ...chon_lua
      ];
    }
  }

  // Dap_an_dung mặc định từ cau_hoi
  let dap_an_dung = dataOneQuestion.dap_an_dung || "";

  // Nếu yes_no mà chưa có dap_an_dung thì mặc định yes
  if (dataOneQuestion.loai === "yes_no" && !dap_an_dung) {
    dap_an_dung = "yes";
  }

  return { ...dataOneQuestion, chon_lua, dap_an_dung };
}
async function getQuestionCountByChapter(ma_mh, trinh_do) {
  try {
    const allQuestions = await hamChung.getAll("cau_hoi");
    // Lọc câu hỏi theo ma_mh và trinh_do
    const filteredQuestions = allQuestions.filter(
      (q) => q.ma_mh === ma_mh && q.trinh_do === trinh_do
    );
    // Đếm số câu hỏi theo chương
    const questionCounts = filteredQuestions.reduce((acc, question) => {
      const chapter = question.chuong_so.toString();
      acc[chapter] = (acc[chapter] || 0) + 1;
      return acc;
    }, {});
    return questionCounts; // Trả về object dạng { "1": 50, "2": 30, ... }
  } catch (error) {
    console.error("Lỗi khi lấy số câu hỏi theo chương:", error);
    return {};
  }
}
async function countSoCauThiByidDangKyThi(id_dang_ky_thi) {
  try {
    const allDangKyThiChiTiet = await hamChung.getAll("chi_tiet_dang_ky_thi");
    // Lọc chi tiết đăng ký thi theo id_dang_ky_thi
    const filteredDetails = allDangKyThiChiTiet.filter(d => d.id_dang_ky_thi === id_dang_ky_thi);
    let count = 0;
    for (const detail of filteredDetails) {
      const so_cau = detail.so_cau || 0;
      count += so_cau;
    }
    console.log("Số câu thi cho id_dang_ky_thi", id_dang_ky_thi, "là:", count);
    return count;
  } catch (error) {
    console.error("Lỗi khi đếm số câu thi:", error);
    return 0;
  }
}

export default hamChiTiet;