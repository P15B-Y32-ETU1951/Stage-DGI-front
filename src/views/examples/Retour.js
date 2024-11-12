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

const Retour = () => {
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
            setRessources(ressourceData); // Mettre à jour la liste des ressources
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

  const handleSubmit = async (id) => {
    
   

    // Récupérer les valeurs du localStorage
    const service = localStorage.getItem('authService');
    const utilisateurId = localStorage.getItem('authId');
    const authToken = localStorage.getItem('authToken');
    const role = localStorage.getItem('authRole');


    if (!service || !utilisateurId) {
        console.error("Service ou utilisateur non trouvé dans le localStorage");
        return;
    }

    // Reformatage de la date au format YYYY-MM-DD
   
    const data = {
        "statut":9,
        "id_demande":id
    }
   
    // Créer un objet avec les valeurs de l'état

    // Envoyer la requête POST à l'URL appropriée
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
            navigate(`/${role}/index`);
            // Reset des champs du formulaire
        } else {
            console.error('Erreur lors de l\'envoi de la demande:',response.statusText );
           
        }
    } catch (error) {
        console.error('Erreur réseau:', error);
    }

    
};


  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col xl="8">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                   
                    <Button color="success" onClick={() => handleSubmit(id)}>
                    Clôturer les travaux
                    </Button>
                  
                    <Button color="info" onClick={() =>navigate(`/${authRole}/demande/retour/reclamation/${demande.id}`)}>
                        Envoyer des réclamations
                    </Button>
                   
                </Row>
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

export default Retour;
