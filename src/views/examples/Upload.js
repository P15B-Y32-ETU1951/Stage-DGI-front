import UserHeader from "components/Headers/UserHeader";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Input,
} from "reactstrap";

const UploadFileComponent = () => {
  const [file, setFile] = useState(null);
  const id=useParams();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
  
  };

  return (
    <>
   
    <UserHeader />
    <Container className="mt--7" fluid>
      <Row className="justify-content-center">
        <Col xl="8">
          <Card className="card-profile shadow">
            <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
              <h3>Uploader un Fichier</h3>
            </CardHeader>
            <CardBody className="pt-0 pt-md-4">
              <div className="text-center">
                <Input type="file" onChange={handleFileChange} className="mb-3" />
                <Button color="primary" onClick={handleUpload}>Upload</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default UploadFileComponent;
