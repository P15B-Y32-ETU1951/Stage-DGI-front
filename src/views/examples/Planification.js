import React, { useEffect, useState } from 'react';
import Header from 'components/Headers/Header';
import { Container, Row, Card, CardHeader, Badge, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, CardBody, Col } from 'reactstrap';
import ReactDatetime from 'react-datetime';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

const Planification = () => {
  const { id } = useParams();
  const [ressources, setRessources] = useState([]);
  const [selectedRessources, setSelectedRessources] = useState([]);
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const authRole = localStorage.getItem('authRole');
  const authToken = localStorage.getItem('authToken');
  const navigate = useNavigate();

  // Fetch des ressources depuis l'API
  useEffect(() => {
    const fetchRessources = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/ressource/dispo`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        setRessources(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des ressources:', error);
      }
    };

    fetchRessources();
  }, [authRole]);

  const handleSelectRessource = (ressource) => {
    const alreadySelected = selectedRessources.find((r) => r.id === ressource.id);
    if (!alreadySelected) {
      setSelectedRessources([...selectedRessources, { ...ressource, quantite: 1 }]);
    }
  };

  const handleRemoveRessource = (ressourceToRemove) => {
    setSelectedRessources(selectedRessources.filter((r) => r.id !== ressourceToRemove.id));
  };

  const handleQuantiteChange = (ressourceId, quantite) => {
    setSelectedRessources(selectedRessources.map((r) => {
      if (r.id === ressourceId) {
        const quantiteMax = ressources.find((res) => res.id === ressourceId).quantite;
        const quantiteValide = Math.min(parseFloat(quantite), quantiteMax);

        if (parseFloat(quantite) > quantiteMax) {
          alert(`La quantité maximale pour ${r.nom} est ${quantiteMax}`);
        }

        return { ...r, quantite: quantiteValide };
      }
      return r;
    }));
  };

  const formatDate = (date) => {
    const validDate = date instanceof Date ? date : new Date(date);
    const localDate = new Date(validDate.getTime() - (validDate.getTimezoneOffset() * 60000));
    return localDate.toISOString().split('T')[0];
  };

  const calculateTotalPrice = () => {
    return selectedRessources.reduce((total, ressource) => {
      return total + ressource.valeurUnitaire * ressource.quantite;
    }, 0);
  };

  const handleSubmit = async () => {
    if (!dateDebut || !dateFin) {
      alert("Veuillez sélectionner les dates de début et de fin.");
      return;
    }

    const ressourcesPlanifiees = selectedRessources.map((ressource) => ({
      id_ressource: ressource.id,
      quantite: ressource.quantite,
    }));
// 
    const jsonData = {
      id_demande: id,
      dateDebut: formatDate(dateDebut),
      dateFin: formatDate(dateFin),
      ressources: ressourcesPlanifiees,
      total: calculateTotalPrice()
    };

    try {
      const response = await fetch(`http://localhost:8080/api/v1/${authRole}/planification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(jsonData)
      });

      if (response.ok) {
        const data = await response.json();
        alert('Planification envoyée avec succès !');
        console.log(data);
      } else {
        alert('Une erreur est survenue lors de la planification');
        console.error('Erreur:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la planification:', error);
    }

    const data = { "statut": 6, "id_demande": id };

    try {
      const response = await fetch(`http://localhost:8080/api/v1/${authRole}/demande/statut`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Demande planifiée avec succès');
        navigate(`/${authRole}/Planification/travaux`);
      } else {
        console.error('Erreur lors de l\'envoi de la demande:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  };

  const validDateDebut = (current) => {
    return current.isSameOrAfter(moment(), 'day');
  };

  const validDateFin = (current) => {
    return dateDebut ? current.isSameOrAfter(moment(dateDebut), 'day') : false;
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col md="6">
            {/* Carte pour les dates de planification */}
            <Card className="mb-4 shadow-sm bg-secondary">
              <CardHeader className="bg-default text white">
                <h5 className="mb-0">Dates de Planification :</h5>
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
                          isValidDate={validDateDebut}
                          onChange={(date) => setDateDebut(date)}
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
                          isValidDate={validDateFin}
                          onChange={(date) => setDateFin(date)}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          <Col md="6">
            {/* Sélecteur de ressources avec une carte */}
            <Card className="mb-4 shadow-sm bg-secondary">
              <CardHeader className="bg-info">
                <h5 className="mb-0">Sélectionner des ressources :</h5>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <select
                    className="form-control"
                    style={{ width: '100%', borderRadius: '10px' }}
                    multiple
                    onChange={(e) => handleSelectRessource(JSON.parse(e.target.value))}
                  >
                    <option disabled value="">
                      -- Ressource -- Quantité
                    </option>
                    {ressources.map((ressource) => (
                      <option key={ressource.id} value={JSON.stringify(ressource)}>
                        {ressource.nom} - ({ressource.quantite})
                      </option>
                    ))}
                  </select>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <hr className="my-4" />

        {/* Affichage des ressources sélectionnées */}
        <Card className="mb-4 shadow-sm bg-secondary">
          <CardHeader className="bg-info">
            <h5 className="mb-0">Ressources sélectionnées :</h5>
          </CardHeader>
          <CardBody>
            {selectedRessources.length > 0 ? (
              selectedRessources.map((ressource) => (
                <div key={ressource.id} className="mb-2">
                  <Badge
                    color="info"
                    pill
                    className="mr-2"
                    onClick={() => handleRemoveRessource(ressource)}
                  >
                    {ressource.nom} <i className="ml-2 fas fa-times" />
                  </Badge>
                  <input
                    type="number"
                    min="1"
                    value={ressource.quantite}
                    onChange={(e) => handleQuantiteChange(ressource.id, e.target.value)}
                    className="form-control d-inline-block"
                    style={{ width: '85px', height: '25px' }}
                  />
                </div>
              ))
            ) : (
              <p>Aucune ressource sélectionnée</p>
            )}
          </CardBody>
        </Card>

        {/* Bouton de validation */}
        <div className="p-3">
          <Button color="info" onClick={handleSubmit}>
            Valider
          </Button>
        </div>
      </Container>
    </>
  );
};

export default Planification;
