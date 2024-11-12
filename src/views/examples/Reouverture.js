import React, { useEffect, useState } from 'react';
import Header from 'components/Headers/Header';
import { Container, Row, Card, CardHeader, Badge, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, CardBody, Col } from 'reactstrap';
import ReactDatetime from 'react-datetime';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

const Reouverture = () => {
  const { id } = useParams();
  const [ressources, setRessources] = useState([]);
  const [selectedRessources, setSelectedRessources] = useState([]);
  const [dateFin, setDateFin] = useState(null);
  const [dateDebutExistant, setDateDebutExistant] = useState(null);
  const authRole = localStorage.getItem('authRole');
  const authToken = localStorage.getItem('authToken');
  const navigate = useNavigate();

  // Récupérer les informations du travail existant et les ressources disponibles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        
        // Charger les ressources disponibles
        const ressourceResponse = await fetch(`http://localhost:8080/api/v1/${authRole}/ressource/dispo`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const ressourceData = await ressourceResponse.json();
        setRessources(ressourceData);

        // Charger les détails du travail existant
        const travailResponse = await fetch(`http://localhost:8080/api/v1/${authRole}/demande/detail/${id}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const travailData = await travailResponse.json();
        setDateDebutExistant(new Date(travailData.planification.dateDebut));
        setDateFin(new Date());

        setSelectedRessources(travailData.planification.ressources || []);

        const token = localStorage.getItem('authToken');
        
       
        console.log('Travail:', travailData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, [authRole, id]);

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
    if (!dateFin) {
      alert("Veuillez sélectionner une nouvelle date de fin.");
      return;
    }

    const ressourcesPlanifiees = selectedRessources.map((ressource) => ({
      id_ressource: ressource.id,
      quantite: ressource.quantite,
    }));

    const jsonData = {
      id_demande: id,
      dateFin: formatDate(dateFin),
      ressources: ressourcesPlanifiees,
      total: calculateTotalPrice()
    };

    try {
      const response = await fetch(`http://localhost:8080/api/v1/${authRole}/reouverture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(jsonData)
      });

      if (response.ok) {
        alert('Réouverture envoyée avec succès !');
       
      } else {
        alert('Une erreur est survenue lors de la réouverture');
        console.error('Erreur:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réouverture:', error);
    }

    const data = { "statut": 7, "id_demande": id };

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
        navigate(`/${authRole}/travaux`);
      } else {
        console.error('Erreur lors de l\'envoi de la demande:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
    
  };

  const validDateFin = (current) => {
    const today = moment().startOf('day'); // début de la journée actuelle
    // Vérifie que la date est après aujourd'hui et après dateDebutExistant, si elle existe
    return current.isSameOrAfter(today, 'day') && (!dateDebutExistant || current.isSameOrAfter(moment(dateDebutExistant), 'day'));
  };
  

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col md="6">
            {/* Afficher uniquement la nouvelle date de fin */}
            <Card className="bg-secondary shadow-sm mb-4">
              <CardHeader className="bg-info">
                <h5 className="mb-0">Réouverture : Nouvelle date de fin</h5>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <h5>Date de fin</h5>
                  <InputGroup className="input-group-alternative" style={{ width: '100%' }}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-calendar-grid-58" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <ReactDatetime
                      inputProps={{ placeholder: "Sélectionnez la nouvelle date de fin" }}
                      timeFormat={false}
                      isValidDate={validDateFin}
                      onChange={(date) => setDateFin(date)}
                      value={dateFin}
                    />
                  </InputGroup>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>

          <Col md="6">
            {/* Sélecteur de nouvelles ressources */}
            <Card className="bg-secondary shadow-sm mb-4">
              <CardHeader className="bg-info">
                <h5 className="mb-0">Ajouter des ressources</h5>
              </CardHeader>
              <CardBody>
                <FormGroup>
                    <h5> Ressources--(Quantité)</h5>
                  <select
                    className="form-control"
                    style={{ width: '100%', borderRadius: '10px' }}
                    multiple
                    onChange={(e) => handleSelectRessource(JSON.parse(e.target.value))}
                  >
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
        <Card className="bg-secondary shadow-sm mb-4">
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
                    {ressource.nom} <i className="fas fa-times ml-2" />
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
            Démarrer  la réouverture des travaux
          </Button>
        </div>
      </Container>
    </>
  );
};

export default Reouverture;
