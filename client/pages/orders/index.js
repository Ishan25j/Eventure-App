import Router from 'next/router';

const OrderIndex = ({ orders }) => {

    const Pay = (order) => {
      Router.push('/orders/[orderId]', `/orders/${order.id}`)
      console.log(order);
    }

    console.log(orders);

    return (
      <ul className="list-group">
        { orders.length === 0 && <h3>No Orders are availbale to show here.</h3> }
        {orders.map((order) => {
          return (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={order.id}>
              Event Name:{order.event.name}
              Order Status: {order.status}
              { order.status !== 'cancelled' && <button className="btn btn-primary" onClick={() => Pay(order)} >Pay</button>}
            </li>
          );
        })}
      </ul>
    );
};
  
OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');
  
    return { orders: data };
};
  
export default OrderIndex;