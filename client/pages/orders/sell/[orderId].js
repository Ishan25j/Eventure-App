import useRequest from "../../../hooks/use-request";
import Router from "next/router";
const OrderSell = ({ order }) => {

    const { doRequest, errors } = useRequest({
        url: '/api/orders/sell',
        method: 'post',
        body: { orderId: order.id },
        onSuccess: () =>  Router.push('/orders/')
    });

    console.log(order);

    return (
        <div className="container-fluid">
            <center>
                <h1>Are you sure you want to sell <strong>{order.event.name}'s</strong> event ticket</h1>
                <hr/>
                <p>Event is on: <strong>{new Date(order.event.date).getDate()} - {new Date(order.event.date).getMonth()} - {new Date(order.event.date).getFullYear()}</strong></p>
                { errors }
                <br/>
                <button onClick={() => doRequest()} className="btn btn-danger purchase" >Sell</button>
                <button onClick={() => Router.push('/orders/')} className="btn btn-success purchase" >Cancel</button>
            </center>
        </div>
    );
}

OrderSell.getInitialProps = async (context, client) => {
    
    // * will get the ticketId from the params
    const { orderId } = context.query;

    const { data } = await client.get(`/api/orders/${orderId}`);


    return { order: data.order };
}

export default OrderSell;