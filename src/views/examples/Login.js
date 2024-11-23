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

const Login = () => {
  const authToken = localStorage.getItem("authToken");
  const authRole = localStorage.getItem("authRole");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [utilisateur, setUtilisateur] = useState({
    email: "",
    password: "",
    captcha: captchaValue
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

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    console.log("Valeur du captcha:", value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Vérifiez si reCAPTCHA est validé
    if (!captchaValue) {
      setError("Veuillez valider le reCAPTCHA.");
      return;
    }

    // Créez l'objet avec les données de l'utilisateur + captcha
    const utilisateurAvecCaptcha = {
      ...utilisateur,
      captcha: captchaValue, // Ajoutez la valeur du captcha
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/signin", {
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
        const data = await response.json();
        const expired = data.passwordstate;

        if (expired === true) {
          // Redirige vers la page de changement de mot de passe
          navigate(`/auth/change-password/${data.id}`);
        } else {
          const token = data.token;
          const role = data.role;
          localStorage.setItem("authToken", token);
          localStorage.setItem("authRole", role);
          navigate(`/${role}/index`);
        }
      } else {
        setError("Une erreur est survenue lors de la connexion");
      }
    } catch (error) {
      console.error("Erreur de connexion, veuillez ressayer :", error.message);
      setError("Mot de passe ou adresse incorrecte");
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="border-0 shadow bg-secondary">
          <CardHeader className="pb-5 bg-transparent"></CardHeader>
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

              {/* Ajoutez ici le widget reCAPTCHA */}
              <FormGroup>
                <ReCAPTCHA
                  sitekey="6LfEC4UqAAAAABiBuOsBSxTj1fM2iQT3dc_axp3V" // Utilisez votre propre clé de site
                  onChange={handleCaptchaChange}
                />
              </FormGroup>

              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Sign in
                </Button>
              </div>
            </Form>
            {error && <Alert color="danger">{error}</Alert>}
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col className="text-right" xs="6">
            <a className="text-light" href="#pablo" onClick={(e) => e.preventDefault()}>
              <small>S'inscrire</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
