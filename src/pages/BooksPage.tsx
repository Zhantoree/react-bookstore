import React from 'react';
import BookList from '../components/BookList';

const BooksPage: React.FC = () => {
    return (
        <div>
            <h2>Books</h2>
            <BookList />
        </div>
    );
};

export default BooksPage;
