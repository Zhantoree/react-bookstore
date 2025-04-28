// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Button } from 'antd';
import AuthorsPage from './pages/AuthorsPage';
import AuthorCreatePage from './pages/AuthorCreatePage';
import AuthorDetailPage from './pages/AuthorDetailPage';
import BooksPage from './pages/BooksPage';
import BookCreatePage from './pages/BookCreatePage';
import BookDetailPage from './pages/BookDetailPage';
import OrdersPage from './pages/OrdersPage';
import OrderCreatePage from './pages/OrderCreatePage';
import OrderDetailPage from './pages/OrderDetailPage';
import './App.scss';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
    return (
        <Router>
            <Layout>
                <Header style={headerStyle}>
                    <div style={titleStyle}>Bookstore</div>
                    <div style={navStyle}>
                        <Link to="/authors">
                            <Button type="link" style={linkButtonStyle}>Authors</Button>
                        </Link>
                        <Link to="/books">
                            <Button type="link" style={linkButtonStyle}>Books</Button>
                        </Link>
                        <Link to="/orders">
                            <Button type="link" style={linkButtonStyle}>Orders</Button>
                        </Link>
                    </div>
                </Header>
                <Content style={{ padding: '2rem' }}>
                    <Routes>
                        {/* Authors */}
                        <Route path="/authors" element={<AuthorsPage />} />
                        <Route path="/authors/create" element={<AuthorCreatePage />} />
                        <Route path="/authors/:id" element={<AuthorDetailPage />} />

                        {/* Books */}
                        <Route path="/books" element={<BooksPage />} />
                        <Route path="/books/create" element={<BookCreatePage />} />
                        <Route path="/books/:id" element={<BookDetailPage />} />

                        {/* Orders */}
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/orders/create" element={<OrderCreatePage />} />
                        <Route path="/orders/:id" element={<OrderDetailPage />} />

                        {/* Fallback */}
                        <Route path="*" element={<AuthorsPage />} />
                    </Routes>
                </Content>
            </Layout>
        </Router>
    );
};

// Inline styles for custom header
const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#072747',
    padding: '0 1rem'
};

const titleStyle: React.CSSProperties = {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold'
};

const navStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem'
};

const linkButtonStyle: React.CSSProperties = {
    color: '#fff',
    fontSize: '1rem',
    padding: 0
};

export default App;
