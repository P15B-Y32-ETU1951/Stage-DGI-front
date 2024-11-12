import Header from 'components/Headers/Header';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate si vous utilisez React Router v6
import { useEffect, useState } from 'react';
import { Badge, Button, Card, CardHeader, Container, DropdownItem, DropdownMenu, DropdownToggle, Media, Progress, Row, Table, UncontrolledDropdown } from 'reactstrap';

const Suivi_Chef = () => {
  const [demandes, setDemandes] = useState([]);
  const navigate = useNavigate();
  const authRole = localStorage.getItem('authRole');

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
       
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/demande/service`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        setDemandes(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    };

    fetchDemandes();
  }, []);

  // Fonction pour trier les demandes par date (croissant)
  const sortByDateAsc = () => {
    const sortedDemandes = [...demandes].sort((a, b) => new Date(a.date) - new Date(b.date));
    setDemandes(sortedDemandes);
  };

  // Fonction pour trier les demandes par date (décroissant)
  const sortByDateDesc = () => {
    const sortedDemandes = [...demandes].sort((a, b) => new Date(b.date) - new Date(a.date));
    setDemandes(sortedDemandes);
  };

  // Fonction pour calculer le pourcentage de progression en fonction de la date de début et de fin
  const calculateProgress = (dateDebut, dateFin) => {
    const now = new Date();
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
  
    const totalTime = end - start;
    const timePassed = now - start;
  
    const progress = Math.min((timePassed / totalTime) * 100, 100);
    return Math.max(progress, 0);
  };

  // Fonction pour déterminer la couleur de la barre de progression
  const getProgressBarColor = (progress) => {
    if (progress < 50) {
      return 'bg-danger'; // Rouge
    } else if (progress < 75) {
      return 'bg-warning'; // Jaune
    } else {
      return 'bg-success'; // Vert
    }
  };

  // Fonction utilitaire pour déterminer la couleur du point en fonction de l'ID du statut
  const getStatusColor = (statutId) => {
    switch (statutId) {
      case 1:
        return 'bg-secondary'; // Statut 1 -> Gris
      case 2:
        return 'bg-primary'; // Statut 2 -> Bleu
      case 3:
        return 'bg-success'; // Statut 3 -> Vert
      case 5:
        return 'bg-danger'; // Statut 5 -> Rouge
      case 6:
        return 'bg-info';
         // Statut 6 -> Bleu clair
      case 7:
          return 'bg-success';
      case 8:
        return 'bg-info';
      case 10:
          return 'bg-yellow';
      default:
        return 'bg-secondary'; // Statut par défaut -> Gris
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <div className="col">
            <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h3 className="text-white mb-0">Demandes Envoyées</h3>
<div>
                  <Button color="info" size="sm" onClick={sortByDateAsc}>
                  <i className="ni ni-bold-up" />
                  </Button>
                  <Button color="info" size="sm" onClick={sortByDateDesc} className="ml-2">
                  <i className="ni ni-bold-down" />
                  </Button>
                </div>
              </CardHeader>
              <Table className="align-items-center table-dark table-flush" responsive>
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Expéditeur</th>
                    <th scope="col">Motif</th>
                    <th scope="col">Etat</th>
                    <th scope="col">Date d'envoi</th>
                    <th scope="col">Avancement</th> {/* Ajout d'une colonne pour l'avancement */}
                    <th scope="col" />
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {demandes.length > 0 ? (
                    demandes.map((demande) => (
                      <tr key={demande.id}>
                        <td>{demande.utilisateur.nom}</td>
                        <th scope="row">
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">
                                {demande.motif}
                              </span>
                            </Media>
                          </Media>
                        </th>
                        <td>
                          <Badge color="" className="badge-dot mr-4">
                            <i className={getStatusColor(demande.statut.id)} /> {demande.statut.description}
                          </Badge>
                        </td>
                        <td>{new Date(demande.date).toLocaleDateString()}</td>
                        <td>
                          {/* Affiche la barre de progression uniquement si le statut est égal à 7 */}
                          {demande.statut.id === 7 && (
                            <div className="d-flex align-items-center">
                              <span className="mr-2">
                                {Math.round(calculateProgress(demande.planification.dateDebut, demande.planification.dateFin))}%
                              </span>
                              <div style={{ width: '100%' }}>
                                <Progress
                                  max="100"
                                  value={calculateProgress(demande.planification.dateDebut, demande.planification.dateFin)}
                                  barClassName={getProgressBarColor(calculateProgress(demande.planification.dateDebut, demande.planification.dateFin))}
                                />
                              </div>
                            </div>
                          )}
                           { demande.statut.id === 8  && (
                          <Button color="success" size="sm"  onClick={() => navigate(`/${authRole}/demande/retour/${demande.id}`)}>
                            Envoyer vos retours 
                          </Button>
                        )}
                        </td>
                       
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              href="#pablo"
                              role="button"
                              size="sm"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem
                                onClick={() => navigate(`/${authRole}/demande/detail/${demande.id}`)}
                              >
                                Détail de la Demande
                              </DropdownItem>
                              {demande.statut.id >= 6 && (
                                <DropdownItem
                                  onClick={() => navigate(`/${authRole}/Planification/travaux/${demande.id}`)}
                                >
                                  Détail des Travaux
                                </DropdownItem>
                              )}
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">Aucune demande à afficher</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Suivi_Chef;
