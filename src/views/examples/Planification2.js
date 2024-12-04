import React, { useEffect, useState } from 'react';
import Header from 'components/Headers/Header';
import { Container, Row, Card, CardHeader, Badge, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, CardBody, Col, Alert, Toast, Modal } from 'reactstrap';
import ReactDatetime from 'react-datetime';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

const Planification2 = () => {
  const { id } = useParams();
  const [ressources, setRessources] = useState([]);
  const [etapes, setEtapes] = useState([]);
  const [nomEtape, setNomEtape] = useState('');
  const [dateDebutEtape, setDateDebutEtape] = useState('');
  const [dateFinEtape, setDateFinEtape] = useState('');
  const authRole = localStorage.getItem('authRole');
  const authToken = localStorage.getItem('authToken');
  const navigate = useNavigate();

  // Ajouter une étape
  const handleAddEtape = () => {
    if (!nomEtape || !dateDebutEtape || !dateFinEtape) {
      alert('Veuillez remplir tous les champs pour ajouter une étape.');
      return;
    }

    const newEtape = {
      nom: nomEtape,
      dateDebut: dateDebutEtape,
      dateFin: dateFinEtape,
      ressources: [] // Ressources spécifiques à cette étape
    };
    setEtapes([...etapes, newEtape]);
    setNomEtape('');
    setDateDebutEtape('');
    setDateFinEtape('');
  };

  // Supprimer une étape
  const handleRemoveEtape = (index) => {
    const updatedEtapes = etapes.filter((_, idx) => idx !== index);
    setEtapes(updatedEtapes);
  };

  // Assigner une ressource à une étape
  const handleAddRessourceToEtape = (etapeIndex, ressource) => {
    setEtapes((prevEtapes) =>
      prevEtapes.map((etape, index) =>
        index === etapeIndex
          ? {
              ...etape,
              ressources: [
                ...etape.ressources,
                { ...ressource, quantite: 0 } // Ajouter avec une quantité par défaut
              ]
            }
          : etape
      )
    );
  };

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
  

  // Modifier la quantité d'une ressource dans une étape
  const handleQuantiteChange = (etapeIndex, ressourceId, quantite) => {
    setEtapes((prevEtapes) =>
      prevEtapes.map((etape, index) => {
        if (index === etapeIndex) {
          return {
            ...etape,
            ressources: etape.ressources.map((r) =>
              r.id === ressourceId ? { ...r, quantite: parseInt(quantite) || 1 } : r
            )
          };
        }
        return etape;
      })
    );
  };

  // Récupérer les ressources disponibles depuis l'API
  useEffect(() => {
    const fetchRessources = async () => {
      try {
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

  // Soumission de la planification
  const handleSubmit = async () => {
    const etapesPlanifiees = etapes.map((etape) => ({
      nom: etape.nom,
      dateDebut: etape.dateDebut,
      dateFin: etape.dateFin,
      ressources: etape.ressources.map((ressource) => ({
        id: ressource.id,
        quantite: ressource.quantite
      }))
    }));

    const jsonData = {
      id_demande: id,
      etapes: etapesPlanifiees
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
        alert('Planification envoyée avec succès !');
        navigate(`/${authRole}/Planification/travaux`);
      } else {
        alert('Erreur lors de la planification');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    }
  };
  const validDateDebut = (current) => {
    return current.isSameOrAfter(moment(), 'day');
  };

  const validDateFin = (current) => {
    return dateDebutEtape ? current.isSameOrAfter(moment(dateDebutEtape), 'day') : false;
  };
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        {/* Ajouter une étape */}
        <Row className="mt-5">
          <Col md="6">
            <Card className="mb-4 shadow-sm bg-secondary">
              <CardHeader className="bg-info">
                <h5 className="mb-0">Ajouter les Travaux :</h5>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <h5>Nom des travaux</h5>
                  <input
                    type="text"
                    placeholder="Nom de l'étape"
                    value={nomEtape}
                    onChange={(e) => setNomEtape(e.target.value)}
                    className="form-control"
                  />
                </FormGroup>
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
        </Row>

        {/* Afficher les étapes */}
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

                  {/* Ajouter des ressources */}
                  <FormGroup>
                  <select
                    className="form-control"
                    style={{ width: '100%', borderRadius: '10px' }}
                    multiple
                    onChange={(e) => handleAddRessourceToEtape(index,JSON.parse(e.target.value))}
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

                  {/* Afficher les ressources */}
                 
                  <ul>

                    {etape.ressources.map((r) => (
                      <li key={r.id}>
                        <Col md="6">
                         <Badge
                    color="info"
                    pill
                    className="mr-2"
                    onClick={() => handleRemoveRessourceFromEtape(index,r.id)}
                  >
                    {r.nom} <i className="ml-2 fas fa-times" />
                  </Badge>
                        </Col>
                        <Col md="6">
                        <input
                          type="number"
                          min="1"
                          value={r.quantite}
                          onChange={(e) =>
                            handleQuantiteChange(index, r.id, e.target.value)
                            
                          }
                          style={{ width: '85px', height: '25px' }}
                        />
                        </Col>
                      </li>
                    ))}
                  </ul>
                  
                </CardBody>
              </Card>
            ))}
          </Col>
        </Row>

        {/* Soumission */}
        <Button color="info" onClick={handleSubmit}>
          Soumettre la planification
        </Button>
      </Container>
    </>
  );
};

export default Planification2;
