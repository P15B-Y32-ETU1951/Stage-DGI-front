import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader.js";

const Ajouter_Ressource = () => {
  // State pour les valeurs des champs
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState(0);
  const [valeurUnitaire, setValeurUnitaire] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fonction de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const data = {
      nom: nom,
      quantite: parseInt(quantite), // S'assurer que c'est un nombre
      valeurUnitaire: parseInt(valeurUnitaire), // S'assurer que c'est un nombre
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/DPR_SAF/ressource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      setSuccess(true);
      setNom("");
      setQuantite(0);
      setValeurUnitaire(0);
      console.log("Ressource ajoutée avec succès");
    } catch (error) {
      setError(error.message);
      console.error("Erreur lors de l'envoi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UserHeader />
      {/* Contenu de la page */}
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0" >
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Ajouter une Ressource</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="nom">Nom</Label>
                    <Input
                      type="text"
                      id="nom"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="quantite">Quantité</Label>
                    <Input
                      type="number"
                      id="quantite"
                      value={quantite}
                      onChange={(e) => setQuantite(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="valeurUnitaire">Valeur Unitaire (Ar)</Label>
                    <Input
                      type="number"
                      id="valeurUnitaire"
                      value={valeurUnitaire}
                      onChange={(e) => setValeurUnitaire(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <Button color="primary" type="submit" disabled={loading}>
                    {loading ? "Envoi..." : "Ajouter Ressource"}
                  </Button>
                </Form>
                {error && <p className="text-danger mt-3">Erreur: {error}</p>}
                {success && <p className="text-success mt-3">Ressource ajoutée avec succès !</p>}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Ajouter_Ressource;
