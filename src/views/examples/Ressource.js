import Header from 'components/Headers/Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, Card, CardHeader, Container, Row, Table, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Media, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';

const Ressource = () => {
  const [ressources, setRessources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRessources, setFilteredRessources] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRessources = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const authRole = localStorage.getItem('authRole');
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/ressource`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        setRessources(data);
        setFilteredRessources(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des ressources:', error);
      }
    };

    fetchRessources();
  }, []);

  useEffect(() => {
    const filtered = ressources.filter(ressource => 
      ressource.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRessources(filtered);
  }, [searchTerm, ressources]);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <div className="col">
            <Card className="shadow bg-default">
              <CardHeader className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0 text-white">Ressources</h3>
                <InputGroup style={{ maxWidth: '400px', width: '100%' }}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-zoom-split-in" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="text"
                    placeholder="Rechercher des ressources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </CardHeader>

              <Table className="align-items-center table-dark table-flush" responsive>
                <thead className="thead-dark">
                  <tr>
                    <th>Nom</th>
                    <th>Quantité disponible</th>
                    <th>Prix unitaire</th>
                    <th>
                      <Button
                        className="btn-icon btn-2"
                        color="info"
                        type="button"
                        onClick={() => navigate('/DPR_SAF/ressource/ajouter')}
                      >
                        <span className="btn-inner--icon">
                          <i className="ni ni-fat-add" />
                        </span>
                        <span className="btn-inner--text">Ajouter des Ressources</span>
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRessources.length > 0 ? (
                    filteredRessources.map((ressource) => (
                      <tr key={ressource.id}>
                        <th scope="row">
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">{ressource.nom}</span>
                            </Media>
                          </Media>
                        </th>
                        <td>{ressource.quantite}</td>
                        <td>{ressource.valeurUnitaire.toLocaleString('en-US')}</td>
                        <td>
                          <Button
                            className="btn btn-sm btn-success"
                            onClick={() => navigate(`/DPR_SAF/ressource/approvisionner/${ressource.id}`)}
                          >
                            <i className="ni ni-fat-add" /> Approvisionner
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">Aucune ressource à afficher</td>
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

export default Ressource;
