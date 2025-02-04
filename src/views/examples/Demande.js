import React, { useState } from 'react';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Row,
} from 'reactstrap';
import UserHeader from 'components/Headers/UserHeader';
import { useNavigate } from 'react-router-dom';

const Demande = () => {
    const [motif, setMotif] = useState('');
    const [description, setDescription] = useState('');
    const navigate=useNavigate();

    // Fonction pour gérer l'envoi du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Récupérer les valeurs du localStorage
       
        const authToken = localStorage.getItem('authToken');
        const role = localStorage.getItem('authRole');

    
      
        // Reformatage de la date au format YYYY-MM-DD
        const Localdate = new Date().toISOString().split('T')[0];
        var statut = 0;  // ISO format YYYY-MM-DD
        if(role==="AGENT"){
             statut=1;
        }
        if(role==="CHEF_SERVICE"){
             statut=2;
        }
        // Créer un objet avec les valeurs de l'état
        const demandeData = {
            date: Localdate,
            description,
            motif,
            id_statut: statut,
        };
    
        // Envoyer la requête POST à l'URL appropriée
        try {
            const response = await fetch(`http://localhost:8080/api/v1/${role}/demande`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(demandeData),
            });
    
            if (response.ok) {
                console.log('Demande envoyée avec succès');
                // Reset des champs du formulaire
                setMotif('');
                setDescription('');
                navigate(`${role}/index`);
            } else {
                console.error('Erreur lors de l\'envoi de la demande:',response.statusText );
                console.log(demandeData);
               
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
        }
    };
    

    return (
        <>
            <UserHeader />
            <Container className="mt--7" fluid>
                <Row className="justify-content-center">
                    <Col className="order-xl-1" xl="8">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0" >
                                <Row className="align-items-center">
                                    <Col xs="8">
                                    <blockquote className="blockquote text-right">
                                        <h2 className="mb-0">
                                            Demande de Travaux
                                        </h2>
                                        </blockquote>
                                    </Col>
                                    <hr className="my-4" />
                                    <p className="heading-small text-muted mb-4">
                                        Les demandes de travaux seront envoyées à la Direction de la Programmation des Ressources au service administratif financier après validation de votre Chef de Service.
                                    </p>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleSubmit}>
                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="input-motif"
                                                    >
                                                        Motif de la demande
                                                    </label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        placeholder="écrivez le motif ici ..."
                                                        rows="3"
                                                        type="textarea"
                                                        value={motif}
                                                        onChange={(e) => setMotif(e.target.value)}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                    <hr className="my-4" />
                                    {/* Description */}
                                    <h6 className="heading-small text-muted mb-4">Description</h6>
                                    <div className="pl-lg-4">
                                        <FormGroup>
                                            <label>Détails de la demande</label>
                                            <Input
                                                className="form-control-alternative"
                                                placeholder="Détaillez votre demande ..."
                                                rows="25"
                                                type="textarea"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                required
                                            />
                                        </FormGroup>
                                    </div>

                                    <div className="text-center">
                                        <Button className="mt-4" color="success" type="submit">
                                            Envoyer la demande
                                        </Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Demande;
