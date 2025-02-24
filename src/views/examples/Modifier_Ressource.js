import React, { useState,useEffect } from "react";
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
import { useParams } from "react-router-dom";

const Modifier_Ressource = () => {
    const{id} = useParams();
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

    // Vérification des valeurs
    if (quantite < 1 || valeurUnitaire < 1) {
        setError("Les valeurs de quantité et de valeur unitaire doivent être supérieures ou égales à 1.");
        setLoading(false);
        return;
    }

    const data = {
        id: id,
        nom: nom,
        quantite: parseInt(quantite), // S'assurer que c'est un nombre
        valeurUnitaire: parseInt(valeurUnitaire) // S'assurer que c'est un nombre
    };

    try {
        const response = await fetch(`http://192.168.88.18:8080/api/v1/DPR_SAF/ressource/modifier`, {
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
        console.log("Ressource modifiée avec succès");
    } catch (error) {
        setError(error.message);
        console.error("Erreur lors de l'envoi:", error);
    } finally {
        setLoading(false);
    }
};

  useEffect(()=>{
    const fetchressource= async ()=>{
        try{
            const response=await fetch(`http://192.168.88.18:8080/api/v1/DPR_SAF/ressource/${id}`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${localStorage.getItem("authToken")}`
                }
            });
            if(!response.ok){
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }
            const data=await response.json();
            setNom(data.nom);
            setQuantite(data.quantite);
            setValeurUnitaire(data.valeurUnitaire);
        }catch(error){
            console.error("Erreur lors de la récupération de la ressource:",error);
        }
    };
    fetchressource();
  },[id]);
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
                    <h3 className="mb-0">Modifier la ressource </h3>
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
                      min="1"
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
                      min="1"
                      onChange={(e) => setValeurUnitaire(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <Button color="success" type="submit" disabled={loading}>
                    {loading ? "Envoi..." : "Enregistrer les modifications"}
                  </Button>
                </Form>
                {error && <p className="text-danger mt-3">Erreur: {error}</p>}
                {success && <p className="text-success mt-3">Ressource modifiée avec succès !</p>}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Modifier_Ressource;
