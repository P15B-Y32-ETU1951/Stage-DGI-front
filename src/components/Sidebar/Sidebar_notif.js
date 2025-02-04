import { useState, useEffect } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Badge,
  Progress,
  Table,
  Container,
  Row,
  Col,
  Alert,
} from "reactstrap";
import newLogo from "../../assets/img/theme/DGI1.png";
import DashboardAlert from "views/examples/DashboardAlert";

const Sidebar_notif = (props) => {
  const token = localStorage.getItem('authToken');
  const [unplannedDemands, setUnplannedDemands] = useState(0);
  const [planif, setPlanif] = useState(false);
  const [nb,setNb]=useState(0);
  const [demandes, setDemandes] = useState([]);
  const [reclam,setReclam] = useState([]);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const authRole = localStorage.getItem('authRole');
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/demande/termine`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        setDemandes(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    };

    fetchDemandes();
  }, []);
  // Fonction pour récupérer les demandes validées et vérifier les non-planifiées
  const fetchValidatedDemands = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/DPR_SAF/demande/4', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erreur réseau lors de la récupération des demandes validées');

      const demands = await response.json();
      const now = new Date();

      // Filtre pour les demandes validées depuis plus de 7 jours et non planifiées
      const outdatedUnplannedDemands = demands.filter(demande => {
        // Vérifier s'il existe un statut avec `statut.id === 4`
        const hasStatusId4 = demande.statutDemandes.some(status => status.statut.id === 4);
        
        if (hasStatusId4) {
          // Trouver la date de changement du dernier statut avec `statut.id === 4`
          const latestStatusWithId4 = demande.statutDemandes
            .filter(status => status.statut.id === 4)
            .pop(); // On prend le dernier statut avec `id === 4`
      
          if (latestStatusWithId4) {
            const changeDate = new Date(latestStatusWithId4.date_changement);
            const daysSinceValidation = (now - changeDate) / (1000 * 60 * 60 * 24);
            return daysSinceValidation > 7 && !demande.planification;
          }
        }
      
        return false;
      });
      

      setUnplannedDemands(outdatedUnplannedDemands.length);
      if (outdatedUnplannedDemands.length > 0) {
       setPlanif(true);
       setNb(outdatedUnplannedDemands.length);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes validées :', error);
    }
  };

  useEffect(() => {
    fetchValidatedDemands();
  }, [token]);

  const [collapseOpen, setCollapseOpen] = useState(false);
  const [newNotifications, setNewNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationIds, setNotificationIds] = useState([]);
  const [isNotif, setIsNotif] = useState( false );                      

  // Fonction pour récupérer les notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/DPR_SAF/notif', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Erreur réseau lors de la récupération des notifications');
      }
      const data = await response.json();
      setNotifications(data);
      const ids = data.map(notification => notification.id);
      setNotificationIds(ids);
      setNewNotifications(data.length);
      if(data.length >0){
        setIsNotif(true);
      }

      
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications :', error);
    }
  };

  // Récupérer les notifications au montage
  useEffect(() => {
    fetchNotifications();
    
    
      const reclamation = demandes.filter(demande => {
        // Vérifier s'il existe un statut avec `statut.id === 10`
        const hasStatusId10 = demande.statutDemandes.some(status => status.statut.id === 10);
        
        if (hasStatusId10) {
          setReclam(true);
        }
      
        return false;
      })
    
  }, [token,demandes]);

  const markNotificationsAsSeen = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/DPR_SAF/notif/seen', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationIds),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des notifications');
      }

      await fetchNotifications();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications :', error);
    }
  };

  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };

  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  const createLinks = (routes) => {
    return routes.map((prop, key) => (
      <NavItem key={key}>
        <NavLink className="text-white"
          to={prop.layout + prop.path}
          tag={NavLinkRRD}
          onClick={() => {
            closeCollapse();
            markNotificationsAsSeen();
          }}
        >
          <i className={prop.icon} />
          {prop.name}
        </NavLink>
      </NavItem>
    ));
  };

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <Navbar className="bg-default navbar-vertical fixed-left navbar-light" expand="md" id="sidenav-main">
      <Container fluid>
               {/* Toggler */}
               <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
         <NavbarBrand className="pt-0 text-white" {...navbarBrandProps}>
         <img alt="Votre Logo" className="navbar-brand-img " src={newLogo}
         
         style={{
          width: "300px",
          height: "150px", // Change cette valeur selon ton besoin
          maxWidth: "100%",
          maxHeight: "none",
          display: "block"
        }}
         
         />
        <span className="navbar-brand-text text-wrap" style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
          <h4 className="text-white text-center">
            Ministère de l’Economie et des Finances
          </h4>
        </span>

       </NavbarBrand>
        ) : null}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav className="nav-link-icon">
              <i className="ni ni-bell-55" />
            </DropdownToggle>
            <DropdownMenu aria-labelledby="navbar-default_dropdown_1" right>
              <DropdownItem>Action</DropdownItem>
              <DropdownItem>Another action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Something else here</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img alt="..." src={require("../../assets/img/theme/team-1-800x800.jpg")} />
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="m-0 text-overflow">Bienvenue!</h6>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-single-02" />
                <span>Mon profil</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-settings-gear-65" />
                <span>Settings</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-calendar-grid-58" />
                <span>Activity</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-support-16" />
                <span>Support</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>

        <Collapse navbar isOpen={collapseOpen}>
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt="Votre Logo" className="navbar-brand-img" src={newLogo} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt="Votre Logo" className="navbar-brand-img" src={newLogo} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button className="navbar-toggler" type="button" onClick={toggleCollapse}>
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input aria-label="Search" className="form-control-rounded form-control-prepended" placeholder="Search" type="search" />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <span className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Form>

          {/* Navigation */}
          <Nav navbar>
            {/* Badge des notifications */}
            <NavItem>
              <NavLink  className="text-white" to="/DPR_SAF/Demande" tag={NavLinkRRD} onClick={closeCollapse}>
                <i className="ni ni-email-83 text-blue" />
                Demandes 
                {newNotifications > 0 && (
                  <Badge color="danger" pill className="ml-2">
                    {newNotifications}
                  </Badge>
                )}
              </NavLink>
            </NavItem>
            {createLinks(routes)}
          </Nav>
          {
            planif===true &&(
              <DashboardAlert  titre={'Demandes non planifiées'} message={`vous avez ${nb} demandes validée(s) non planifiées depuis plus de 7 jours `} link={'/DPR_SAF/demande/valide'}/>
            )
          }
          {
            isNotif===true &&(
              <DashboardAlert  titre={'Nouvelles demandes'} message={`vous avez ${newNotifications} nouvelles demandes de travaux `} link={'/DPR_SAF/Demande'}/>
            )
          }
          {
            reclam===true &&(
              <DashboardAlert  titre={'Reclamation'} message={`vous avez des reclamations sur des  travaux `} link={'/DPR_SAF/Travaux/termine'}/>
            )
          }
          <hr className="my-3" />
        </Collapse>
      </Container>
      <ToastContainer />
    </Navbar>
  );
};

Sidebar_notif.defaultProps = {
  routes: [{}],
};

Sidebar_notif.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar_notif;
