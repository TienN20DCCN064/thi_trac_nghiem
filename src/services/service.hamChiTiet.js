
import hamChung from "./service.hamChung"; // Giả sử hamChung nằm trong thư mục utils

const hamChiTiet = {
  async getUserInfoByAccountId(accountId) {
    return getUserInfoByAccountId(accountId);
  },

  async getQuestionWithChoicesByChoiceId(choiceId) {
    return getQuestionWithChoicesByChoiceId(choiceId);
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

  return userInfo;
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


export default hamChiTiet;