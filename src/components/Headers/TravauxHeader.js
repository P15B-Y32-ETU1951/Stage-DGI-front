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

const TravauxHeader = () => {
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
          <Row>
              <Col lg="6" xl="3">
              <Link to="/DPR_SAF/Planification/en_cours">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          
                        </CardTitle>
                        Travaux en cours
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-green text-white rounded-circle shadow">
                          <i className="ni ni-settings" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Link>
            </Col>
            <Col lg="6" xl="3">
              <Link to="/DPR_SAF/Planification/travaux">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                        </CardTitle>
                        Travaux planifiés
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-red text-white rounded-circle shadow">
                          <i className="ni ni-settings" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Link>
            </Col>
            <Col lg="6" xl="3">
            <Link to="/DPR_SAF/Travaux/termine">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                      </CardTitle>
                      Travaux receptionnés
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <i className="ni ni-settings" />
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

export default TravauxHeader;
