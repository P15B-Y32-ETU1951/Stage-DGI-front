import Header from 'components/Headers/Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Badge, Button, Card, CardHeader, Container, DropdownItem, DropdownMenu, DropdownToggle, Media, Row, Table, UncontrolledDropdown } from 'reactstrap';

const Valider = () => {
  const [demandes, setDemandes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const authRole = localStorage.getItem('authRole');
        const response = await fetch(`http://192.168.88.18:8080/api/v1/${authRole}/demande/1`, {
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

  const sortByDateAsc = () => {
    const sortedDemandes = [...demandes].sort((a, b) => new Date(a.date) - new Date(b.date));
    setDemandes(sortedDemandes);
  };

  // Fonction pour trier les demandes par date (décroissant)
  const sortByDateDesc = () => {
    const sortedDemandes = [...demandes].sort((a, b) => new Date(b.date) - new Date(a.date));
    setDemandes(sortedDemandes);
  };

  const MAX_DESCRIPTION_LENGTH = 15; // Définit la longueur maximale de l'extrait

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <div className="col">
            <Card className="bg-default shadow">
            <CardHeader className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h3 className="text-white mb-0">Demandes à valider</h3>
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
                    <th scope="col">Nom du demandeur</th>
                    <th scope="col">Motif</th>
                    <th scope="col">Description</th> {/* Ajout de la colonne description */}
                    <th scope="col">Date d'envoi</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {demandes.length > 0 ? (
                    demandes.map((demande) => (
                      <tr key={demande.id}>
                        <th scope="row">
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">
                                {demande.utilisateur.nom} {demande.utilisateur.prenom}
                              </span>
                            </Media>
                          </Media>
                        </th>
                        <td>{demande.motif}</td>
                        <td>
                          {demande.description.length > MAX_DESCRIPTION_LENGTH
                            ? `${demande.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
                            : demande.description}
                        </td> {/* Affichage abrégé de la description */}
                        <td>{new Date(demande.date).toLocaleDateString()}</td>
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
                               onClick={() => navigate(`/CHEF_SERVICE/demande/detail/${demande.id}`)}>
                                Detail
                              </DropdownItem>
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

export default Valider;
