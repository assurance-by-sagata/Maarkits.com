import React, { useState,useEffect } from "react";

const FlashMessage = ({ message, alertClass,  onClose }) => {
  const [showMessage, setShowMessage] = useState(true);
  useEffect(() => {
    // Scroll to the top of the window when the component mounts or when a flash message is received
    window.scrollTo(0, 0);
  }, []);
  const handleClose = () => {
    setShowMessage(false);
    onClose();
  };

  return (
    showMessage && (
      <div className={`alert ${alertClass}  alert-dismissible clearfix`}>
        <button
          className="close"
          data-dismiss="alert"
          aria-label="close"
          onClick={handleClose}
        >
           &times;
        </button>
        {message}
      </div>
    )
  );
};

export default FlashMessage;
