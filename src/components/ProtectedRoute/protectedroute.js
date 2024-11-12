import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('authToken'); // Vérifie si l'utilisateur est authentifié

    return isAuthenticated ? element : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
