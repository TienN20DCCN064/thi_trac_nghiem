import React from "react";
import hamChung from "../../services/service.hamChung.js";

const CellDisplay = ({
  table,
  id,
  fieldHo = "ho",
  fieldTen = "ten",
  fieldName = null,
  upperCase = false, // ✅ thêm thuộc tính tùy chọn
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

        let value = "----";
        if (fieldName && res[fieldName]) {
          value = res[fieldName];
        } else if (res[fieldHo] && res[fieldTen]) {
          value = `${res[fieldHo]} ${res[fieldTen]}`;
        } else {
          value = id;
        }

        // ✅ Nếu có thuộc tính upperCase thì in hoa text
        setText(upperCase ? value.toUpperCase() : value);
      })
      .catch(() => setText("----"));
  }, [table, id, fieldHo, fieldTen, fieldName, upperCase]);

  return <>{text}</>;
};

export default CellDisplay;
