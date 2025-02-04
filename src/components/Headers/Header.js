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
import logo from "../../assets/img/theme/DGI2.png";

const Header = () => {
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>
          <div className="header-body text-center">
            <Row className="justify-content-center">
              <Col md="6" className="text-center">
                <img
                  src={logo}
                  alt="Logo Direction Générale des Impôts"
                  className="img-fluid"
                  style={{ maxHeight: "none",width: "250px", height: "auto" }} // Ajuste la taille selon ton besoin
                />
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
