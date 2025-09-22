import React, { useState, useEffect, useRef } from "react";

const TIME_RUN = 500;

const LoadingOverlay = ({ loading }) => {
  const [show, setShow] = useState(false);
  const timeoutId = useRef(null);

  // Handle loading changes
  useEffect(() => {
    if (loading) {
      // nếu loading bật, show ngay
      setShow(true);
      // cancel timeout cũ nếu có
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
    } else if (show) {
      // nếu loading tắt, delay TIME_RUN trước khi hide
      timeoutId.current = setTimeout(() => {
        setShow(false);
        timeoutId.current = null;
      }, TIME_RUN);
    }

    // cleanup khi unmount
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [loading, show]);

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.spinner}></div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid #ccc",
    borderTop: "6px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

// keyframes
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`, styleSheet.cssRules.length);

export default LoadingOverlay;
