import Router from 'next/router';

const OrderIndex = ({ orders, reqErr }) => {

  // * Handle Error
  if (orders === undefined || reqErr) {
    return (
      <div className="handle-error">
        <center>
          <h1 style={{color: 'red', margin: '20rem auto'}}> Can't Load page <br /> Error {reqErr.message}</h1>
        </center>
      </div>
    );
  }

  const Pay = (order) => {
    Router.push('/orders/[orderId]', `/orders/${order.id}`)
  }

  const Sell = (order) => {
    Router.push('orders/sell/[orderId]', `orders/sell/${order.id}`)
  }

  orders.reverse();

  const payedOrders = orders.filter((order) => {
    var dateObtained = order.event.date;
    if ( order.event.date[order.event.date.length - 1] === 'Z') {
      dateObtained = order.event.date.slice(0, -1);
    }
    return ((order.status === 'complete') && (new Date(dateObtained) - new Date()) > 0)
  });
  
  const pendingOrders = orders.filter((order) => {
      return order.status === 'created';
  });


  const Styles = (status) => {
    if (status === 'created') {
      return {
        'color': 'yellow'
      }
    } 
    if (status === 'complete'){
      return {
        'color': 'green'
      }
    }
    if (status === 'cancelled'){
      return {
        'color': 'red'
      }
    }
  }

  return (
    <div>
      {payedOrders.length > 0 && <h1 className="order-title"> Purchased Tickets:</h1>}
      <ul className="list-group container">
        {payedOrders.map((order) => {
          return (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={order.id}>
              <h6>Event: <span className="event-name-order">{order.event.name}-{order.event.id}</span></h6>
              <p>Event on: <span className="event-status-order">{new Date(order.event.date).getUTCDate()} - {new Date(order.event.date).getMonth()} - {new Date(order.event.date).getFullYear()}</span></p>
              <br/>
              <p>Order Status: <span style={Styles(order.status)}>{order.status}</span></p>
              { (order.status === 'complete' && new Date(order.event.date) >= new Date()) && <button className="btn btn-primary" onClick={() => Sell(order)} >Sell</button>}
            </li>
          );
        })}
      </ul>
      { pendingOrders.length > 0 && <h1 className="order-title">Pending Payments:</h1>}
      <ul className="list-group container">
        {pendingOrders.map((order) => {
          return (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={order.id}>
            <h6 >Event: <span className="event-name-order">{order.event.name}-{order.event.id}</span></h6>
              <br/>
              <p>Order Status: <span style={Styles(order.status)}>{order.status}</span></p>
              { (order.status !== 'cancelled' && order.status !== 'complete') && <button className="btn btn-primary" onClick={() => Pay(order)} >Pay</button>}
            </li>
          );
        })}
      </ul>
      <h1 className="order-title">Order Logs:</h1>
      <ul className="list-group container">
        { orders.length === 0 && <h3>No Orders are availbale to show here.</h3> }
        {orders.map((order) => {
          // * uncomment for debugging
          // console.log(order.event.name , new Date(order.event.date.slice(0,-1)), new Date(),(new Date(order.event.date.slice(0,-1)) - new Date())/1000);
          return (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={order.id}>
              <h6 >Event: <span className="event-name-order">{order.event.name}-{order.event.id}</span></h6>
              <br/>
              <p>Order Status: <span style={Styles(order.status)}>{order.status}</span></p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
  
OrderIndex.getInitialProps = async (context, client) => {

  try {
    const { data } = await client.get('/api/orders');

    return { orders: data };

  } catch (error) {

    console.log(error.message);
    return { reqErr: error.message };
  }

};
  
export default OrderIndex;