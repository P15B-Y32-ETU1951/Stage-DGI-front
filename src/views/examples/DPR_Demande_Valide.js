import Header from 'components/Headers/Header';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate si vous utilisez React Router v6
import { useEffect, useState } from 'react';
import { Badge, Button, Card, CardHeader, Container, DropdownItem, DropdownMenu, DropdownToggle, Media, Row, Table, UncontrolledDropdown } from 'reactstrap';
import DemandeHeader from 'components/Headers/DemandeHeader';

const DPR_Demande_Valide = () => {
  const [demandes, setDemandes] = useState([]);
  const navigate = useNavigate(); // Utilisation du hook useNavigate

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const authRole = localStorage.getItem('authRole');
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/demande/4`, {
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

  const MAX_DESCRIPTION_LENGTH = 15;
  const sortByDateAsc = () => {
    const sortedDemandes = [...demandes].sort((a, b) => new Date(a.date) - new Date(b.date));
    setDemandes(sortedDemandes);
  };

  // Fonction pour trier les demandes par date (décroissant)
  const sortByDateDesc = () => {
    const sortedDemandes = [...demandes].sort((a, b) => new Date(b.date) - new Date(a.date));
    setDemandes(sortedDemandes);
  };

  return (
    <>
      <DemandeHeader />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <div className="col">
            <Card className="shadow bg-default">
              <CardHeader className="bg-transparent border-0 d-flex justify-content-between align-items-center">
              <h3 className="mb-0 text-white"> Demandes validées</h3>
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
                    <th scope="col">Service demandeur</th>
                    <th scope="col">Motif</th>
                    <th scope="col">Description</th>
                    <th scope="col">Date d'envoi</th>
                    <th scope="col">Date de validation</th>
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
                                {demande.service.nom} 
                              </span>
                            </Media>
                          </Media>
                        </th>
                        <td>{demande.motif}</td>
                        <td>
                          {demande.description.length > MAX_DESCRIPTION_LENGTH
                            ? `${demande.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
                            : demande.description}
                        </td>
                        <td>{new Date(demande.date).toLocaleDateString()}</td>
                        <td>{new Date(demande.statutDemandes[demande.statutDemandes.length - 1].date_changement).toLocaleDateString()}</td>
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
                               onClick={() => navigate(`/DPR_SAF/demande/detail/${demande.id}/n_b`)}>
                                Detail
                              </DropdownItem>
                              <DropdownItem
                               onClick={() => navigate(`/DPR_SAF/Planification/${demande.id}`)}>
                                Planifier
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

export default DPR_Demande_Valide;
