import Header from 'components/Headers/Header';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate si vous utilisez React Router v6
import { useEffect, useState } from 'react';
import { Badge, Button, Card, CardHeader, Container, DropdownItem, DropdownMenu, DropdownToggle, Media, Row, Table, UncontrolledDropdown } from 'reactstrap';

const Rapport = () => {
  const [demandes, setDemandes] = useState([]);
  const navigate = useNavigate(); // Utilisation du hook useNavigate
  const authToken = localStorage.getItem('authToken');
  const authRole = localStorage.getItem('authRole');
  useEffect(() => {
    const fetchDemandes = async () => {
      try {
      
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/demande/9`, {
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

  const openFile = (rapportId) => {
  const url = `http://localhost:8080/api/v1/${authRole}/download/${rapportId}`;
  
  // Ouvrir un nouvel onglet
  const newTab = window.open('', '_blank');
  
  // Effectuer la requête fetch pour récupérer le fichier PDF
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`, // Envoyer le token dans l'en-tête
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch the file');
    }
    return response.blob(); // Traiter la réponse en tant que Blob
  })
  .then(blob => {
    // Créer une URL Blob pour le fichier téléchargé
    const fileURL = URL.createObjectURL(blob);
    
    // Ouvrir l'URL Blob dans le nouvel onglet
    newTab.location.href = fileURL;
  })
  .catch(error => console.error('Error opening file:', error));
};
  const handleFileChange = async (event, demandeId) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const authToken = localStorage.getItem('authToken');
    const authRole = localStorage.getItem('authRole');

    try {
      const response = await fetch(`http://localhost:8080/api/v1/${authRole}/demande/${demandeId}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log('Rapport importé avec succès');
        // Rafraîchir la liste des demandes après l'importation
        const updatedDemandes = demandes.map(demande =>
          demande.id === demandeId ? { ...demande, rapport: true } : demande
        );
        setDemandes(updatedDemandes);
      } else {
        console.error('Erreur lors de l\'importation du rapport:', response.statusText);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  };

  const sortByDateAsc = () => {
    const sortedDemandes = [...demandes].sort((a, b) => new Date(a.date) - new Date(b.date));
    setDemandes(sortedDemandes);
  };

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
                <h3 className="text-white mb-0">Rapports des Travaux</h3>
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
                    <th scope="col">Rapport</th>
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
                        <td>{demande.planification.dateDebut}</td>
                        <td>{demande.planification.dateFin}</td>
                        <td>{demande.travaux.total} Ar</td>
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
                                onClick={() => navigate(`/DPR_SAF/Planification/travaux/${demande.id}`)}
                              >
                                Detail
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">Aucun Travaux receptionné</td>
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

export default Rapport;
