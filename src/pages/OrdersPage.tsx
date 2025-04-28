import React from 'react';
import OrderList from '../components/OrderList';

const OrdersPage: React.FC = () => {
    return (
        <div>
            <h2>Orders</h2>
            <OrderList />
        </div>
    );
};

export default OrdersPage;
