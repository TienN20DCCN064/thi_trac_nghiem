import React from "react";
import hamChung from "../../services/service.hamChung.js";

const CellDisplay = ({ table, id, fieldHo = "ho", fieldTen = "ten", fieldName = null }) => {
  const [text, setText] = React.useState(null);

  React.useEffect(() => {
    if (!id) return;

    hamChung
      .getOne(table, id)
      .then((res) => {
        if (fieldName && res[fieldName]) {
          setText(res[fieldName]); // lấy theo tên cột cụ thể (vd: ten_lop, ten_mh)
        } else if (res[fieldHo] && res[fieldTen]) {
          setText(res[fieldHo] + " " + res[fieldTen]); // mặc định họ + tên
        } else {
          setText(id); // fallback
        }
      })
      .catch(() => setText(id));
  }, [table, id, fieldHo, fieldTen, fieldName]);

  return <>{text || id}</>;
};

export default CellDisplay;
