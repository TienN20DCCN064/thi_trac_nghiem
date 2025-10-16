import React from "react";
import { Table } from "antd";
import hamChung from "../../services/service.hamChung.js";
import { useEffect, useState } from "react";

const CellDisplay = ({ table, id, fieldName }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await hamChung.getAll(table);
        const foundItem = result.find(item => item.id === id);
        setData(foundItem ? foundItem[fieldName] : null);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [table, id, fieldName]);

  return <span>{data || "Loading..."}</span>;
};

export default CellDisplay;