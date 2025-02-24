import { useState, useEffect } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button, Card, CardHeader, CardBody, CardTitle, Collapse, DropdownMenu, DropdownItem,
  UncontrolledDropdown, DropdownToggle, FormGroup, Form, Input, InputGroupAddon, InputGroupText,
  InputGroup, Media, NavbarBrand, Navbar, NavItem, NavLink, Nav, Badge, Progress, Table, Container, Row, Col,
} from "reactstrap";
import newLogo from "../../assets/img/theme/DGI.png";

const Sidebar_notif = (props) => {
  const token = localStorage.getItem('authToken');
  const [unplannedDemands, setUnplannedDemands] = useState(0);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [newNotifications, setNewNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationIds, setNotificationIds] = useState([]);

  const fetchValidatedDemands = async () => {
    if (!token) return; // Vérifie si le token existe avant la requête
    try {
      const response = await fetch('http://192.168.88.18:8080/api/v1/DPR_SAF/demande/4', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erreur réseau lors de la récupération des demandes validées');

      const demands = await response.json();
      const now = new Date();
      const outdatedUnplannedDemands = demands.filter(demande => {
        const latestStatus = demande.statutDemandes[demande.statutDemandes.length - 1];
        if (latestStatus && latestStatus.statut.id === 4) {
          const changeDate = new Date(latestStatus.date_changement);
          const daysSinceValidation = (now - changeDate) / (1000 * 60 * 60 * 24);
          return daysSinceValidation > 2 && !demande.planification;
        }
        return false;
      });

      setUnplannedDemands(outdatedUnplannedDemands.length);
      if (outdatedUnplannedDemands.length > 0) {
        toast.warning(`Il y a ${outdatedUnplannedDemands.length} demande(s) validée(s) non planifiées depuis plus d'une semaine.`, {
          position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true,
          pauseOnHover: true, draggable: true,
        });
      }
    } catch (error) {
      toast.error('Erreur lors de la récupération des demandes validées', { position: "top-right" });
      console.error(error);
    }
  };

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://192.168.88.18:8080/api/v1/DPR_SAF/notif', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erreur réseau lors de la récupération des notifications');

      const data = await response.json();
      setNotifications(data);
      setNotificationIds(data.map(notification => notification.id));
      setNewNotifications(data.length);
    } catch (error) {
      toast.error('Erreur lors de la récupération des notifications', { position: "top-right" });
      console.error(error);
    }
  };

  const markNotificationsAsSeen = async () => {
    if (!token || notificationIds.length === 0) return;
    try {
      const response = await fetch('http://192.168.88.18:8080/api/v1/DPR_SAF/notif/seen', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationIds),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour des notifications');

      setNewNotifications(0); // Réinitialise le compteur après avoir marqué comme vues
      await fetchNotifications();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des notifications', { position: "top-right" });
      console.error(error);
    }
  };

  useEffect(() => {
    fetchValidatedDemands();
    fetchNotifications();
  }, [token]);

  const toggleCollapse = () => setCollapseOpen((data) => !data);
  const closeCollapse = () => setCollapseOpen(false);

  const createLinks = (routes) => {
    return routes.map((prop, key) => (
      <NavItem key={key}>
        <NavLink
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
  const navbarBrandProps = logo?.innerLink
    ? { to: logo.innerLink, tag: Link }
    : logo?.outterLink
      ? { href: logo.outterLink, target: "_blank" }
      : {};

  return (
    <Navbar className="navbar-vertical fixed-left navbar-light bg-white" expand="md" id="sidenav-main">
      <Container fluid>
        <button className="navbar-toggler" type="button" onClick={toggleCollapse}>
          <span className="navbar-toggler-icon" />
        </button>
        {logo && (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <img alt="Votre Logo" className="navbar-brand-img" src={newLogo} />
            <span className="navbar-brand-text"><p>Direction Générale des Impôts</p></span>
          </NavbarBrand>
        )}
        <Collapse navbar isOpen={collapseOpen}>
          <Nav navbar>
            <NavItem>
              <NavLink to="/DPR_SAF/index" tag={NavLinkRRD} onClick={closeCollapse}>
                <i className="ni ni-email-83 text-blue" />
                Demandes reçues
                {newNotifications > 0 && (
                  <Badge color="danger" pill className="ml-2">{newNotifications}</Badge>
                )}
              </NavLink>
            </NavItem>
            {createLinks(routes)}
          </Nav>
          <hr className="my-3" />
        </Collapse>
      </Container>
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
