import React, { useState } from "react";

const FlashMessage = ({ message, alertClass,  onClose }) => {
  const [showMessage, setShowMessage] = useState(true);

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
