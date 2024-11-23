import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardTitle, CardText, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const DashboardAlert = ({ titre, message,link }) => {
  const [showAlert, setShowAlert] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setShowAlert(false);
  };

  const handleContinue = () => {
    handleClose();
    navigate(link);
  };

  return (
    showAlert && (
      <Modal isOpen={showAlert} toggle={handleClose} centered>
        <ModalHeader toggle={handleClose}>{titre}</ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <CardTitle tag="h5">
              <div class="alert alert-warning" role="alert">
                <span class="alert-icon"><i class="ni ni-bold-down"></i></span>
                <span class="alert-text"><strong>!{message}</strong> </span>
              </div>
              </CardTitle>
              <CardText></CardText>
              <Button color="primary" onClick={handleContinue}>Voir </Button>
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleClose}>Fermer</Button>
        </ModalFooter>
      </Modal>
    )
  );
};

export default DashboardAlert;
