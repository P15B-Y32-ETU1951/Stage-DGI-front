// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import logo from "../../assets/img/theme/DGI2.png";

const StatsHeader = ({ valide, rejet, total }) => {
  return (
    <>
      <div className="pt-5 pb-8 header bg-gradient-info pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Logo centré */}
            <Row className="justify-content-center mb-4">
              <Col xs="12" className="text-center">
                <img
                  src={logo}
                  alt="Logo Direction Générale des Impôts"
                  className="img-fluid"
                  style={{ maxWidth: "250px", height: "auto" }}
                />
              </Col>
            </Row>

            {/* Cartes alignées horizontalement et centrées */}
            <Row className="justify-content-center">
              <Col lg="4" md="6">
                <Card className="mb-4 card-stats">
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
                      </span>
                    </p>
                  </CardBody>
                </Card>
              </Col>

              <Col lg="4" md="6">
                <Card className="mb-4 card-stats">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="mb-0 text-uppercase text-muted"
                        >
                          Demandes rejetées
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
                      </span>
                    </p>
                  </CardBody>
                </Card>
              </Col>

              <Col lg="4" md="6">
                <Card className="mb-4 card-stats" style={{ height: "122px" }}>
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
