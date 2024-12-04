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

const StatsHeader = ({valide,rejet,ressource,total}) => {
  return (
    <>
      <div className="pt-5 pb-8 header bg-gradient-info pt-md-8">
        <Container fluid>
          <div className="header-body">
          <Row>
              <Col lg="6" xl="3">
                <Card className="mb-4 card-stats mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="mb-0 text-uppercase text-muted"
                        >
                          Demandes validées
                        </CardTitle>
                        <span className="mb-0 h2 font-weight-bold">
                        {valide.nombre}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="text-white shadow icon icon-shape bg-success rounded-circle">
                          <i className="ni ni-check-bold" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-sm text-muted">
                      <span className="mr-2 text-success">
                       
                        {valide.pourcentage} %
                      </span>{" "}
                     
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="mb-4 card-stats mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="mb-0 text-uppercase text-muted"
                        >
                          Demandes rejettées
                        </CardTitle>
                        <span className="mb-0 h2 font-weight-bold">
                        {rejet.nombre}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="text-white shadow icon icon-shape bg-red rounded-circle">
                          <i className="ni ni-fat-remove" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-sm text-muted">
                      <span className="mr-2 text-success">
                       
                        {rejet.pourcentage} %
                      </span>{" "}
                     
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
              <Card className="mb-4 card-stats mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="mb-0 text-uppercase text-muted"
                      >
                        Valeur dépensée en ressource
                      </CardTitle>
                      <span className="mb-0 h2 font-weight-bold">
                      {total} Ar
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="text-white shadow icon icon-shape bg-info rounded-circle">
                        <i className="ni ni-money-coins" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-sm text-muted">
                   
                   
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
