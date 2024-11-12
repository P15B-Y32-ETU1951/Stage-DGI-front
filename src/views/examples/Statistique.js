import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Container, Row, Col } from 'reactstrap';
import Header from 'components/Headers/Header';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import StatsHeader from 'components/Headers/StatsHeader';
import { BarChart } from '@mui/x-charts/BarChart'; // Import du BarChart
import { now } from 'moment';
import { axisClasses } from '@mui/x-charts/ChartsAxis';


const Statistique = () => {
  const authToken = localStorage.getItem('authToken');
  const authRole = localStorage.getItem('authRole');
  const [demandes, setDemandes] = useState([]);
  const [services, setServices] = useState([]);
  const [statut, setStatut] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [valide, setValide] = useState([]);
  const [rejet, setRejet] = useState([]);
  const [ressource, setRessource] = useState([]);
  const [ressource_travaux, setRessource_travaux] = useState([]);
  const [travauxParMois, setTravauxParMois] = useState([]);

  const colors = [
    '#D32F2F', '#1976D2', '#388E3C', '#FBC02D', '#8E24AA',
    '#0088D1', '#C2185B', '#E91E63', '#FF5722', '#009688'
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
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/statistique/demande`, {
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

    const fetchStatuts = async () => {
      try {
       
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/statut`, {
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
        const response = await fetch('http://localhost:8080/api/v1/auth/services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
      }
    };
    const fetchRessources = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/ressource`,{
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
        const response = await fetch(`http://localhost:8080/api/v1/${authRole}/ressource/travaux`,{
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
  }, [authRole, authToken]);

  useEffect(() => {
    const calculateDemandesParStatut = () => {
      const totalDemandes = demandes.length;
      const demandesParStatut = statut.map((status, index) => {
        const nombre = demandes.filter(demande => demande.statut.id === status.id).length;
        const percentage = ((nombre / totalDemandes) * 100).toFixed(2);
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
      
      // Mettre à jour l'état avec les nouvelles données
    };
    CalculRessourceTravaux();

    const CalculDemandeValide = () => {
      const totalDemandes = demandes.length;
      const demandesValides = demandes.filter(demande => demande.statut.id >=6 || demande.statut.id === 4).length;
      const validePercentage = ((demandesValides / totalDemandes) * 100).toFixed(2);
      const data={
          nombre:totalDemandes,
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

    const calculerTravauxParMois = () => {
      const travauxParMois = mois.map((mois) => ({
        month: mois,
        cloturee: 0,
        terminee: 0,
        enCours: 0,
      }));
    
      const getMonthsBetween = (start, end) => {
        const months = [];
        const startDate = new Date(start);
        const endDate = new Date(end);
        
        if (isNaN(startDate) || isNaN(endDate)) {
          console.error("Dates invalides :", { start, end });
          return months;
        }
        
        while (startDate <= endDate) {
          months.push(startDate.getMonth()); // Ajoute le mois actuel (0-11)
          startDate.setMonth(startDate.getMonth() + 1);
      
          // Vérifie si le mois est le même que la date de fin
          if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
            months.push(startDate.getMonth()); // Ajoute le mois de la date de fin si non présent
            break;
          }
        }
        
        return months;
      };
      
    
      // Fonction pour vérifier et corriger le format des dates
      const parseDate = (dateStr) => {
        const parsedDate = Date.parse(dateStr);
        if (!isNaN(parsedDate)) {
          return new Date(parsedDate);
        } else {
          console.error("Format de date non supporté :", dateStr);
          return null;
        }
      };
    
      // Remplir les données
      demandes.forEach((demande) => {
        let moisIndex;
        let datedebut = null;
        let datefin = null;
    
        // Convertir les dates uniquement si elles existent
        if (demande.planification?.dateDebut) {
          datedebut = parseDate(demande.planification.dateDebut);
        }
    
        if (demande.planification?.dateFin) {
          datefin = parseDate(demande.planification.dateFin);
        }
    
        // Calculer les mois entre deux dates si les dates sont valides
        const moisIndices = datedebut && datefin ? getMonthsBetween(datedebut, datefin) : [];
    
        if (demande.statut.id === 9) {
          // Statut clôturée
          moisIndices.forEach((moisIndex) => {
            travauxParMois[moisIndex].enCours++;
            if (moisIndex === moisIndices[moisIndices.length - 1]) {
              travauxParMois[moisIndex].terminee++;
              travauxParMois[moisIndex].cloturee++;
              console.log('date de cloture:',moisIndices[moisIndices.length - 1],'demande',demande.motif);
              console.log('mois:',moisIndices,'id',demande.motif);
              if(demande.id===2402){
                console.log('date fin:',parseDate(demande.planification.dateFin),'demande date debut',parseDate(demande.planification.dateDebut),'demande date fin',parseDate(demande.planification.dateFin),'months:',getMonthsBetween(datedebut, datefin));
              }
            }
          });
        } else if (demande.statut.id === 8) {
          // Statut terminée
          if (datefin instanceof Date && !isNaN(datefin)) {
            moisIndices.forEach((moisIndex) => {
              travauxParMois[moisIndex].enCours++;
              if (moisIndex === moisIndices[moisIndices.length - 1]) {
                travauxParMois[moisIndex].terminee++;
              }
            });
          }
        } else if (demande.statut.id === 7) {
          // Statut en cours
          const moisInd = datedebut ? getMonthsBetween(datedebut, new Date()) : [];
          moisInd.forEach((moisIndex) => {
            travauxParMois[moisIndex].enCours++;
          });
        }
      });
    
      console.log("Travaux par mois :", travauxParMois);
      setTravauxParMois(travauxParMois);
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
  
  return (
    <>
      <StatsHeader valide={valide} rejet={rejet} />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col>
            <Card className="bg-white">
              <CardHeader className="bg-default border-0 d-flex justify-content-between align-items-center">
                <h3 className="text-white mb-0">Statistique des demandes par statut</h3>
              </CardHeader>
              <CardBody>
                <PieChart
                  series={[
                    {
                      data: pieData,
                      arcLabel: (item) => `${item.value}%`,
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
            <Card className="bg-white mt-5">
              <CardHeader className="bg-default border-0 d-flex justify-content-between align-items-center">
                <h3 className="text-white mb-0">Valeur budgetaire  des ressources utilisées</h3>
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
            <Card className="bg-white mt-5">
          <CardHeader className="bg-default border-0 d-flex justify-content-between align-items-center">
            <h3 className="text-white mb-0">Statistiques des Travaux par Mois</h3>
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
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Statistique;
