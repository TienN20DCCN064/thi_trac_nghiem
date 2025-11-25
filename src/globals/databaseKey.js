
const PrimaryKeys = {
  "tai_khoan": ["id_tai_khoan"],                       // Tài khoản
  "khoa": ["ma_khoa"],                                 // Khoa
  "lop": ["ma_lop"],                                  // Lớp
  "mon_hoc": ["ma_mh"],                                // Môn học
  "giao_vien": ["ma_gv"],                              // Giáo viên
  "sinh_vien": ["ma_sv"],                              // Sinh viên
  "cau_hoi": ["id_ch"],                                // Câu hỏi
  "chon_lua": ["id_chon_lua"],                         // Đáp án lựa chọn
  "dang_ky_thi": ["id_dang_ky_thi"],                   // Đăng ký thi
  "chi_tiet_dang_ky_thi": ["id_dang_ky_thi", "chuong_so"], // Chi tiết đăng ký thi (Composite PK)
  "thi": ["id_dang_ky_thi", "ma_sv"],                                   // Bài thi
  "chi_tiet_thi": ["id_dang_ky_thi", "ma_sv", "id_ch"],                    // Chi tiết bài thi
};




export default PrimaryKeys;
// export { PrimaryKeys_not_token };