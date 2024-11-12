/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

*/

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col,
  } from "reactstrap";
  // core components
import UserHeader from "components/Headers/UserHeader.js";
import { useEffect, useState } from "react";

const Profil = () => {
    const [userInfo, setUserInfo] = useState(null);  // userInfo is initialized as null
    const [loading, setLoading] = useState(true);   // Loading state
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('authToken'); 
            console.log(token," io le token"); 

            try {
                const response = await fetch('http://localhost:8080/api/v1/auth/userinfo', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                } else {
                    setError('Erreur lors de la récupération des informations utilisateur');
                }
            } catch (error) {
                setError('Erreur réseau ou problème de serveur');
            }

            setLoading(false);  // Stop loading
        };

        fetchUserInfo();
    }, []);

    const handleEditProfile = () => {
        // Logique de modification de profil (peut être redirigé vers une page de modification)
        console.log("Modification du profil...");
    };

    const handleLogout = () => {
        // Logique pour déconnecter l'utilisateur
        localStorage.removeItem('authToken');
        window.location.href = '/login';  // Rediriger vers la page de login
    };

    if (loading) {
        return (
            <>
                <UserHeader />
                <Container className="mt--7" fluid>
                    <Row className="justify-content-center">
                        <Col className="order-xl-2 mb-5 mb-xl-0" xl="8">
                            <div className="text-center">
                                <p>Chargement des informations...</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <UserHeader />
                <Container className="mt--7" fluid>
                    <Row className="justify-content-center">
                        <Col className="order-xl-2 mb-5 mb-xl-0" xl="8">
                            <div className="text-center">
                                <p>{error}</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }

    return (
        <>
            <UserHeader />
            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row className="justify-content-center">
                    <Col className="order-xl-2 mb-5 mb-xl-0" xl="8">
                        <Card className="card-profile shadow">
                            <Row className="justify-content-center">
                                <Col className="order-lg-2" lg="5">
                                    <div className="card-profile-image">
                                        <a href="#" onClick={(e) => e.preventDefault()}>
                                            <img
                                                alt="..."
                                                className="rounded-circle"
                                                src={require("../../assets/img/theme/DGI.png")}
                                            />
                                        </a>
                                    </div>
                                </Col>
                            </Row>
                            <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                                <div className="d-flex justify-content-between"></div>
                            </CardHeader>
                            <CardBody className="pt-0 pt-md-4">
                                <Row>
                                    <div className="col">
                                        <div className="card-profile-stats d-flex justify-content-center mt-md-5"></div>
                                    </div>
                                </Row>
                                <div className="text-center">
                                    <h3>
                                        {userInfo?.nom} {userInfo?.prenom}
                                    </h3>
                                    <div className="h5 font-weight-300">
                                        <i className="ni location_pin mr-2" />
                                        {userInfo?.email}
                                    </div>
                                    <div className="h5 mt-4">
                                        <i className="ni business_briefcase-24 mr-2" />
                                        {userInfo?.role}
                                    </div>
                                    {userInfo?.service && (
                                        <div className="h5 mt-2">
                                            <i className="ni education_hat mr-2" />
                                            {userInfo.service.nom}
                                        </div>
                                    )}
                                    <hr className="my-4" />
                                    
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Profil;
