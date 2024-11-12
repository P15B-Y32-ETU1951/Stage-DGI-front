import Header from 'components/Headers/Header';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate si vous utilisez React Router v6
import { useEffect, useState } from 'react';
import { Badge, Button, Card, CardHeader, Container, DropdownItem, DropdownMenu, DropdownToggle, Media, Row, Table, UncontrolledDropdown } from 'reactstrap';

const Ressource = () => {
  const [ressources, setressources] = useState([]);
  const navigate = useNavigate(); // Utilisation du hook useNavigate

  useEffect(() => {
    const fetchressources = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const authRole = localStorage.getItem('authRole');
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/ressource`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        setressources(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des ressources:', error);
      }
    };

    fetchressources();
  }, []);


  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <div className="col">
            <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-0">
                <h3 className="text-white mb-0"> Ressources </h3>
              </CardHeader>
              <Table className="align-items-center table-dark table-flush" responsive>
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Nom</th>
                    <th scope="col">quantité disponible</th>
                    <th scope="col">prix unitaire</th>
                    <th scope="col">  
                        <Button className="btn-icon btn-2" 
                        color="success" 
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
                  {ressources.length > 0 ? (
                    ressources.map((ressource) => (
                      <tr key={ressource.id}>
                        <th scope="row">
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">
                                {ressource.nom} 
                              </span>
                            </Media>
                          </Media>
                        </th>
                        <td>{ressource.quantite}</td>
                       
                        <td>{ressource.valeurUnitaire}</td>
                        
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
                               onClick={() => navigate(`/DPR_SAF/ressource/approvisionner/${ressource.id}`)}>
                                Approvisionner
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">Aucune ressource à afficher</td>
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
