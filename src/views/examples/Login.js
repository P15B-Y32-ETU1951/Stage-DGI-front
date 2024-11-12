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
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Alert
} from "reactstrap";


const Login = () => {
  const [utilisateur, setUtilisateur] = useState({
       
    email: "",
    password: "",
});
const [error, setError] = useState("");
const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUtilisateur({
        ...utilisateur,
        [name]: value
    });
};

const navigate = useNavigate();
const handleSubmit = async(event) => {
    event.preventDefault();
   
  

try {
const response = await fetch('http://localhost:8080/api/v1/auth/signin', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(utilisateur)
});
if (response.status === 401) {
  setError("veuillez completer l'authentification par Email.");
  return;
}

if (response.ok) {
  const data = await response.json();
  const token = data.token; 
  const role=data.role;// Assume que le serveur renvoie un objet JSON avec un champ 'token'
  
        // Sauvegarde le token dans localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('authRole', role);
        console.log('Token saved:', token);
        console.log('Role:', role);

        navigate(`/${role}/index`);

  console.log("Utilisateur créé", data);
} else {
  setError("Une erreur est survenue lors de la connexion");
}

} catch (error) {
console.error("erreur de connexion ,veuillez ressayer correctement:",error.message);
setError("mot de passe ou adresse incorrecte");
}
};
  
  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
           
          
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    name="email"
                    value={utilisateur.email} 
                    onChange={handleInputChange} 
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    name="password"
                    value={utilisateur.password} 
                    onChange={handleInputChange} 
                  />
                </InputGroup>
              </FormGroup>
              
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit" onClick={handleSubmit}>
                  Sign in
                </Button>
              </div>
            </Form>
            {error && (
                <Alert color="danger">
                  {error}
                </Alert>
              )}
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small >S'inscrire</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
