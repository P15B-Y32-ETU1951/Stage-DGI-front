import { useParams, useNavigate } from "react-router-dom";
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

const Approvisionnement = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Récupérer l'id de la ressource depuis l'URL
  const [ressource, setRessource] = useState({});
  const [quantiteAjouter, setQuantiteAjouter] = useState(0);
  const authRole = localStorage.getItem('authRole');
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchRessource = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/ressource/${id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        setRessource(data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la ressource:', error);
      }
    };

    fetchRessource();
  }, [authRole, id, authToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      id_ressource: id,
      quantite: parseFloat(quantiteAjouter)
    };

    try {
      const response = await fetch(`http://localhost:8080/api/v1/${authRole}/ressource/approvisionner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Réapprovisionnement effectué avec succès !');
        navigate(`/${authRole}/ressource`);
      } else {
        alert('Une erreur est survenue lors du réapprovisionnement.');
      }
    } catch (error) {
      console.error('Erreur lors du réapprovisionnement:', error);
    }
  };

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
                    <h3 className="mb-0">Réapprovisionnement en {ressource.nom}</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <h6 className="heading-small text-muted mb-4">Ressource: {ressource.nom}</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="input-quantite">
                        Quantité à ajouter
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="input-quantite"
                        type="number"
                        min="1"
                        value={quantiteAjouter}
                        onChange={(e) => setQuantiteAjouter(e.target.value)}
                      />
                    </FormGroup>
                  </div>
                  <div className="text-center">
                    <Button className="my-4" color="success" type="submit">
                      Réapprovisionner
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Approvisionnement;
