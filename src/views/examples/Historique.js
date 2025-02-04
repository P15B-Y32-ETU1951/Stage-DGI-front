import Header from 'components/Headers/Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactDatetime from 'react-datetime';
import { Badge, Button, Card, CardHeader, Container, DropdownItem, DropdownMenu, DropdownToggle, Media, Row, Table, UncontrolledDropdown, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Col, CardBody, Input } from 'reactstrap';

const Historique = () => {
  const [demandes, setDemandes] = useState([]);
  const [filteredDemandes, setFilteredDemandes] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedService, setSelectedService] = useState(""); 
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const authRole = localStorage.getItem('authRole');
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/demande/9`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        setDemandes(data);
        setFilteredDemandes(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    };

    fetchDemandes();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/auth/services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
      }
    };

    fetchServices();
  }, []);

  const filterDemandes = () => {
    let filtered = demandes;
  
    if (startDate && endDate) {
      filtered = filtered.filter((demande) => {
        const dateDebut = new Date(demande.planification.dateDebut);
        const dateFin = new Date(demande.planification.dateFin);
        
        return dateDebut >=startDate  && dateFin <= endDate; // Vérifie si la période chevauche
      });
    }
  
    if (selectedService) {
      filtered = filtered.filter((demande) => demande.service.nom === selectedService);
    }
  
    setFilteredDemandes(filtered);
  };
  

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedService("");
    setFilteredDemandes(demandes);
  };

  useEffect(() => {
    filterDemandes();
  }, [startDate, endDate, selectedService, demandes]);

  const sortByDateAsc = () => {
    const sortedDemandes = [...filteredDemandes].sort((a, b) => new Date(a.date) - new Date(b.date));
    setFilteredDemandes(sortedDemandes);
  };

  const sortByDateDesc = () => {
    const sortedDemandes = [...filteredDemandes].sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredDemandes(sortedDemandes);
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col md="6">
            {/* Carte pour les dates de planification */}
            <Card className="mb-4 shadow-sm bg-secondary">
              <CardHeader className="bg-default">
                <h5 className="mb-0 text-white">Filtrer entre deux dates</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <h5>Date de début</h5>
                      <InputGroup className="input-group-alternative" style={{ width: '100%' }}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-calendar-grid-58" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <ReactDatetime
                          inputProps={{ placeholder: "Sélectionnez la date de début" }}
                          timeFormat={false}
                          onChange={(date) => setStartDate(date)}
                          value={startDate}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <h5>Date de fin</h5>
                      <InputGroup className="input-group-alternative" style={{ width: '100%' }}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-calendar-grid-58" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <ReactDatetime
                          inputProps={{ placeholder: "Sélectionnez la date de fin" }}
                          timeFormat={false}
                          onChange={(date) => setEndDate(date)}
                          value={endDate}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md="6">
            {/* Carte pour le filtre de service */}
            <Card className="mb-4 shadow-sm bg-secondary">
              <CardHeader className="bg-default">
                <h5 className="mb-0 text-white">Filtrer par service</h5>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <h5>Service</h5>
                  <Input
                    type="select"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="">Tous les services</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.nom}>{service.nom}</option>
                    ))}
                  </Input>
                </FormGroup>
                <Button color="warning" onClick={resetFilters}>Réinitialiser les filtres</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <Card className="shadow bg-default">
              <CardHeader className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0 text-white">Travaux clôturés</h3>
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
                    <th scope="col">Date de début</th>
                    <th scope="col">Date de fin</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {filteredDemandes.length > 0 ? (
                    filteredDemandes.map((demande) => (
                      <tr key={demande.id}>
                        <th scope="row">
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">{demande.service.nom}</span>
                            </Media>
                          </Media>
                        </th>
                        <td>{demande.motif}</td>
                        <td>{demande.planification.dateDebut}</td>
                        <td>{demande.planification.dateFin}</td>
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle className="btn-icon-only text-light" href="#pablo" role="button" size="sm" color="" onClick={(e) => e.preventDefault()}>
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem onClick={() => navigate(`/DPR_SAF/Planification/travaux/${demande.id}`)}>
                                Détail
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">Aucun travaux réceptionné</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Historique;
