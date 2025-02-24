import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Container, Row, Col } from 'reactstrap';
import Header from 'components/Headers/Header';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import StatsHeader from 'components/Headers/StatsHeader';
import { BarChart } from '@mui/x-charts/BarChart'; // Import du BarChart
import { now } from 'moment';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import DashboardAlert from './DashboardAlert';
import AlertNotification from './AlertNotification';


const Statistique = () => {
  const [total,setTotal]=useState();
  const authToken = localStorage.getItem('authToken');
  const authRole = localStorage.getItem('authRole');
  const [demandes, setDemandes] = useState([]);
  const [demandeparstatut, setdemandeparstatut] = useState([]);
  const [services, setServices] = useState([]);
  const [statut, setStatut] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const[pieChart, setPieChart] = useState([]);
  const [valide, setValide] = useState([]);
  const [rejet, setRejet] = useState([]);
  const [ressource, setRessource] = useState([]);
  const [ressource_travaux, setRessource_travaux] = useState([]);
  const [travauxParMois, setTravauxParMois] = useState([]);

  const colors = [
    '#FF6F61', // Corail doux
    '#6B5B95', // Violet profond
    '#88B04B', // Vert olive clair
    '#F7CAC9', // Rose poudré
    '#92A8D1', // Bleu gris pervenche
    '#955251', // Marron prune
    '#B565A7', // Mauve vibrant
    '#009B77', // Vert émeraude
    '#DD4124', // Rouge tomate épicé
    '#45B8AC'  // Turquoise doux
  ];
  
  const mois = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const authRole = localStorage.getItem('authRole');
        const response = await fetch(`http://192.168.88.18:8080/api/v1/${authRole}/statistique/demande`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        setDemandes(data);
        console.log('demande',data);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    };
    const fetchStatutsDemandes = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const authRole = localStorage.getItem('authRole');
        const response = await fetch(`http://192.168.88.18:8080/api/v1/${authRole}/statistique/allstatutdemandes`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        setdemandeparstatut(data);
        console.log('demande:------',data);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    };

    const fetchStatuts = async () => {
      try {
       
        const response = await fetch(`http://192.168.88.18:8080/api/v1/${authRole}/statut`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        setStatut(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch('http://192.168.88.18:8080/api/v1/auth/services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
      }
    };
    const fetchRessources = async () => {
      try {
        const response = await fetch(`http://192.168.88.18:8080/api/v1/${authRole}/ressource`,{
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        setRessource(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
      }
    };
    const fetchRessourceTravaux = async () => {
      try {
        const response = await fetch(`http://192.168.88.18:8080/api/v1/${authRole}/ressource/travaux`,{
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        setRessource_travaux(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
      }
    };

    fetchDemandes();
    fetchServices();
    fetchStatuts();
    fetchRessources();
    fetchRessourceTravaux();
    fetchStatutsDemandes();
  }, [authRole, authToken]);

  useEffect(() => {
    const calculateDemandesParStatut = () => {
      const totalDemandes = demandeparstatut.length;
      const demandesParStatut = statut.map((status, index) => {
        let nombre = demandeparstatut.filter(demande => demande.statut.id === status.id).length;
    
        if (status.id === 7) {
          nombre=demandes.filter(demande => demande.statut.id === 7).length;
        }
        if (status.id === 8) {
          nombre=demandes.filter(demande => demande.statut.id === 8).length;
        }
        if (status.id === 9) {
          nombre=demandes.filter(demande => demande.statut.id === 9).length;
        }
        if (status.id === 10) {
          nombre=demandes.filter(demande => demande.statut.id === 10).length;
        }
    
        const percentage = nombre; // ((nombre / totalDemandes) * 100).toFixed(2);
        return { 
          id: status.id, 
          value: parseFloat(percentage), 
          label: status.description,
          color: colors[index % colors.length]
        };
      });
    
      setPieData(demandesParStatut);
    };
    
    const CalculRessourceTravaux = () => {
      
      // Calcul du budget total pour chaque ressource
      const barData = ressource.map((res) => {
        console.log('ressource:',res);
        // Filtrer les travaux qui correspondent à la ressource actuelle
        const travauxAssocies = ressource_travaux.filter(
          (restrav) => restrav.ressource.id === res.id
        );
    
        // Calculer le total du budget pour cette ressource
        const totalBudget = travauxAssocies.reduce(
          (acc, curr) => acc + curr.ressource.valeurUnitaire * curr.quantite,
          0
        );
    
        // Retourner un objet formaté pour le graphique
        return {
          name: res.nom,
          value: totalBudget,
        };
      });
    
      setBarData(barData);
      const totalGlobal = barData.reduce((acc, curr) => acc + curr.value, 0);
      setTotal(totalGlobal.toLocaleString('en-US'));
      
      // Mettre à jour l'état avec les nouvelles données
    };
    CalculRessourceTravaux();

    const CalculDemandeValide = () => {
      const totalDemandes = demandes.length;
      const demandesValides = demandes.filter(demande => demande.statut.id >=6 || demande.statut.id === 4).length;
      const validePercentage = ((demandesValides / totalDemandes) * 100).toFixed(2);
      const data={
          nombre:demandesValides,
          pourcentage:validePercentage
      };
      setValide(data);
      const demandesRejetees = demandes.filter(demande => demande.statut.id === 5).length;
      const rejetPercentage = ((demandesRejetees / totalDemandes) * 100).toFixed(2);
      const data1={
          nombre:demandesRejetees,
          pourcentage:rejetPercentage
      };
      setRejet(data1);
     
    };

    CalculDemandeValide();
    console.log('ressource travaux',ressource_travaux);
    console.log('bardata',barData);
    calculateDemandesParStatut();

    const getMonthsBetween = (start, end) => {
      const months = [];
      const startDate = new Date(start);
      const endDate = new Date(end);
    
      if (isNaN(startDate) || isNaN(endDate)) {
        console.error("Dates invalides :", { start, end });
        return months;
      }
    
      // Parcours chaque mois entre startDate et endDate
      while (startDate <= endDate) {
        // Formater comme 'Jan 2024'
        months.push(`${mois[startDate.getMonth()]} ${startDate.getFullYear()}`);
        // Passer au mois suivant
        startDate.setMonth(startDate.getMonth() + 1);
      }
    
      return months;
    };
    
    const mois = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const calculerTravauxParMois = () => {
      const travauxParMois = {};
    
      demandes.forEach((demande) => {
        let datedebut = demande.planification?.dateDebut
          ? new Date(demande.planification.dateDebut)
          : null;
        let datefin = demande.planification?.dateFin
          ? new Date(demande.planification.dateFin)
          : null;
    
        if (datedebut && datefin) {
          const moisEntre = getMonthsBetween(datedebut, datefin);
    
          moisEntre.forEach((moisAnnee) => {
            if (!travauxParMois[moisAnnee]) {
              travauxParMois[moisAnnee] = { cloturee: 0, terminee: 0, enCours: 0 };
            }
    
            if (demande.statut.id === 9) {
              travauxParMois[moisAnnee].enCours++;
              if (moisAnnee === moisEntre[moisEntre.length - 1]) {
                travauxParMois[moisAnnee].terminee++;
                travauxParMois[moisAnnee].cloturee++;
              }
            } else if (demande.statut.id === 8) {
              travauxParMois[moisAnnee].enCours++;
              if (moisAnnee === moisEntre[moisEntre.length - 1]) {
                travauxParMois[moisAnnee].terminee++;
              }
            } else if (demande.statut.id === 7) {
              travauxParMois[moisAnnee].enCours++;
            }
          });
        }
      });
    
      // Convertir en tableau, trier par mois et année
      const travauxParMoisArray = Object.entries(travauxParMois)
        .map(([monthYear, data]) => ({
          month: monthYear,
          ...data,
        }))
        .sort((a, b) => {
          const [monthA, yearA] = a.month.split(" ");
          const [monthB, yearB] = b.month.split(" ");
    
          const dateA = new Date(parseInt(yearA), mois.indexOf(monthA), 1);
          const dateB = new Date(parseInt(yearB), mois.indexOf(monthB), 1);
    
          return dateA - dateB;
        });
    
      setTravauxParMois(travauxParMoisArray);
    };
    
    
    calculerTravauxParMois();
    
  }, [demandes, services, statut]);

  const chartSetting = {
    xAxis: [
      {
        label: 'Nombre de demandes',
      },
    ],
    width: 1000,
    height: 500,
    margin: { left: 150 }, // Utilisation correcte des accolades pour définir un objet
  };

  useEffect(() => {
    const calculnombreDemandesParService = () => {
      const demandesParService = services.map((service) => {
        const count = demandes.filter((demande) => demande.service.id === service.id).length;
        return {
          name: service.nom, // Le nom du service
          value: count, // Nombre de demandes pour ce service
        };
      });
  
      setPieChart(demandesParService); // Pour un BarChart
    };
  
    if (services.length && demandes.length) {
      calculnombreDemandesParService();
    }
  }, [demandes, services]);
  
  
  return (
    <>
  
      <StatsHeader valide={valide} rejet={rejet} total={total} />

      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col>
          
            <Card className="bg-white">
              <CardHeader className="border-0 bg-default d-flex justify-content-between align-items-center">
                <h3 className="mb-0 text-white">Statistiques des demandes par statut</h3>
              </CardHeader>
              <CardBody>
                <PieChart
                  series={[
                    {
                      data: pieData,
                      //arcLabel: (item) => `${item.value}`,
                      arcLabelRadius: '60%',
                      colorByPoint: true,
                      getColor: (item, index) => pieData[index].color,
                    },
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fontWeight: 'bold',
                      fill: '#fff',
                    },
                  }}
                  width={1000}
                  height={400}
                />
              </CardBody>
            </Card>
            <hr />
            <Card className="mt-5 bg-white">
              <CardHeader className="border-0 bg-default d-flex justify-content-between align-items-center">
                <h3 className="mb-0 text-white">Valeur budgetaire  des ressources utilisées</h3>
              </CardHeader>
              <CardBody>
                <BarChart
                  dataset={barData}
                  
                  yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                  series={[{ dataKey: 'value', label: 'valeur en Ar' }]}
                  layout="horizontal"
                  {...chartSetting}
                />
              </CardBody>
            </Card>
            <Card className="mt-5 bg-white">
            <CardHeader className="border-0 bg-default d-flex justify-content-between align-items-center">
              <h3 className="mb-0 text-white">Statistiques des Travaux réalisés par Mois</h3>
            </CardHeader>
            <CardBody>
              <BarChart
                dataset={travauxParMois}
                xAxis={[{ scaleType: 'band', dataKey: 'month', label: 'Mois' }]}
                series={[
                  { dataKey: 'cloturee', label: 'Clôturée', color: '#1976D2' },
                  { dataKey: 'terminee', label: 'Terminée', color: '#388E3C' },
                  { dataKey: 'enCours', label: 'En Cours', color: '#FBC02D' },
                ]}
                width={1000}
                height={400}
                margin={{ left: 150 }}
                sx={{
                  [`.${axisClasses.left} .${axisClasses.label}`]: {
                    transform: 'translate(-20px, 0)',
                  },
                }}
              />
            </CardBody>
          </Card>
          <Card className="mt-5 bg-white">
  <CardHeader className="border-0 bg-default d-flex justify-content-between align-items-center">
    <h3 className="mb-0 text-white">Nombre de Demandes par Service</h3>
  </CardHeader>
  <CardBody style={{ overflowX: 'auto' }}>
  <BarChart
  dataset={pieChart} // Données calculées dans useEffect
  yAxis={[
    {
      scaleType: 'band',
      dataKey: 'name',
      label: '', // Pas d'étiquette pour l'axe des Y
    },
  ]}
  series={[
    { dataKey: 'value', label: 'Nombre de Demandes', color: '#1976D2' },
  ]}
  layout="horizontal" // Barres horizontales
  width={1200} // Largeur ajustable
  height={800} // Hauteur ajustable
  margin={{ left: 300 }} // Augmentez la marge gauche pour plus d'espace
  sx={{
    [`& .${axisClasses.left} .${axisClasses.label}`]: {
      // Supprimez ou ajustez la transformation de l'étiquette
      transform: 'none',
    },
  }}
/>

  </CardBody>
</Card>

          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Statistique;
