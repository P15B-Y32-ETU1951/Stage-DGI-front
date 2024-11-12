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
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const StatsHeader = ({valide,rejet,ressource}) => {
  return (
    <>
      <div className="header bg-gradient-green pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
          <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Demandes validées
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                        {valide.nombre}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                          <i className="ni ni-check-bold" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                       
                        {valide.pourcentage} %
                      </span>{" "}
                     
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Demandes rejettées
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                        {rejet.nombre}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-red text-white rounded-circle shadow">
                          <i className="ni ni-fat-remove" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                       
                        {rejet.pourcentage} %
                      </span>{" "}
                     
                    </p>
                  </CardBody>
                </Card>
              </Col>
              </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default StatsHeader;
