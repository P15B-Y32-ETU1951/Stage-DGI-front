import Header from 'components/Headers/Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Badge, Button, Card, CardHeader, Container, DropdownItem, DropdownMenu, DropdownToggle, Media, Progress, Row, Table, UncontrolledDropdown } from 'reactstrap';

const Suivi = () => {
  const [demandes, setDemandes] = useState([]); // Toutes les demandes
  const [filteredDemandes, setFilteredDemandes] = useState([]); // Demandes filtrées
  const [statuts, setStatuts] = useState([]); // Liste des statuts
  const [selectedStatut, setSelectedStatut] = useState(''); // Statut sélectionné pour le filtrage
  const navigate = useNavigate();
  const authRole = localStorage.getItem('authRole');

  // Fonction pour récupérer les demandes
  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/demande/user`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setDemandes(data);
        setFilteredDemandes(data); // Initialiser les demandes filtrées
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    };

    fetchDemandes();
  }, [authRole]);

  // Fonction pour récupérer les statuts
  useEffect(() => {
    const fetchStatuts = async () => {
      const authToken = localStorage.getItem('authToken');
      try {
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/statut/all`,{
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setStatuts(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statuts:', error);
      }
    };

    fetchStatuts();
  }, [authRole]);

  // Fonction pour filtrer par statut
  const handleStatutChange = (e) => {
    const statutId = e.target.value;
    setSelectedStatut(statutId);

    if (statutId === '') {
      setFilteredDemandes(demandes); // Pas de filtre, afficher toutes les demandes
    } else {
      setFilteredDemandes(demandes.filter((demande) => demande.statut.id === parseInt(statutId, 10)));
    }
  };

  // Tri des demandes par date croissante
  const sortByDateAsc = () => {
    const sorted = [...filteredDemandes].sort((a, b) => new Date(a.date) - new Date(b.date));
    setFilteredDemandes(sorted);
  };

  // Tri des demandes par date décroissante
  const sortByDateDesc = () => {
    const sorted = [...filteredDemandes].sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredDemandes(sorted);
  };

  // Calcul de la progression
  const calculateProgress = (dateDebut, dateFin) => {
    const now = new Date();
    const start = new Date(dateDebut);
    const end = new Date(dateFin);

    const totalTime = end - start;
    const timePassed = now - start;

    const progress = Math.min((timePassed / totalTime) * 100, 100);
    return Math.max(progress, 0);
  };

  // Couleur de la barre de progression
  const getProgressBarColor = (progress) => {
    if (progress < 50) return 'bg-danger';
    if (progress < 75) return 'bg-warning';
    return 'bg-success';
  };

  // Couleur du statut
  const getStatusColor = (statutId) => {
    switch (statutId) {
      case 1:
        return 'bg-secondary';
      case 2:
        return 'bg-primary';
      case 3:
        return 'bg-success';
      case 5:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <div className="col">
            <Card className="shadow bg-default">
              <CardHeader className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0 text-white">Demandes Envoyées</h3>
                <div>
                  <select
                    className="form-control form-control-sm"
                    value={selectedStatut}
                    onChange={handleStatutChange}
                  >
                    <option value="">Tous les statuts</option>
                    {statuts.map((statut) => (
                      <option key={statut.id} value={statut.id}>
                        {statut.description}
                      </option>
                    ))}
                  </select>
                </div>
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
                    <th scope="col">Motif</th>
                    <th scope="col">Etat</th>
                    <th scope="col">Date d'envoi</th>
                    <th scope="col">Avancement</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {filteredDemandes.length > 0 ? (
                    filteredDemandes.map((demande) => (
                      <tr key={demande.id}>
                        <td>{demande.motif}</td>
                        <td>
                          <Badge color="" className="mr-4 badge-dot">
                            <i className={getStatusColor(demande.statut.id)} /> {demande.statut.description}
                          </Badge>
                        </td>
                        <td>{new Date(demande.date).toLocaleDateString()}</td>
                        <td>
                          {demande.statut.id === 7 && (
                            <div className="d-flex align-items-center">
                              <span className="mr-2">{Math.round(calculateProgress(demande.planification.dateDebut, demande.planification.dateFin))}%</span>
                              <div style={{ width: '100%' }}>
                                <Progress
                                  max="100"
                                  value={calculateProgress(demande.planification.dateDebut, demande.planification.dateFin)}
                                  barClassName={getProgressBarColor(calculateProgress(demande.planification.dateDebut, demande.planification.dateFin))}
                                />
                              </div>
                            </div>
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
                              <DropdownItem onClick={() => navigate(`/AGENT/demande/detail/${demande.id}`)}>
                                Détail de la demande
                              </DropdownItem>
                              {demande.statut.id >= 6 && (
                                <DropdownItem onClick={() => navigate(`/${authRole}/Planification/travaux/${demande.id}`)}>
                                  Détail des travaux
                                </DropdownItem>
                              )}
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">Aucune demande à afficher</td>
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

export default Suivi;
