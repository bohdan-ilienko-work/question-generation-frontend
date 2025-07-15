import React from "react";
import { Modal, Button } from "antd";

export interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      title="Logout Confirmation"
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="logout" type="primary" danger onClick={onConfirm}>
          Log Out
        </Button>,
      ]}
    >
      <p>Are you sure you want to log out?</p>
    </Modal>
  );
};

export default LogoutConfirmationModal;
