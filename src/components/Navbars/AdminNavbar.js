import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle, Media, Navbar, Nav, Container } from "reactstrap";

const AdminNavbar = (props) => {

  const [userInfo, setUserInfo] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
      const fetchUserInfo = async () => {
          const token = localStorage.getItem('authToken'); 
          console.log(token," io le token"); // Le token doit être sauvegardé correctement
          const response = await fetch('http://192.168.88.18:8080/api/v1/CHEF_SERVICE/userinfo', {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`,  // S'assurer que le token est bien envoyé ici
                  'Content-Type': 'application/json',
              },
          });
          

          if (response.ok) {
              const data = await response.json();
              console.log(data);
              setUserInfo(data);
          } else {
              console.error('Erreur lors de la récupération des informations utilisateur');
          }
      };

      fetchUserInfo();
  }, []);
  const navigate = useNavigate(); // Utilisé pour rediriger après le logout

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      // Appel de l'API de déconnexion
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Si la déconnexion réussit, supprime le token
        localStorage.removeItem("authToken");
        localStorage.removeItem("authRole");

        // Redirige vers la page de connexion
        navigate("/auth/login");
        console.log(localStorage.getItem("authToken"));
      } else {
        console.error("Erreur lors de la déconnexion.");
      }
    } catch (error) {
      console.error("Erreur réseau lors de la déconnexion :", error);
    }
  };

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
         
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/theme/DGI.png")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {userInfo.nom}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
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
                <DropdownItem href="#pablo" onClick={handleLogout}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
