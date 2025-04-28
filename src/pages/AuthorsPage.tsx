import React from 'react';
import AuthorList from '../components/AuthorList';

const AuthorsPage: React.FC = () => {
    console.log('rendered')
    return (
        <div>
            <h2>Authors</h2>
            <AuthorList />
        </div>
    );
};

export default AuthorsPage;
