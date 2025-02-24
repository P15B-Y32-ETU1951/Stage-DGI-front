import UserHeader from "components/Headers/UserHeader";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Input,
  FormGroup,
} from "reactstrap";

const UploadFileComponent = () => {
  const [file, setFile] = useState(null);
  const { id } = useParams(); // Récupérer l'ID de la demande depuis l'URL
  const navigate = useNavigate(); // Utilisé pour naviguer vers une autre page

  // Fonction pour gérer la sélection du fichier
  // Fonction pour gérer la sélection du fichier
const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    // Vérifier le type MIME du fichier
    if (selectedFile.type !== "application/pdf") {
      alert("Seuls les fichiers PDF sont autorisés.");
      e.target.value = ""; // Réinitialiser le champ de sélection du fichier
      setFile(null);
      return;
    }
    setFile(selectedFile);
  }
};


  // Fonction pour gérer l'upload
  const handleUpload = async () => {
    if (!file) {
      alert("Veuillez sélectionner un fichier avant de l'importer.");
      return;
    }
  
    // Utiliser FormData pour envoyer le fichier au backend
    const formData = new FormData();
    formData.append('file', file); // Le fichier lui-même
    formData.append('id', id); // L'ID de la demande
  
    const authToken = localStorage.getItem('authToken');
    const authRole = localStorage.getItem('authRole');
  
    try {
      const response = await fetch(`http://192.168.88.18:8080/api/v1/${authRole}/rapport`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData, // Envoyer formData
      });
  
      if (response.ok) {
        alert("Rapport importé avec succès");
        navigate(`/${authRole}/Travaux/rapport`)
      } else {
        console.error('Erreur lors de l\'importation du rapport:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  };
  

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col xl="8">
            <Card className="bg-secondary shadow-sm mb-4">
              <CardHeader className="bg-default">
                <h3 className="mb-0 text-white">Rapport des Travaux effectués</h3>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <label className="btn btn-sm btn-primary">
                    <i className="fas fa-search" /> Choisissez un fichier
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </label>
                  {file && <p className="mt-2">Fichier sélectionné : {file.name}</p>}
                </FormGroup>
                <Button color="warning" onClick={handleUpload}>
                  <i className="ni ni-cloud-upload-96" /> Importer le Rapport
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UploadFileComponent;
