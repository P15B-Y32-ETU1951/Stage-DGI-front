import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import ReCAPTCHA from "react-google-recaptcha"; // Importez ReCAPTCHA

const Forgot_Password = () => {
  const authToken = localStorage.getItem("authToken");
  const authRole = localStorage.getItem("authRole");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [utilisateur, setUtilisateur] = useState({
    email: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirection si l'utilisateur est déjà connecté
  useEffect(() => {
    if (authToken && authRole) {
      navigate(`/${authRole}/index`);
    }
  }, [authToken, authRole, navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUtilisateur({
      ...utilisateur,
      [name]: value,
    });
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Vérifiez si reCAPTCHA est validé
    

    // Créez l'objet avec les données de l'utilisateur + captcha
    const utilisateurAvecCaptcha = {
      ...utilisateur,
      captcha: captchaValue, // Ajoutez la valeur du captcha
    };

    try {
      const response = await fetch("http://192.168.88.18:8080/api/v1/auth/forgot_password", {
        method: "POST", // Utilisez POST pour envoyer les données dans le corps de la requête
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(utilisateurAvecCaptcha), // Envoyez les données dans le corps de la requête
      });

      if (response.status === 401) {
        setError("Un problème d'authentification est survenu.");
        return;
      }

      if (response.ok) {
        

       setError("Un email de récuperation est envoyé.");
      } else {
        setError("Une erreur est survenue lors de la connexion");
      }
    } catch (error) {
      console.error("Erreur de connexion, veuillez ressayer :", error.message);
      setError("Adresse incorrecte");
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="border-0 shadow bg-secondary">
          <CardHeader className="pb-5 bg-transparent"></CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <h4 className="text-muted text-center mb-4">Un email de récupération vous sera envoyé</h4>
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
             

              {/* Ajoutez ici le widget reCAPTCHA */}
             

              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Envoyer 
                </Button>
              </div>
            </Form>
            {error && <Alert color="danger">{error}</Alert>}
          </CardBody>
        </Card>
       
      </Col>
    </>
  );
};

export default Forgot_Password;
