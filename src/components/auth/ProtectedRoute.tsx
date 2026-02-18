import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../interfaces/user';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: UserRole | UserRole[];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!user || !roles.includes(user.role)) {
            // Redirect to appropriate dashboard if role is not allowed
            const isSuperAdmin = ['super_admin', 'superadmin', 'Super Admin', 'admin_majelis'].includes(user?.role || '');
            const redirectPath = isSuperAdmin ? '/super-admin' : '/admin';
            return <Navigate to={redirectPath} replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
