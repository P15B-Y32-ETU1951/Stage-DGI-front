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

  const isPasswordComplex = (password) => {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isPredictable = /(123|abc|password|qwerty|admin)/i.test(password);
  
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      !isPredictable
    );
  };
  // Utiliser useEffect pour récupérer les services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://192.168.88.18:8080/api/v1/auth/services');
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

    if (!isPasswordComplex(utilisateur.password)) {
      setError(
        "Le mot de passe doit contenir au moins 12 caractères, incluant des majuscules, des minuscules, des chiffres et des caractères spéciaux."
      );
      return;
    }

    try {
      const response = await fetch('http://192.168.88.18:8080/api/v1/auth/signup', {
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
        <Card className="border-0 shadow bg-secondary">
          <CardHeader className="pb-5 bg-transparent"></CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup>
                <InputGroup className="mb-3 input-group-alternative">
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
                <InputGroup className="mb-3 input-group-alternative">
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
                <InputGroup className="mb-3 input-group-alternative">
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
                <InputGroup className="mb-3 input-group-alternative">
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
                <InputGroup className="mb-3 input-group-alternative">
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
