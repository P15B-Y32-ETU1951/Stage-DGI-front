import { useParams,useNavigate } from "react-router-dom"; // Importer useParams
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

const DPR_Detail_Plan = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Récupérer l'id depuis l'URL
  const [demande, setDemande] = useState({});
  const authToken = localStorage.getItem('authToken');
  const authRole = localStorage.getItem('authRole');
   
  const handleSubmit = async () => {
    
   

    // Récupérer les valeurs du localStorage
    
    const authToken = localStorage.getItem('authToken');
    const role = localStorage.getItem('authRole');


    

    // Reformatage de la date au format YYYY-MM-DD
   
    const data = {
        "statut":4,
        "id_demande":id
    }
   
    // Créer un objet avec les valeurs de l'état

    // Envoyer la requête POST à l'URL appropriée
    try {
        const response = await fetch(`http://192.168.88.18:8080/api/v1/${role}/demande/statut`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log('Demande validée avec succès');
            navigate(`/${role}/demande`);
            // Reset des champs du formulaire
        } else {
            console.error('Erreur lors de l\'envoi de la demande:',response.statusText );
           
        }
    } catch (error) {
        console.error('Erreur réseau:', error);
    }
};

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
       
        const response = await fetch(`http://192.168.88.18:8080/api/v1/${authRole}/demande/detail/${id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        setDemande(data);
        console.log("Demande:", data);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    };

    fetchDemandes();
  }, [id]); // L'effet dépend de l'id, donc il s'exécutera à chaque changement d'id

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col className="order-xl-1" xl="8">
            <Card className="shadow bg-secondary">
              <CardHeader className="bg-white border-0" >
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">{demande.service?.nom}</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="info"
                    
                      onClick={async() => handleSubmit().then(() => navigate(`/${authRole}/Planification/${demande.id}`))}

                      size="lg"
                    >
                      Valider 
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => navigate(`/${authRole}/rejet/${id}`)} // Rediriger vers le composant DPR_Demandes(e)}
                      size="lg"
                    >
                      Rejetter 
                    </Button>
                  </Col>

                 
                    
                 
                </Row>
                
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="mb-4 heading-small text-muted">
                    {demande.motif}
                  </h6>
                  <hr className="my-4" />
                  <div className="pl-lg-4">
                    <FormGroup>
                      <Input
                        className="form-control-alternative"
                        placeholder="A few words about you ..."
                        rows="30"
                        value={demande.description}
                        type="textarea"
                      />
                    </FormGroup>
                  </div>
                </Form>
                <Row className="align-items-center">
               
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DPR_Detail_Plan;
