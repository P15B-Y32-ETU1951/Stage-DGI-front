import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "reactstrap";
import DPRNavbar from "components/Navbars/DPRNavBar";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import routes from "routes.js";
import Sidebar_notif from "components/Sidebar/Sidebar_notif";
import Sidebar2 from "components/Sidebar/Sidebar2";

const DPR_SAF = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/DPR_SAF") {
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

  const getSidebarRoutes = (routes) => {
    return routes.filter(
      (route) =>
        route.layout === "/DPR_SAF" &&
        route.name !== "Detail" &&
        route.name !== "Rejet" &&
        route.name !== "detail plan" &&
        route.name !== "Ajouter" &&
        route.name !== "Planification" &&
        route.name !== "Detail travaux" &&
        route.name !== "Approvisionner" &&
        route.name!== "Demandes reçues" &&
        route.name!== "Travaux réouverture" &&
        route.name!== "Rapport" &&
        route.name!== "Historique" &&
        route.name!== "upload" &&
        route.name!== "Statistique" &&
        route.name!== "pec" &&
        route.name!=="valide" &&
        route.name!=="Demandes " &&
        route.name!=="T1" &&
        route.name!=="T2" &&
        route.name!=="Documents"
       


    );
  };

  return (
    <>
      <div className="wrapper d-flex flex-column min-vh-100"> {/* Wrapper Flexbox */}
      <Sidebar_notif
      {...props}
      routes={getSidebarRoutes(routes)}
      logo={{
        innerLink: "/DPR_SAF/index",
        imgSrc: require("../assets/img/brand/argon-react.png"),
        imgAlt: "...",
      }}
    />
        <div className="main-content flex-grow-1" ref={mainContent}> {/* Ensure main content grows */}
          <DPRNavbar
            {...props}
            brandText={getBrandText(props?.location?.pathname)}
          />
          <Routes>
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/DPR_SAF/index" replace />} />
          </Routes>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </div>
    </>
  );
};

export default DPR_SAF;
