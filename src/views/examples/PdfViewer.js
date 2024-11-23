import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import UserHeader from 'components/Headers/UserHeader';

const PdfViewer = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const { id } = useParams();
  const authToken = localStorage.getItem('authToken');
  const authRole = localStorage.getItem('authRole');

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/download/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/pdf', // S'assurer que le type de contenu attendu est un PDF
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement du PDF');
        }

        // Récupérer le flux binaire du fichier PDF
        const pdfBlob = await response.blob();

        // Convertir le Blob en URL utilisable par <iframe>
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchPdf();
  }, [authRole, id, authToken]);

  return (
    <div>
      <UserHeader />
      <Container className="mt--7" fluid>
       
         
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Rapport des Travaux</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    title="PDF Viewer"
                    width="100%"
                    height="600px"
                    style={{ border: 'none' }}
                  ></iframe>
                ) : (
                  <p>Chargement du PDF...</p>
                )}
              </CardBody>
            </Card>
         
      
      </Container>
    </div>
  );
};

export default PdfViewer;
