import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import Header from "components/Headers/Header";

const DetailTravaux = () => {
  const { id } = useParams(); // ID de la demande
  const [demande, setDemande] = useState(null); // Détails de la demande
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // État d'erreur
  const authRole = localStorage.getItem("authRole"); // Rôle de l'utilisateur
  const navigate = useNavigate();

  // Récupération des détails de la demande
  useEffect(() => {
    const fetchDemandeDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `http://localhost:8080/api/v1/${authRole}/demande/detail/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDemande(data);
        } else {
          setError("Erreur lors de la récupération des détails de la demande.");
        }
      } catch (err) {
        setError("Erreur réseau ou problème de serveur.");
      }
      setLoading(false);
    };

    fetchDemandeDetails();
  }, [id, authRole]);

  if (loading) {
    return <p>Chargement des détails...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Calcul du prix total de tous les travaux
  const totalPrixTravaux = demande.travaux.reduce((total, travail) => total + travail.total, 0);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col xl="8">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Détail de la Demande</h3>
              </CardHeader>
              <CardBody>
                {/* Informations générales */}
                <Row>
                  <Col lg="6">
                    <h5>Service demandeur</h5>
                    <p>{demande.service.nom}</p>
                    <h5>Agent </h5>
                    <p>{`${demande.utilisateur.nom} ${demande.utilisateur.prenom}`}</p>
                  </Col>
                  <Col lg="6">
                    <h5>Date d'envoie </h5>
                    <p>{new Date(demande.date).toLocaleDateString()}</p>
                    <h5>Motif</h5>
                    <p>{demande.motif}</p>
                  </Col>
                </Row>

                <hr className="my-4" />

                {/* Liste des travaux */}
                <h4>Liste des Travaux</h4>
                {demande.travaux.length > 0 ? (
                  <ul>
                    {demande.travaux.map((travail) => (
                      <li key={travail.id}>
                        <h4>{travail.nom}</h4>
                        <p>
                          Période des travaux :{" "}
                          {new Date(travail.dateDebut).toLocaleDateString()} -{" "}
                          {new Date(travail.dateFin).toLocaleDateString()}
                        </p>
                        <p>Total : {travail.total.toLocaleString('en-US')} Ar</p>

                        {/* Liste des ressources */}
                        <h5>Ressources utilisées :</h5>
                        {travail.ressourceTravaux.length > 0 ? (
                          <ul>
                            {travail.ressourceTravaux.map((rt) => (
                              <li key={rt.id}>
                                <p>
                                  {rt.ressource.nom} 
                                </p>
                                <h5>Quantité : {rt.quantite}</h5>
                                <h5>Prix unitaire : {rt.ressource.valeurUnitaire.toLocaleString('en-US')} Ar</h5>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>Aucune ressource utilisée pour ce travail.</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun travail associé à cette demande.</p>
                )}
                <h2 className="mt-4 text-center">Prix total des Travaux : {totalPrixTravaux.toLocaleString('en-US')} Ar</h2>


                <hr className="my-4" />

                {/* Total global */}
                {demande.statut.id===10 &&(
                
                <Row className="justify-content-center">
                  <Col lg="8">
                    <div class="alert alert-warning" role="alert">
                        <span class="alert-icon"><i class="ni ni-bold-down"></i></span>
                        <span class="alert-text"><strong>!Reclamation sur les travaux</strong> </span>
                    </div>
                    <h4><i class="ni ni-bold-right">{demande.reclamations[demande.reclamations.length-1].motif}</i></h4>
                    <div className="mt-4 text-center">
                <Button color="warning" onClick={() => navigate(`/${authRole}/Travaux/reouverture/${demande.id}`)}>
                  Réouvrir les travaux
                </Button>
              </div>
                  </Col>

                </Row>
              )
              }

              {
                demande.statut.id===9 &&(
                  <Row className="justify-content-center">
                    <Col lg="8">
                      <h4 className="mb-0">Historique du suivi de la demande</h4>
                      <ul>
                        {demande.statutDemandes
                          .slice() // Crée une copie pour ne pas modifier l'original
                          .sort((a, b) => new Date(a.date_changement) - new Date(b.date_changement)) // Trie par date en ordre croissant
                          .map((statutdemande) => (
                            <li key={statutdemande.id}>
                              <p>{new Date(statutdemande.date_changement).toLocaleDateString()} : {statutdemande.statut.description}</p>
                            </li>
                          ))}
                      </ul>
                    </Col>
                  </Row>
                  
                )
              }
               

                <div className="mt-4 text-center">
                  <Button color="primary" onClick={() => window.history.back()}>
                    Retour
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DetailTravaux;
