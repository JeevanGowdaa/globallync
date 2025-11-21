import { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Link, useNavigate } from 'react-router-dom';

const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const { login, loading, error, token, user } = useAuth();

    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            // Do not rely on the admin checkbox for routing — always login normally
            // and route based on the returned user's role. The checkbox is optional
            // and can be used to force-admin-only login if desired.
            const loggedUser = await login(email, password);

            // If login returned a user, navigate immediately based on role
            if (loggedUser) {
                navigate(loggedUser.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
                return;
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (token && user) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-600">GlobalRemit</h1>
                    <p className="mt-2 text-gray-500">
                        {isAdmin ? 'Admin Login' : 'Securely log in to your account'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md" role="alert">
                            {error}
                        </div>
                    )}
                    
                    {/* Admin Mode Toggle */}
                    <div className="flex items-center justify-center p-3 bg-gray-50 rounded-md border border-gray-200">
                        <input
                            id="admin-toggle"
                            type="checkbox"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="admin-toggle" className="ml-2 text-sm text-gray-700">
                            Login as Admin (optional — routing is determined by account role)
                        </label>
                    </div>

                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Demo Credentials Info */}
                    <div className="p-3 text-xs text-gray-600 bg-blue-50 rounded-md border border-blue-100">
                        <p className="font-semibold mb-1">Demo Credentials:</p>
                        <p>User: user@example.com / password123</p>
                        <p>Admin: admin@example.com / admin123</p>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {loading && <Spinner />}
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;