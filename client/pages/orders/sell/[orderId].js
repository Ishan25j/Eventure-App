import useRequest from "../../../hooks/use-request";
import Router from "next/router";
const OrderSell = ({ order, reqErr, currentUser }) => {

    // * Handle Error
    if (order === undefined || reqErr) {
        return (
            <div className="handle-error">
              <center>
                <h1 style={{color: 'red', margin: '20rem auto'}}> Can't Load page <br /> Error {reqErr.message}</h1>
              </center>
            </div>
        );
    }

        // * If user is not logged In
    if (currentUser === undefined || currentUser === null) {
        setTimeout(() => {Router.push('/')}, 2000); 
        return (
        <div style={{marginTop: '5rem', color: 'red', fontSize: 'larger'}}>
            <center>
            Please Logged In first to sell this ticket
            </center>
        </div>
        )
    }

    const { doRequest, errors } = useRequest({
        url: '/api/orders/sell',
        method: 'post',
        body: { orderId: order.id },
        onSuccess: () =>  Router.push('/orders/')
    });

    // * See the formate of the given date
    var dateObtained = order.event.date;
    if ( order.event.date[order.event.date.length - 1] === 'Z') {
      dateObtained = order.event.date.slice(0, -1);
    }

    // * before 10 min.. no one can purchase ticket
    if ((new Date(dateObtained) - new Date())/1000 - (10*60) < 0) {
        return (
            <div className="container-fluid">
            <center>
                <h1>Event: <strong>{order.event.name}'s</strong> ticket cant be bought before 10 min.. of the event</h1>
                <h2>Redirecting to Home Page</h2>
                {
                    setTimeout(() => {
                        Router.push('/');
                    },1000)
                }
            </center>
        </div>
        )
    }

    return (
        <div className="container-fluid">
            <center>
                <h1>Are you sure you want to sell <strong style={{'color': 'red'}}>{order.event.name}'s</strong> event ticket ?</h1>
                <hr/>
                <p>Event is on: <strong>{new Date(order.event.date).getUTCDate()} - {new Date(order.event.date).getUTCMonth()} - {new Date(order.event.date).getFullYear()}</strong></p>
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

    try {
        const { data } = await client.get(`/api/orders/${orderId}`);
        
        return { order: data.order };

    } catch (error) {
        
        console.log(error.message);
        return {reqErr: error.message};
    }

}

export default OrderSell;