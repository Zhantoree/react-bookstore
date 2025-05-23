import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { List, Input, Button, Spin, Alert } from 'antd';
import { fetchAuthors } from '../api/authorAPI';
import { Author } from '../types';
import styles from './AuthorList.module.scss';
import { Link } from 'react-router-dom';

const { Search } = Input;

const AuthorList: React.FC = () => {
    const [lastName, setLastName] = useState<string | undefined>(undefined);

    const { data, isLoading, error, refetch } = useQuery<Author[], Error>(
        ['authors', { lastName }],
        () => fetchAuthors(lastName),
        {
            keepPreviousData: true,
            retry: false,
        }
    );

    const handleSearch = (value: string) => {
        setLastName(value);
        refetch();
    };

    if (isLoading) return <Spin tip="Loading authors..." />;
    if (error && error.status !== 404) return <Alert message="Error fetching authors" type="error" />;

    return (
        <div className={styles.authorList}>
            <div style={{ marginBottom: '1rem' }}>
                <Link to="/authors/create">
                    <Button type="primary">Create Author</Button>
                </Link>
            </div>
            <Search
                placeholder="Search by last name"
                enterButton="Search"
                onSearch={handleSearch}
                style={{ marginBottom: '1rem', maxWidth: '300px' }}
            />
            <List
                bordered
                dataSource={data || []}
                renderItem={(author) => (
                    <List.Item key={author.id}>
                        <Link to={`/authors/${author.id}`}>
                            {author.firstName} {author.lastName}
                        </Link>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default AuthorList;
