import React from 'react';
import { Alert } from 'reactstrap';

const AlertNotification = ({ message, onClose }) => {
  return (
    <Alert color="danger" toggle={onClose}>
      {message}
    </Alert>
  );
};

export default AlertNotification;
