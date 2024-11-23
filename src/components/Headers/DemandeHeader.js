/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import Demande from "views/examples/Demande";

const DemandeHeader = () => {
  return (
    <>
      <div className="pt-5 pb-8 header bg-gradient-info pt-md-8">
        <Container fluid>
          <div className="header-body">
          <Row>
              <Col lg="6" xl="3">
              <Link to="/DPR_SAF/Demande">
                <Card className="mb-4 card-stats mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="mb-0 text-uppercase text-muted"
                        >
                          
                        </CardTitle>
                        Demandes reçues
                      </div>
                      <Col className="col-auto">
                        <div className="text-white shadow icon icon-shape bg-info rounded-circle">
                          <i className="ni ni-email-83" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Link>
            </Col>
            <Col lg="6" xl="3">
              <Link to="/DPR_SAF/prise_en_charge">
                <Card className="mb-4 card-stats mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="mb-0 text-uppercase text-muted"
                        >
                        </CardTitle>
                        Demandes prises en charge
                      </div>
                      <Col className="col-auto">
                        <div className="text-white shadow icon icon-shape bg-green rounded-circle">
                          <i className="ni ni-badge" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Link>
            </Col>
            <Col lg="6" xl="3">
            <Link to="/DPR_SAF/demande/valide">
              <Card className="mb-4 card-stats mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="mb-0 text-uppercase text-muted"
                      >
                      </CardTitle>
                      Demandes validées
                    </div>
                    <Col className="col-auto">
                      <div className="text-white shadow icon icon-shape bg-red rounded-circle">
                        <i className="ni ni-check-bold" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Link>
          </Col>
              </Row>
              
          </div>
        </Container>
      </div>
    </>
  );
};

export default DemandeHeader;
