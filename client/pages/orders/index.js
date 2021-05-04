import Router from 'next/router';

const OrderIndex = ({ orders }) => {

    const Pay = (order) => {
      Router.push('/orders/[orderId]', `/orders/${order.id}`)
      console.log(order);
    }

    const Sell = (order) => {
      Router.push('/orders/sell/[orderId]', `/orders/sell/${order.id}`)
    }

    orders.reverse();

    const payedOrders = orders.filter((order) => {
        return order.status === 'complete'
    });
    
    const pendingOrders = orders.filter((order) => {
        return order.status === 'created';
    });

    const Styles = (status) => {
      if (status === 'created') {
        return {
          'color': 'red'
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
        {payedOrders.length > 0 && <h1 className="order-title"> Purchased Ticket:</h1>}
        <ul className="list-group container">
          {payedOrders.map((order) => {
            return (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={order.id}>
                <h6>Event: <span className="event-name-order">{order.event.name}-{order.event.id}</span></h6>
                <p>Event on: <span className="event-status-order">{new Date(order.event.date).getDate()} - {new Date(order.event.date).getMonth()} - {new Date(order.event.date).getFullYear()}</span></p>
                <br/>
                <p>Order Status: <span style={Styles(order.status)}>{order.status}</span></p>
                { order.status === 'complete' && <button className="btn btn-primary" onClick={() => Sell(order)} >Sell</button>}
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
            return (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={order.id}>
              <h6 >Event: <span className="event-name-order">{order.event.name}-{order.event.id}</span></h6>
                <br/>
                <p>Order Status: <span style={Styles(order.status)}>{order.status}</span></p>
              </li>
            );
          })}
        </ul>
        {/* <div className="space"></div> */}
      </div>
    );
};
  
OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');
  
    return { orders: data };
};
  
export default OrderIndex;