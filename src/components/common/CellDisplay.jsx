import React from "react";
import hamChung from "../../services/service.hamChung.js";

const CellDisplay = ({
  table,
  id,
  fieldHo = "ho",
  fieldTen = "ten",
  fieldName = null,
}) => {
  const [text, setText] = React.useState("----");

  React.useEffect(() => {
    if (!id) {
      setText("----");
      return;
    }

    hamChung
      .getOne(table, id)
      .then((res) => {
        if (!res) {
          setText("----");
          return;
        }

        if (fieldName && res[fieldName]) {
          setText(res[fieldName]); // Lấy theo cột cụ thể (vd: ma_gv hoặc ma_sv)
        } else if (res[fieldHo] && res[fieldTen]) {
          setText(`${res[fieldHo]} ${res[fieldTen]}`); // fallback họ tên
        } else {
          setText(id); // fallback hiển thị id
        }
      })
      .catch(() => setText("----"));
  }, [table, id, fieldHo, fieldTen, fieldName]);

  return <>{text}</>;
};

export default CellDisplay;
