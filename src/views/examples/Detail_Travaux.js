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
import { Navigate, useNavigate, useParams } from "react-router-dom"; // Utilisé pour récupérer l'ID de la demande depuis l'URL
import Header from "components/Headers/Header";

const DetailTravaux = () => {
  const { id } = useParams(); // L'ID du travail à afficher
  const [demande, setDemande] = useState(null); // Détails de la demande
  const [ressources, setRessources] = useState([]); // Ressources liées au travail
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // État d'erreur
  const authRole = localStorage.getItem('authRole'); // Récupération du rôle de l'utilisateur
  const navigate = useNavigate();
  // Récupération des détails de la demande
  useEffect(() => {
    const fetchDemandeDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const demandeResponse = await fetch(`http://localhost:8080/api/v1/${authRole}/demande/detail/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (demandeResponse.ok) {
          const demandeData = await demandeResponse.json();
          setDemande(demandeData);
        } else {
          setError('Erreur lors de la récupération des détails de la demande');
        }
      } catch (error) {
        setError('Erreur réseau ou problème de serveur');
      }
      setLoading(false); // Fin du chargement
    };

    fetchDemandeDetails();
  }, [id, authRole]);

  // Récupération des ressources après avoir récupéré les détails de la demande
  useEffect(() => {
    const fetchRessources = async () => {
      if (demande && demande.travaux && demande.travaux.id) {
        try {
          const token = localStorage.getItem('authToken');
          const ressourceResponse = await fetch(`http://localhost:8080/api/v1/${authRole}/ressource/travaux/${demande.travaux.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (ressourceResponse.ok) {
            const ressourceData = await ressourceResponse.json();
            setRessources(ressourceData);
            console.log(
              "demande:" ,ressourceData
            ) // Mettre à jour la liste des ressources
          } else {
            setError('Erreur lors de la récupération des ressources associées');
          }
        } catch (error) {
          setError('Erreur réseau ou problème de serveur');
        }
      }
    };

    fetchRessources();
  }, [demande, authRole]); // Le hook s'exécute à nouveau lorsque `demande` change

  if (loading) {
    return <p>Chargement des détails du travail...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col xl="8">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Détail des Travaux</h3>
              </CardHeader>
              <CardBody>
                <Row className="justify-content-center">
                  <Col lg="5" className="text-center">
                    <h5>Service</h5>
                    <p>{demande.service.nom}</p>
                    <h5>Motif</h5>
                    <p>{demande.motif}</p>
                    <h5>Date de début</h5>
                    <p>{new Date(demande.planification.dateDebut).toLocaleDateString()}</p>
                    <h5>Date de fin</h5>
                    <p>{new Date(demande.planification.dateFin).toLocaleDateString()}</p>
                    <h5>Prix total des Travaux</h5>
                    <p>{demande.travaux.total} Ar</p>
                  </Col>
                </Row>

               
                <hr className="my-4" />
                <Row className="justify-content-center">
                  <Col lg="8">
                    <h4>Liste des Ressources</h4>
                    {ressources.length > 0 ? (
                      <ul>
                        {ressources.map((ressource) => (
                          <li key={ressource.id}>
                            <h4>{ressource.ressource.nom} :</h4>
                             <p>Quantité : {ressource.quantite}</p> 
                             <p>Prix unitaire : {ressource.ressource.valeurUnitaire} Ar</p> 
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Aucune ressource disponible pour ce travail.</p>
                    )}
                  </Col>
                </Row>
                <hr className="my-4" />
                {demande.statut.id===10 &&(
                
                  <Row className="justify-content-center">
                    <Col lg="8">
                      <div class="alert alert-warning" role="alert">
                          <span class="alert-icon"><i class="ni ni-bold-down"></i></span>
                          <span class="alert-text"><strong>!Reclamation sur les travaux</strong> </span>
                      </div>
                      <h4><i class="ni ni-bold-right">{demande.reclamations[demande.reclamations.length-1].motif}</i></h4>
                      <div className="text-center mt-4">
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
                
                <div className="text-center mt-4">
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
