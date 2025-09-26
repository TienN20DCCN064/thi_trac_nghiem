
import hamChung from "./service.hamChung"; // Giả sử hamChung nằm trong thư mục utils

const hamChiTiet = {
    async getUserInfoByAccountId(accountId) {
        return getUserInfoByAccountId(accountId);
    },

};
// LOGIN
async function getUserInfoByAccountId(accountId) {
    const dataOneAccount = await hamChung.getOne("tai_khoan", accountId);
    let userInfo = null;
    if (dataOneAccount.vai_tro === "Sinh_Vien") {
        const dataOne_taiKhoanSinhVien = await hamChung.getOne("tai_khoan_sinh_vien", dataOneAccount.id_tai_khoan);
        userInfo = await hamChung.getOne("sinh_vien", dataOne_taiKhoanSinhVien.ma_sv);
    }
    else if (dataOneAccount.vai_tro === "GiaoVien" || dataOneAccount.vai_tro === "GiaoVu") {
        const dataOne_taiKhoanGiaoVien = await hamChung.getOne("tai_khoan_giao_vien", dataOneAccount.id_tai_khoan);
        userInfo = await hamChung.getOne("giao_vien", dataOne_taiKhoanGiaoVien.ma_gv);
    }

    return userInfo;
}

export default hamChiTiet;