import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import Chef_serviceNavbar from "components/Navbars/Chef_serviceNavbar";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

const Chef_service = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  // Filtrer les routes pour le layout "chef"
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/CHEF_SERVICE") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  // Filtrer les routes pour la Sidebar
  const getSidebarRoutes = (routes) => {
    return routes.filter((route) => route.layout === "/CHEF_SERVICE" && 
    route.name !== "Detail" &&
    route.name !== "Rejet" &&
    route.name !== "detail plan" &&
    route.name !== "Ajouter" &&
    route.name !== "Planification" &&
    route.name !== "Detail travaux" &&
    route.name !== "Retour" &&
    route.name !=="Reclamation" &&
    route.name !== "Travaux réouverture"
  );
   
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={getSidebarRoutes(routes)}  // Utiliser les routes filtrées pour la Sidebar
        logo={{
          innerLink: "/CHEF_SERVICE/index",
          imgSrc: require("../assets/img/brand/argon-react.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <Chef_serviceNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/CHEF_SERVICE/index" replace />} /> {/* Changer vers une route par défaut "chef" */}
        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Chef_service;
