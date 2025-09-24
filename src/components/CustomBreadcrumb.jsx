import React from "react";
import { Breadcrumb } from "antd";

const CustomBreadcrumb = ({ items }) => {
  return (
    <Breadcrumb>
      {items.map((item, index) => (
        <Breadcrumb.Item key={index}>
          {item.isCurrent ? (
            <span className="breadcrumb-text">{item.label}</span>
          ) : (
            <span className="breadcrumb-link">{item.label}</span>
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
