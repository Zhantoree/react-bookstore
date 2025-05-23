import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Layout, Button } from 'antd';

// Pages
import AuthorsPage from './pages/AuthorsPage';
import AuthorCreatePage from './pages/AuthorCreatePage';
import AuthorDetailPage from './pages/AuthorDetailPage';
import BooksPage from './pages/BooksPage';
import BookCreatePage from './pages/BookCreatePage';
import BookDetailPage from './pages/BookDetailPage';
import OrdersPage from './pages/OrdersPage';
import OrderCreatePage from './pages/OrderCreatePage';
import OrderDetailPage from './pages/OrderDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import {useAuth} from "./hooks/useAuth";
import {AuthProvider} from "./wrappers/AuthProvider";

// Styles
const { Header, Content } = Layout;
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' };
const titleStyle = { color: 'white', fontSize: '1.5rem', fontWeight: 'bold' };
const navStyle = { display: 'flex' };
const linkButtonStyle = { color: 'white' };

const AppContent: React.FC = () => {
    const { isAuthenticated, isAdmin, logout, user } = useAuth();

    return (
        <Router>
            <Layout>
                <Header style={headerStyle}>
                    <div style={titleStyle}>Bookstore Almaz Zhantore</div>
                    <div style={navStyle}>
                        {isAuthenticated ? (
                            <>
                                <Link to="/books">
                                    <Button type="link" style={linkButtonStyle}>Books</Button>
                                </Link>
                                {isAdmin() && (
                                    <>
                                        <Link to="/authors">
                                            <Button type="link" style={linkButtonStyle}>Authors</Button>
                                        </Link>
                                        <Link to="/orders">
                                            <Button type="link" style={linkButtonStyle}>Orders</Button>
                                        </Link>
                                    </>
                                )}
                                {!isAdmin() && (
                                    <Link to="/orders">
                                        <Button type="link" style={linkButtonStyle}>My Orders</Button>
                                    </Link>
                                )}
                                <Button
                                    type="link"
                                    style={linkButtonStyle}
                                    onClick={logout}
                                >
                                    Logout ({user?.username})
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button type="link" style={linkButtonStyle}>Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button type="link" style={linkButtonStyle}>Register</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </Header>
                <Content style={{ padding: '2rem' }}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />

                        {/* Books - Accessible to all authenticated users */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/books" element={<BooksPage />} />
                            <Route path="/books/:id" element={<BookDetailPage />} />
                            <Route path="/orders/create" element={<OrderCreatePage />} />
                            <Route path="/orders/:id" element={<OrderDetailPage />} />
                            <Route path="/orders" element={<OrdersPage />} />
                        </Route>

                        {/* Admin Only Routes */}
                        <Route element={<ProtectedRoute requireAdmin={true} />}>
                            <Route path="/authors" element={<AuthorsPage />} />
                            <Route path="/authors/create" element={<AuthorCreatePage />} />
                            <Route path="/authors/:id" element={<AuthorDetailPage />} />
                            <Route path="/books/create" element={<BookCreatePage />} />
                        </Route>

                        {/* Redirects */}
                        <Route path="/" element={<Navigate to="/books" replace />} />
                        <Route path="*" element={<Navigate to="/books" replace />} />
                    </Routes>
                </Content>
            </Layout>
        </Router>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
