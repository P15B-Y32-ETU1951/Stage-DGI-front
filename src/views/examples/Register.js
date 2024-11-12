import { useState,useEffect } from "react";
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
  Col,
  Alert, // Import du composant Alert
} from "reactstrap";


const Register = () => {
  const [utilisateur, setUtilisateur] = useState({
    nom: "",
    email: "",
    password: "",
    confirmPassword: "", 
    prenom: "",
    service: "",
    role: "AGENT"
  });

  const [service, setService] = useState([]); // État pour stocker les services
  const [error, setError] = useState(""); 

  // Utiliser useEffect pour récupérer les services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/auth/services');
        const data = await response.json();
        setService(data); 
        // Mettre à jour l'état des services
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
      }
    };

    fetchServices();
  }, []); // Le tableau vide signifie que l'effet s'exécutera une seule fois après le rendu initial

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUtilisateur({
      ...utilisateur,
      [name]: value
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (utilisateur.password !== utilisateur.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(utilisateur)
      });

      console.log(utilisateur)
      if (response.status === 409) {
        setError("L'email est déjà pris, veuillez en utiliser un autre.");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log("Utilisateur créé", data);
        navigate("/login");
      } else {
        setError("Une erreur est survenue lors de l'inscription.");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error.message);
      setError("Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5"></CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Nom"
                    type="text"
                    name="nom"
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Prénom"
                    type="text"
                    name="prenom"
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormGroup>

              {/* Champ select pour les services */}
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-briefcase-24" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="select"
                    name="service"
                    onChange={handleInputChange}
                  >
                    <option value="">Sélectionner un service</option>
                    {service.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.nom}
                      </option>
                    ))}
                  </Input>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-single-02" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="select"
                    name="role"
                    onChange={handleInputChange}
                  >
                    <option value="AGENT">Agent</option>
                    <option value="CHEF_SERVICE">Chef de Service</option>\
                  </Input>
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
                    placeholder="Mot de passe"
                    type="password"
                    name="password"
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
                    placeholder="Confirmer mot de passe"
                    type="password"
                    name="confirmPassword"
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormGroup>

              {error && (
                <Alert color="danger">
                  {error}
                </Alert>
              )}

              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">
                  S'inscrire
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
