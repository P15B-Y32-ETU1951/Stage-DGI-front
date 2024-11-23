import { useParams, useNavigate } from "react-router-dom"; // Importer useParams
import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col,
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader.js";

const DocViewer = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Récupérer l'id depuis l'URL
  const [demande, setDemande] = useState({});
  const [authRole, setAuthRole] = useState(null);
  const [motifRejet, setMotifRejet] = useState(''); // État pour le motif de rejet

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    const authToken = localStorage.getItem('authToken');
    const role = localStorage.getItem('authRole');

   

    const data = {
        "statut": 2,
        "id_demande": id
    };

    try {
        const response = await fetch(`http://localhost:8080/api/v1/${role}/demande/statut`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log('Demande validée avec succès');
            
            navigate(`/${role}/valider`);
        } else {
            console.error('Erreur lors de l\'envoi de la demande:', response.statusText);
        }
    } catch (error) {
        console.error('Erreur réseau:', error);
    }
  };

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const role = localStorage.getItem('authRole');
        setAuthRole(role);  // Mettre à jour authRole

        const response = await fetch(`http://localhost:8080/api/v1/${role}/demande/detail/${id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        setDemande(data);
        console.log("Demande:", data);

        // Si le statut est égal à 5, récupérer le motif de rejet
        if (data.statut.id === 5) {
          const rejetResponse = await fetch(`http://localhost:8080/api/v1/${role}/rejet/${id}`, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          const rejetData = await rejetResponse.json();
          console.log("Rejet:", rejetData);
          setMotifRejet(rejetData.motif); // Mettre à jour le motif de rejet
        }

      } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    };

    fetchDemandes();
  }, [id]);

  const docs = [
    { uri: "file:///C:/Users/MSI/Desktop/ITU/Rapports_path/rapport-2352.pdf",

        fileType: "pdf"
     }, // Local file with file URI scheme
   
  ];
  

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0" >
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">{demande.service?.nom}</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
              <DocViewer
                documents={docs}
            />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DocViewer;
