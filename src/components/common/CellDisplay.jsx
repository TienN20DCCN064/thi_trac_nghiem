import React from "react";
import hamChung from "../../services/service.hamChung.js";

const CellDisplay = ({
  table,
  id,
  fieldHo = "ho",
  fieldTen = "ten",
  fieldName = null,
  upperCase = false,
}) => {
  const [text, setText] = React.useState("----");

  React.useEffect(() => {
    if (!id) {
      setText("----");
      return;
    }

    // Nếu là bảng tai_khoan_nguoi_dung → dùng hàm đặc biệt
    const fetchData =
      table === "tai_khoan_nguoi_dung"
        ? hamChung.getOneInfUserByid_tai_khoan(id)
        : hamChung.getOne(table, id);

    fetchData
      .then((res) => {
        if (!res) {
          setText("----");
          return;
        }

        let value = "----";

        // Nếu có fieldName (ma_sv / ma_gv)
        if (fieldName && res[fieldName]) {
          value = res[fieldName];
        }
        // Nếu là người dùng (họ tên)
        else if (res[fieldHo] && res[fieldTen]) {
          value = `${res[fieldHo]} ${res[fieldTen]}`;
        } else {
          value = id;
        }

        setText(upperCase ? value.toUpperCase() : value);
      })
      .catch(() => setText("----"));
  }, [table, id, fieldHo, fieldTen, fieldName, upperCase]);

  return <>{text}</>;
};


export default CellDisplay;
