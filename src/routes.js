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
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import Test from "views/examples/Test";
import Demande from "views/examples/Demande";
import Valider from "views/examples/Valider";
import Detail from "views/examples/Detail";
import DPR_Demandes from "views/examples/DPR_Demandes";
import DPR_Detail from "views/examples/DPR_Detail";
import Rejet from "views/examples/Rejet";
import Profil from "views/examples/Profil";
import Suivi from "views/examples/Suivi";
import Suivi_Chef from "views/examples/Suivi_Chef";
import Pris_en_Charge from "views/examples/Prise_en_Charge";
import DPR_Detail_Plan from "views/examples/DPR_Detail_Plan";
import Ressource from "views/examples/Ressource";
import Ajouter_Ressource from "views/examples/Ajouter_Ressource";
import Planification from "views/examples/Planification";
import DPR_Demande_Valide from "views/examples/DPR_Demande_Valide";
import DPR_Detail_nb from "views/examples/DPR_Detail_nb";
import Travaux_Planifie from "views/examples/Travaux_Planifie";
import DetailTravaux from "views/examples/Detail_Travaux";
import Travaux_en_Cours from "views/examples/Travaux_en_Cours";
import Approvisionnement from "views/examples/Approvisionner";
import Retour from "views/examples/Retour";
import Reclamation from "views/examples/Reclamation";
import Travaux_Termine from "views/examples/Travaux_Termine";
import Reouverture from "views/examples/Reouverture";
import Rapport from "views/examples/Rapport";
import UploadFileComponent from "views/examples/Upload";
import Historique from "views/examples/Historique";
import Statistique from "views/examples/Statistique";
import DocViewer from "views/examples/DocViewer";
import PdfViewer from "views/examples/PdfViewer";
import ChangePassword from "views/examples/Change-Password";
import Planification2 from "views/examples/Planification2";
import Planification3 from "views/examples/Planification3";
import Reouverture2 from "views/examples/Reouverture2";
import Forgot_Password from "views/examples/Forgot_Password";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: <Icons />,
    layout: "/admin",
  },
 
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
  {
    path: "/change-password/:id",
    name: "Change Password",
    icon: "ni ni-circle-08 text-pink",
    component: <ChangePassword />,
    layout: "/auth",
  },
  {
    path: "/forgot-password",
    name: "Forgot Password",
    icon: "ni ni-circle-08 text-pink",
    component: <Forgot_Password />,
    layout: "/auth",
  },

  //DPR_SAF
  {
    path: "/prise_en_charge",
    name: "pec",
    icon: "ni ni-badge text-green",
    component: <Pris_en_Charge />,
    layout: "/DPR_SAF",
  },
  {
    path: "/demande/detail/planification/:id",
    name: "detail plan",
    icon: "ni ni-badge text-green",
    component: <DPR_Detail_Plan />,
    layout: "/DPR_SAF",
  },
  {
    path: "/ressource",
    name: "Ressources",
    icon: "ni ni-delivery-fast text-pink",
    component: <Ressource />,
    layout: "/DPR_SAF",
  },
  {
    path: "/ressource/approvisionner/:id",
    name: "Approvisionner",
    icon: "ni ni-delivery-fast text-blue",
    component: <Approvisionnement />,
    layout: "/DPR_SAF",
  },
  {
    path: "/ressource/ajouter",
    name: "Ajouter",
    icon: "ni ni-delivery-fast text-orange",
    component: <Ajouter_Ressource />,
    layout: "/DPR_SAF",
  },
  {
    path: "/demande",
    name: "Demandes ",
    icon: "ni ni-send text-blue",
    component: <DPR_Demandes />,
    layout: "/DPR_SAF",

  },
  {
    path: "/demande/valide",
    name: "valide",
    icon: "ni ni-check-bold text-green",
    component: <DPR_Demande_Valide />,
    layout: "/DPR_SAF",

  },
  {
    path: "/Planification/:id",
    name: "Planification",
    icon: "ni ni-send text-blue",
    component: <Planification3 />,
    layout: "/DPR_SAF",

  },
  {
    path: "/Rejet/:id",
    name: "Rejet",
    icon: "ni ni-send text-blue",
    component: <Rejet />,
    layout: "/DPR_SAF",

  },
  {
    path: "/Rapport/upload/:id", // Utilisez :id pour indiquer un paramètre dynamique
    name: "upload",
    icon: "ni ni-settings text-purple",
    component: <UploadFileComponent/>, // Assurez-vous de ne pas utiliser de balises JSX ici
    layout: "/DPR_SAF",
  },
  {
    path: "/Historique", // Utilisez :id pour indiquer un paramètre dynamique
    name: "Historique",
    icon: "ni ni-settings text-purple",
    component: <Historique/>, // Assurez-vous de ne pas utiliser de balises JSX ici
    layout: "/DPR_SAF",
  },
  {
    path: "/Document/:id", // Utilisez :id pour indiquer un paramètre dynamique
    name: "Documents",
    icon: "ni ni-settings text-purple",
    component: <PdfViewer/>, // Assurez-vous de ne pas utiliser de balises JSX ici
    layout: "/DPR_SAF",
  },
  {
    path: "/index", // Utilisez :id pour indiquer un paramètre dynamique
    name: "Statistique",
    icon: "ni ni-settings text-purple",
    component: <Statistique/>, // Assurez-vous de ne pas utiliser de balises JSX ici
    layout: "/DPR_SAF",
  },
  {
    path: "/Planification/travaux", // Utilisez :id pour indiquer un paramètre dynamique
    name: "T2",
    icon: "ni ni-settings text-red",
    component: <Travaux_Planifie/>, // Assurez-vous de ne pas utiliser de balises JSX ici
    layout: "/DPR_SAF",
  },
  {
    path: "/Planification/travaux/:id", // Utilisez :id pour indiquer un paramètre dynamique
    name: "Detail travaux",
    icon: "ni ni-settings text-yellow",
    component: <DetailTravaux/>, // Assurez-vous de ne pas utiliser de balises JSX ici
    layout: "/DPR_SAF",
  },
  {
    path: "/Planification/en_cours", // Utilisez :id pour indiquer un paramètre dynamique
    name: "Travaux ",
    icon: "ni ni-settings text-green",
    component: <Travaux_en_Cours/>, // Assurez-vous de ne pas utiliser de balises JSX ici
    layout: "/DPR_SAF",
  },
  {
    path: "/Travaux/termine", // Utilisez :id pour indiquer un paramètre dynamique
    name: "T1",
    icon: "ni ni-settings text-info",
    component: <Travaux_Termine/>, // Assurez-vous de ne pas utiliser de balises JSX ici
    layout: "/DPR_SAF",
  },

  {
    path: "/Travaux/rapport", // Utilisez :id pour indiquer un paramètre dynamique
    name: "Rapport",
    icon: "ni ni-settings text-info",
    component: <Rapport/>, // Assurez-vous de ne pas utiliser de balises JSX ici
    layout: "/DPR_SAF",
  },
  {
    path: "/Travaux/reouverture/:id", // Utilisez :id pour indiquer un paramètre dynamique
    name: "Travaux réouverture",
    icon: "ni ni-settings text-info",
    component: <Reouverture2/>, // Assurez-vous de ne pas utiliser de balises JSX ici
    layout: "/DPR_SAF",
  },
  {
    path: "/user-profile",
    name: "Mon Profil",
    icon: "ni ni-single-02 text-yellow",
    component: <Profil />,
    layout: "/DPR_SAF",
  }
,
  {
    path: "/demande/detail/:id", // Utilisez :id pour indiquer un paramètre dynamique
    name: "Detail",
    icon: "ni ni-paper-diploma text-blue",
    component: <DPR_Detail />, // Assurez-vous de ne pas utiliser de balises JSX ici
    layout: "/DPR_SAF",
},
{
  path: "/demande/detail/:id/n_b", // Utilisez :id pour indiquer un paramètre dynamique
  name: "Detail",
  icon: "ni ni-paper-diploma text-blue",
  component: <DPR_Detail_nb/>, // Assurez-vous de ne pas utiliser de balises JSX ici
  layout: "/DPR_SAF",
},


  //CHEF_SERVICE
  {
    path: "/demande",
    name: "Envoyer une Demande",
    icon: "ni ni-email-83 text-red",
    component: <Demande />,
    layout: "/CHEF_SERVICE",
  },

  {
    path: "/valider",
    name: "Valider des Demande",
    icon: "ni ni-email-83 text-green",
    component: <Valider />,
    layout: "/CHEF_SERVICE",
  },
  {
    path: "/index",
    name: "Suivi des demandes",
    icon: "ni ni-email-83 text-yellow",
    component: <Suivi_Chef />,
    layout: "/CHEF_SERVICE",
  },

  {
    path: "/demande/detail/:id", // Utilisez :id pour indiquer un paramètre dynamique
    name: "Detail",
    icon: "ni ni-paper-diploma text-blue",
    component: <Detail />, // Assurez-vous de ne pas utiliser de balises JSX ici
    layout: "/CHEF_SERVICE",
},
{
  path: "/demande/retour/:id", // Utilisez :id pour indiquer un paramètre dynamique
  name: "Retour",
  icon: "ni ni-paper-diploma text-blue",
  component: <Retour />, // Assurez-vous de ne pas utiliser de balises JSX ici
  layout: "/CHEF_SERVICE",
},
{
  path: "/demande/retour/reclamation/:id", // Utilisez :id pour indiquer un paramètre dynamique
  name: "Reclamation",
  icon: "ni ni-paper-diploma text-blue",
  component: <Reclamation/>, // Assurez-vous de ne pas utiliser de balises JSX ici
  layout: "/CHEF_SERVICE",
},
{
  path: "/Planification/travaux/:id", // Utilisez :id pour indiquer un paramètre dynamique
  name: "Detail travaux",
  icon: "ni ni-settings text-yellow",
  component: <DetailTravaux/>, // Assurez-vous de ne pas utiliser de balises JSX ici
  layout: "/CHEF_SERVICE",
},
  {
    path: "/user-profile",
    name: "Mon Profil",
    icon: "ni ni-single-02 text-yellow",
    component: <Profil />,
    layout: "/CHEF_SERVICE",
  }
  
,
////AGENT
  {
    path: "/user-profile",
    name: "Mon Profil",
    icon: "ni ni-single-02 text-yellow",
    component: <Profil />,
    layout: "/AGENT",
  }
  ,
  {
    path: "/demande",
    name: "Envoyer une Demande",
    icon: "ni ni-email-83 text-red",
    component: <Demande />,
    layout: "/AGENT",
  },
  {
    path: "/index",
    name: "Suivi des demandes",
    icon: "ni ni-email-83 text-green",
    component: <Suivi />,
    layout: "/AGENT",
  },
  {
    path: "/demande/detail/:id", // Utilisez :id pour indiquer un paramètre dynamique
    name: "Detail",
    icon: "ni ni-paper-diploma text-blue",
    component: <Detail />, // Assurez-vous de ne pas utiliser de balises JSX ici
    layout: "/AGENT",
},
{
  path: "/Planification/travaux/:id", // Utilisez :id pour indiquer un paramètre dynamique
  name: "Detail travaux",
  icon: "ni ni-settings text-yellow",
  component: <DetailTravaux/>, // Assurez-vous de ne pas utiliser de balises JSX ici
  layout: "/AGENT",
},
];
export default routes;
