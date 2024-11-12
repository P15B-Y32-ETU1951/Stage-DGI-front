import Header from 'components/Headers/Header';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate si vous utilisez React Router v6
import { useEffect, useState } from 'react';
import { Badge, Button, Card, CardHeader, Container, DropdownItem, DropdownMenu, DropdownToggle, Media, Row, Table, UncontrolledDropdown } from 'reactstrap';

const Travaux_Planifie = () => {
  const [demandes, setDemandes] = useState([]);
  const navigate = useNavigate(); // Utilisation du hook useNavigate

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const authRole = localStorage.getItem('authRole');
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/demande/6`, {
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

  const handleSubmit = async (id) => {
    
   

    // Récupérer les valeurs du localStorage
    const service = localStorage.getItem('authService');
    const utilisateurId = localStorage.getItem('authId');
    const authToken = localStorage.getItem('authToken');
    const role = localStorage.getItem('authRole');


    if (!service || !utilisateurId) {
        console.error("Service ou utilisateur non trouvé dans le localStorage");
        return;
    }

    // Reformatage de la date au format YYYY-MM-DD
   
    const data = {
        "statut":7,
        "id_demande":id
    }
   
    // Créer un objet avec les valeurs de l'état

    // Envoyer la requête POST à l'URL appropriée
    try {
        const response = await fetch(`http://localhost:8080/api/v1/${role}/demande/statut`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log('Demande validée avec succès');
            navigate(`/${role}/Planification/travaux`);
            // Reset des champs du formulaire
        } else {
            console.error('Erreur lors de l\'envoi de la demande:',response.statusText );
           
        }
        navigate(`/${role}/Planification/en_cours`);
    } catch (error) {
        console.error('Erreur réseau:', error);
    }
};
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
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <div className="col">
            <Card className="bg-default shadow">
             
              <CardHeader className="bg-transparent border-0 d-flex justify-content-between align-items-center">
              <h3 className="text-white mb-0">Travaux Planifiés</h3>
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
                    <th scope="col">Coût des travaux</th>
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
                          {demande.planification.dateDebut}
                        </td>
                        <td>
                          {demande.planification.dateFin}
                        </td>
                        <td>
                          {demande.travaux.total} Ar
                        </td>
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
                               onClick={() => navigate(`/DPR_SAF/Planification/travaux/${demande.id}`)}>
                                Detail
                              </DropdownItem>
                              <DropdownItem
                               onClick={() => handleSubmit(demande.id)}>
                                Commencer les travaux
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">Aucun Travaux Planifié</td>
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

export default Travaux_Planifie;
