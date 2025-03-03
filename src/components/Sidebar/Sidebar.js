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
/*eslint-disable*/
import { useEffect, useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";

// reactstrap components
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
  Progress,
  Table,
  Container,
  Row,
  Col,
  Badge,
} from "reactstrap";

var ps;
import newLogo from "../../assets/img/theme/DGI1.png";
import DashboardAlert from "views/examples/DashboardAlert";


const Sidebar = (props) => {
  const token = localStorage.getItem('authToken');
  const authRole = localStorage.getItem('authRole');
  const [newNotifications, setNewNotifications] = useState(0);
  const [unplannedDemands, setUnplannedDemands] = useState(0);
  const [notif, setNotif] = useState(false);

  const [collapseOpen, setCollapseOpen] = useState();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };


  const fetchValidatedDemands = async () => {
    try {
      const response = await fetch('http://192.168.88.18:8080/api/v1/CHEF_SERVICE/demande/8', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erreur réseau lors de la récupération des demandes validées');

      const demands = await response.json();
      const now = new Date();

      // Filtre pour les demandes validées depuis plus de 7 jours et non planifiées
      const outdatedUnplannedDemands = demands.filter(demande => {
        // Filtrer les statuts avec `statut.id === 8`
        const statusWithId8 = demande.statutDemandes
          .filter(status => status.statut.id === 8);
      
        // Trouver le statut avec la date la plus récente
        if (statusWithId8.length > 0) {
          const latestStatusWithId8 = statusWithId8.reduce((latest, current) => {
            const latestDate = new Date(latest.date_changement);
            const currentDate = new Date(current.date_changement);
            return currentDate > latestDate ? current : latest;
          });
      
          const changeDate = new Date(latestStatusWithId8.date_changement);
          console.log(changeDate);
          console.log(now);
          const daysSinceStatusChange = (now - changeDate) / (1000 * 60 * 60 * 24);
          console.log(daysSinceStatusChange);
          return daysSinceStatusChange > 7 ;
        }
      
        return false;
      });
      
      setUnplannedDemands(outdatedUnplannedDemands.length);
      
      if (outdatedUnplannedDemands.length > 0) {
       // window.alert(`Il y a ${outdatedUnplannedDemands.length} travaux terminé(s) depuis plus de 7 jours en attente de vos retours.`);
        setNotif(true);
      }
      
      
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes validées :', error);
    }
  };

  useEffect(() => {
    fetchValidatedDemands();
    fetchNotifications();
  }, [token]);

  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    return routes.map((prop, key) => (
      <NavItem key={key}>
        <NavLink className="text-white"
          to={prop.layout + prop.path}
          tag={NavLinkRRD}
          onClick={() => {closeCollapse;
            markNotificationsAsSeen();
          }
          
        }
        >
          <i className={prop.icon} />
          {prop.name}
          {prop.name === "Suivi des demandes" && newNotifications > 0 && (
            <Badge color="danger" pill className="ml-2">
              {newNotifications}
            </Badge>
          )}
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


  ///////
  const [notifications, setNotifications] = useState([]);
  const [notificationIds, setNotificationIds] = useState([]);
  const [isNotif, setIsNotif] = useState( false );                      

  // Fonction pour récupérer les notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://192.168.88.18:8080/api/v1/CHEF_SERVICE/notif', {
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
  
  const markNotificationsAsSeen = async () => {
    try {
      const response = await fetch('http://192.168.88.18:8080/api/v1/CHEF_SERVICE/notif/seen', {
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

  return (
    <Navbar
      className="bg-default text-white navbar-vertical fixed-left navbar-light "
      expand="md"
      id="sidenav-main"
    >
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
         <img alt="Votre Logo"  src={newLogo} 
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
        
        {/* User */}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav className="nav-link-icon">
              <i className="ni ni-bell-55" />
            </DropdownToggle>
            <DropdownMenu
              aria-labelledby="navbar-default_dropdown_1"
              className="dropdown-menu-arrow"
              right
            >
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
                  <img
                    alt="..."
                    src={require("../../assets/img/theme/team-1-800x800.jpg")}
                  />
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="m-0 text-overflow">Welcome!</h6>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-single-02" />
                <span>My profile</span>
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
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
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
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Form */}
          <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input
                aria-label="Search"
                className="form-control-rounded form-control-prepended"
                placeholder="Search"
                type="search"
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <span className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Form>
          {/* Navigation */}
          <Nav navbar>{createLinks(routes)}</Nav>
          {/* Divider */}
          <hr className="my-3" />
          {/* Heading */}
         
          {/* Navigation */}
          <Nav className="mb-md-3" navbar>
           
            
            
          </Nav>
          <Nav className="mb-md-3" navbar>
            
          </Nav>

          {
            notif===true &&(
              <DashboardAlert  titre={'Travaux Terminé(s)'} message={`vous avez ${unplannedDemands} travaux terminé(s) en attente de vos retours depuis 7 jours `} link={'/CHEF_SERVICE/Suivi'}/>
            )
          }
           {
            isNotif===true && authRole=='CHEF_SERVICE' &&(
              <DashboardAlert  titre={'Nouvelles demandes'} message={`vous avez ${newNotifications} nouvelles demandes de travaux en attente de validation `} link={'/CHEF_SERVICE/index'}/>
            )
          }
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
