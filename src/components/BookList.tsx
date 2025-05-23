import React, {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {List, InputNumber, Button, Spin, Alert} from 'antd';
import {fetchBooks} from '../api/bookAPI';
import {Book} from '../types';
import styles from './BookList.module.scss';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from "../hooks/useAuth";

const BookList: React.FC = () => {
    const {isAdmin} = useAuth();
    const navigate = useNavigate();


    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

    const {data, isLoading, error, refetch} = useQuery<Book[], Error>(
        ['books', {minPrice, maxPrice}],
        () => fetchBooks(minPrice, maxPrice),
        {keepPreviousData: true}
    );

    const handleMinPriceChange = (value: number | null) => {
        setMinPrice(value === null ? undefined : value);
        refetch();
    };

    const handleMaxPriceChange = (value: number | null) => {
        setMaxPrice(value === null ? undefined : value);
        refetch();
    };

    if (isLoading) return <Spin tip="Loading books..."/>;
    if (error) return <Alert message="Error fetching books" type="error"/>;

    return (
        <div className={styles.bookList}>
            <div style={{marginBottom: '1rem'}}>
                <Link to="/books/create">
                    <Button type="primary">Create Book</Button>
                </Link>
            </div>
            <div className={styles.filters}>
                <InputNumber
                    placeholder="Min Price"
                    min={0}
                    value={minPrice}
                    onChange={handleMinPriceChange}
                />
                <InputNumber
                    placeholder="Max Price"
                    min={0}
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    style={{marginLeft: '1rem'}}
                />
            </div>
            <List
                bordered
                dataSource={data}
                renderItem={(book) => (
                    <List.Item key={book.id}>
                        {
                            book?.quantity > 0 ? (
                                isAdmin() ? (
                                    <span style={{color: '#1677ff', cursor: 'pointer'}} onClick={() => navigate(`/books/${book.id}`)}>
                                        {book.title} - {book.price.toFixed(0)}$ {'     '}
                                        {book?.quantity} left
                                    </span>
                                ) : (
                                    <span style={{color: '#1677ff', cursor: 'pointer'}} onClick={() => navigate('/orders/create', {state: {book: book}})}>
                                        {book.title} - {book.price.toFixed(0)}$ {'     '}
                                        {book?.quantity} left
                                    </span>
                                )
                            ) : (
                                <><span style={{color: 'grey'}}>{book.title}</span> <span style={{color: 'red'}}>SOLD OUT</span></>
                            )
                        }

                    </List.Item>
                )}
                style={{marginTop: '1rem'}}
            />
        </div>
    );
};

export default BookList;
