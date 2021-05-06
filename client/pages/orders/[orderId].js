import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, reqErr, env, currentUser }) => {

    // * Handle Error
    if (order === undefined || reqErr) {
      return (
        <div className="handle-error">
          <center>
            <h1 style={{color: 'red', margin: '20rem auto'}}>{reqErr.message}</h1>
          </center>
        </div>
      );
    }

    const [timeLeft, setTimeLeft] = useState(0);
    const [success, setSuccess] = useState(false);

    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
        orderId: order.id,
        },
        onSuccess: () => { setSuccess(true); setTimeout(() => {Router.push('/')}, 2000) }
  });

  // * See the formate of the given date
  var dateObtained = order.event.date;
  if ( order.event.date[order.event.date.length - 1] === 'Z') {
    dateObtained = order.event.date.slice(0, -1);
  }

  // * can't pay money before 10 mintues of the event timing
  if ((new Date(dateObtained) - new Date())/1000 - (10*60) < 0) {
    return (
        <div className="container-fluid">
        <center>
            <h1>Ticket for <strong>{order.event.name}'s</strong> event is expired</h1>
            <h2>Redirecting to Home Page</h2>
            {
                setTimeout(() => {
                    Router.push('/');
                },2000)
            }
        </center>
    </div>
    )
  }

  // * To setting a timer to pay in required time
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

  // * If Time is over than got to home page
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
        {
          !success
          ?
          <div>
            <h1 style={{'margin': '10rem', 'color': '#007bff'}}>
              Time left to pay: {timeLeft} seconds
            </h1>  
            <StripeCheckout
              token={({ id }) => doRequest({ token: id })}
              stripeKey={env}
              amount={order.event.price * 100}
              email={currentUser.email}
            />
          </div>
          :
          <h1 style={{'margin': '10rem', 'color': '#007bff'}}>Payment SuccessFull 😃</h1>
        }

        {errors}
      </center>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  try {
    const { data } = await client.get(`/api/orders/${orderId}`); 
    
    return { order: data.order, env: data.env };

  } catch (error) {
    
    console.log(error.message);
    return { reqErr: error.message };
  }

};

export default OrderShow;
