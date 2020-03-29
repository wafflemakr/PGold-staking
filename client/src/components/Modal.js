import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function MyModal({
  modalOpen,
  toggleModal,
  onConfirm,
  children,
  title,
  simple = false
}) {
  const handleClick = () => {
    toggleModal();
    onConfirm();
  };

  return (
    <Modal show={modalOpen} onHide={toggleModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      {children && <Modal.Body>{children}</Modal.Body>}
      <Modal.Footer className="justify-content-around">
        {simple ? (
          <Button variant="outline=danger" onClick={toggleModal}>
            OK
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            <Button variant="outline-danger" onClick={handleClick}>
              Confirm
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}
