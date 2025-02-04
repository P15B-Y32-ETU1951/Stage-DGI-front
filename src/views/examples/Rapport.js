import Header from 'components/Headers/Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactDatetime from 'react-datetime';
import { Button, Card, CardHeader, Container, Row, Table, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Media, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Col, CardBody, Input } from 'reactstrap';

const Rapport = () => {
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
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        setDemandes(data);
        setFilteredDemandes(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/auth/services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
      }
    };

    fetchDemandes();
    fetchServices();
  }, []);

  const filterDemandes = () => {
    let filtered = demandes;
  
    if (startDate && endDate) {
      // Ajout d'un jour à la date de fin
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
  
      filtered = filtered.filter(demande => {
        const dateDebut = new Date(demande.planification.dateDebut);
        const dateFin = new Date(demande.planification.dateFin);
        return dateDebut >= startDate && dateFin < adjustedEndDate;
      });
    }
  
    if (selectedService) {
      filtered = filtered.filter(demande => demande.service.nom === selectedService);
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

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col md="6">
            <Card className="mb-4 shadow-sm bg-secondary">
              <CardHeader className="bg-default">
                <h5 className="mb-0 text-white">Filtrer entre deux dates</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <h5>Date de début</h5>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-calendar-grid-58" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <ReactDatetime
                          inputProps={{ placeholder: "Sélectionnez la date de début" }}
                          timeFormat={false}
                          onChange={setStartDate}
                          value={startDate}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <h5>Date de fin</h5>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-calendar-grid-58" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <ReactDatetime
                          inputProps={{ placeholder: "Sélectionnez la date de fin" }}
                          timeFormat={false}
                          onChange={setEndDate}
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
            <Card className="mb-4 shadow-sm bg-secondary">
              <CardHeader className="bg-default">
                <h5 className="mb-0 text-white">Filtrer par service</h5>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <h5>Service</h5>
                  <Input type="select" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                    <option value="">Tous les services</option>
                    {services.map(service => (
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
                <h3 className="mb-0 text-white">Rapports des Travaux</h3>
              </CardHeader>
              <Table className="align-items-center table-dark table-flush" responsive>
                <thead className="thead-dark">
                  <tr>
                    <th>Service demandeur</th>
                    <th>Motif</th>
                    <th>Date de début</th>
                    <th>Date de fin</th>
                    <th>Rapport</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDemandes.length > 0 ? (
                    filteredDemandes.map(demande => (
                      <tr key={demande.id}>
                        <td>{demande.service.nom}</td>
                        <td>{demande.motif}</td>
                        <td>{demande.planification.dateDebut}</td>
                        <td>{demande.planification.dateFin}</td>
                        <td>
                        {!demande.rapport ? (
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => navigate(`/DPR_SAF/Rapport/upload/${demande.id}`)}
                          >
                            <i className="ni ni-cloud-download-95" />  Importer le rapport
                          </button>
                        ) : (
                          <button
                          className="btn btn-sm btn-success"
                          
                            onClick={() =>
                              navigate(`/DPR_SAF/Document/${demande.id}`)
                            }
                          >
                          <i className="ni ni-cloud-upload-96" /> Consulter le rapport
                          </button>
                        )}
                      </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">Aucun rapport trouvé</td>
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

export default Rapport;
