import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import hamChung from "../../services/service.hamChung.js"; // đường dẫn đúng của bạn

const UserImage = ({ publicId, maxWidth = 60 }) => {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!publicId) {
      setUrl(null);
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      setLoading(true);
      try {
        const res = await hamChung.getImageUrl(publicId);
        if (mounted) setUrl(res.imageUrl); // res là { imageUrl }
      } catch (err) {
        console.error(err);
        if (mounted) setUrl(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchImage();

    return () => {
      mounted = false;
    };
  }, [publicId]);

  if (loading) return <Spin size="small" />;
  if (!url) return "N/A";

  return <img src={url} alt="Hình ảnh" style={{ maxWidth }} />;
};

export default UserImage;
