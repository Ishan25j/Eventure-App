import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, env, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
        orderId: order.id,
        },
        onSuccess: () => Router.push('/')
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {

    Router.push('/orders/');
    
    return (
      <div>
        <h1 
        style={{'textAlign': 'center', 'color': 'red', 'margin': '10rem'}}>
          Order Expired
        </h1>
      </div>
    );
  }

  return (
    <div>
      <center>
        <h1 style={{'margin': '10rem', 'color': '#007bff'}}>
          Time left to pay: {timeLeft} seconds
        </h1>  
        <StripeCheckout
          token={({ id }) => doRequest({ token: id })}
          stripeKey={env}
          amount={order.event.price * 100}
          email={currentUser.email}
        />
        {errors}
      </center>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data.order, env: data.env };
};

export default OrderShow;
