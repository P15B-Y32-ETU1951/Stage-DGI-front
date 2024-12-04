import React, { useEffect, useState } from 'react';
import Header from 'components/Headers/Header';
import { Container, Row, Card, CardHeader, Badge, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, CardBody, Col } from 'reactstrap';
import ReactDatetime from 'react-datetime';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

const Reouverture2 = () => {
  const { id } = useParams();
  const [ressources, setRessources] = useState([]);
  const [etapes, setEtapes] = useState([]);
  const [selectedRessources, setSelectedRessources] = useState([]);
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const authRole = localStorage.getItem('authRole');
  const authToken = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const [nomEtape, setNomEtape] = useState('');
  const [dateDebutEtape, setDateDebutEtape] = useState('');
  const [dateFinEtape, setDateFinEtape] = useState('');

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

  const updatePlanificationDates = () => {
    if (etapes.length === 0) {
      setDateDebut(null);
      setDateFin(null);
      return;
    }
  
    const debut = etapes.reduce(
      (minDate, etape) => (new Date(etape.dateDebut) < new Date(minDate) ? etape.dateDebut : minDate),
      etapes[0].dateDebut
    );
  
    const fin = etapes.reduce(
      (maxDate, etape) => (new Date(etape.dateFin) > new Date(maxDate) ? etape.dateFin : maxDate),
      etapes[0].dateFin
    );
  
    setDateDebut(debut);
    setDateFin(fin);
  };

  useEffect(() => {
    updatePlanificationDates();
  }, [etapes]);
  
  const calculateTotalForEtape = (ressources) => {
    return ressources.reduce((total, ressource) => {
      return total + (ressource.valeurUnitaire || 0) * (ressource.quantite || 0);
    }, 0);
  };
  
  const handleAddEtape = () => {
    if (!nomEtape || !dateDebutEtape || !dateFinEtape) {
      alert('Veuillez remplir tous les champs pour ajouter une étape.');
      return;
    }
  
    const newEtape = {
      nom: nomEtape,
      dateDebut: dateDebutEtape,
      dateFin: dateFinEtape,
      ressources: [],
      total: 0
    };
  
    setEtapes((prevEtapes) => [...prevEtapes, newEtape]);
    setNomEtape('');
    setDateDebutEtape('');
    setDateFinEtape('');
  };
  
  const handleRemoveEtape = (index) => {
    setEtapes((prevEtapes) => {
      const updatedEtapes = prevEtapes.filter((_, idx) => idx !== index);
      return updatedEtapes;
    });
  };
  

 
  // Assigner une ressource à une étape
 
  

  const handleRemoveRessourceFromEtape = (etapeIndex, ressourceId) => {
    setEtapes((prevEtapes) =>
      prevEtapes.map((etape, index) =>
        index === etapeIndex
          ? {
              ...etape,
              ressources: etape.ressources.filter((r) => r.id !== ressourceId)
            }
          : etape
      )
    );
  };

  const handleQuantiteChange = (ressourceId, quantite) => {
    setSelectedRessources((prevRessources) =>
      prevRessources.map((r) => {
        if (r.id === ressourceId) {
          const quantiteMax = ressources.find((res) => res.id === ressourceId).quantite;
          const quantiteValide = Math.min(parseFloat(quantite), quantiteMax);
  
          if (parseFloat(quantite) > quantiteMax) {
            alert(`La quantité maximale pour ${r.nom} est ${quantiteMax}`);
          }
  
          return { ...r, quantite: quantiteValide };
        }
        return r;
      })
    );
  
    // Recalculer le total de chaque étape utilisant cette ressource
    setEtapes((prevEtapes) =>
      prevEtapes.map((etape) => ({
        ...etape,
        total: calculateTotalForEtape(etape.ressources),
      }))
    );
  };
  

  const formatDate = (date) => {
    const validDate = date instanceof Date ? date : new Date(date);
    const localDate = new Date(validDate.getTime() - (validDate.getTimezoneOffset() * 60000));
    return localDate.toISOString().split('T')[0];
  };

  const calculateTotalPrice = () => {
    return etapes.reduce((total, etape) => {
      const etapeTotal = etape.ressources.reduce((etapeSum, ressource) => {
        return etapeSum + ressource.valeurUnitaire * ressource.quantite;
      }, 0);
      return total + etapeTotal;
    }, 0);
  };
  

  const handleAssignSelectedRessourcesToEtape = (etapeIndex) => {
    if (selectedRessources.length === 0) {
      alert("Aucune ressource sélectionnée.");
      return;
    }
  
    setEtapes((prevEtapes) =>
      prevEtapes.map((etape, index) => {
        if (index === etapeIndex) {
          const newRessources = [
            ...etape.ressources,
            ...selectedRessources.filter(
              (sr) => !etape.ressources.some((er) => er.id === sr.id)
            ),
          ];
  
          return {
            ...etape,
            ressources: newRessources,
            total: calculateTotalForEtape(newRessources), // Calcul du total
          };
        }
        return etape;
      })
    );
  
    // Réinitialiser les ressources sélectionnées après assignation
    setSelectedRessources([]);
  };
  
  const handlePrint = () => {
    console.log("etapes:",etapes);
    console.log("prix",calculateTotalPrice());
    console.log("debut",formatDate(dateDebut));
    console.log("fin",formatDate(dateFin));
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
      travaux: etapes,
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
        const data = await response.json();
        alert('Réouverture envoyée avec succès !');
        console.log(data);
      } else {
        alert('Une erreur est survenue lors de la planification');
        console.error('Erreur:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la planification:', error);
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
    return dateDebutEtape ? current.isSameOrAfter(moment(dateDebutEtape), 'day') : false;
  };

  const calculateQuantiteDisponible = (ressourceId) => {
    const quantiteMax = ressources.find((res) => res.id === ressourceId)?.quantite || 0;
  
    // Somme des quantités utilisées dans toutes les étapes pour cette ressource
    const quantiteUtilisee = etapes
      .flatMap((etape) => etape.ressources)
      .filter((res) => res.id === ressourceId)
      .reduce((total, res) => total + res.quantite, 0);
  
    return quantiteMax - quantiteUtilisee;
  };
  
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col md="6">
            {/* Carte pour les dates de planification */}
            <Card className="mb-4 shadow-sm bg-secondary">
              <CardHeader className="bg-info">
                <h5 className="mb-0"> Réouverture des Travaux</h5>
              </CardHeader>
              <CardBody>
             <Row>
                <Col md="6">
                <FormGroup>
                  <h5>Etape des travaux</h5>
                  <input
                    type="text"
                    placeholder="Nom de l'étape"
                    value={nomEtape}
                    onChange={(e) => setNomEtape(e.target.value)}
                    className="form-control"
                  />
                </FormGroup>
                </Col>
                </Row>
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
                          onChange={(date) => setDateDebutEtape(date)}
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
                          onChange={(date) => setDateFinEtape(date)}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>
                <Button color="info" onClick={handleAddEtape}>
                  Ajouter
                </Button>
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
                    -- Ressource -- Quantité disponible
                    </option>
                    {ressources.map((ressource) => {
                    const quantiteDisponible = calculateQuantiteDisponible(ressource.id);
                    return (
                        <option
                        key={ressource.id}
                        value={JSON.stringify(ressource)}
                        disabled={quantiteDisponible <= 0} // Désactiver si la ressource est épuisée
                        >
                        {ressource.nom} - ({quantiteDisponible} disponible)
                        </option>
                    );
                    })}
                </select>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <hr className="my-4" />
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

        {/* Affichage des ressources sélectionnées */}
        <Row className="mt-5">
            <Col md="12">
            {etapes.map((etape, index) => (
                <Card key={index} className="mb-4 shadow-sm bg-secondary">
                    <CardHeader className="bg-info">
                    <h5 className="mb-0">{etape.nom}</h5>
                    <Button close onClick={() => handleRemoveEtape(index)} />
                    </CardHeader>
                    <CardBody>
                    <h5>Début : {moment(etape.dateDebut).format('DD/MM/YYYY')}</h5>
                    <h5>Fin : {moment(etape.dateFin).format('DD/MM/YYYY')}</h5>
                    <h5>Total : {etape.total.toFixed(2)} Ar</h5>

                    <Button
                        color="primary"
                        onClick={() => handleAssignSelectedRessourcesToEtape(index)}
                    >
                        Ajouter les ressources sélectionnées
                    </Button>

                    <ul>
                        {etape.ressources.map((ressource) => (
                        <li key={ressource.id}>
                            <Badge
                            color="info"
                            pill
                            className="mr-2"
                            onClick={() => handleRemoveRessourceFromEtape(index, ressource.id)}
                            >
                            {ressource.nom} : {ressource.quantite} 
                            <i className="ml-2 fas fa-times" />
                            </Badge>
                        </li>
                        ))}
                    </ul>
                    </CardBody>
                </Card>
                ))}

            </Col>
        </Row>


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

export default Reouverture2;
