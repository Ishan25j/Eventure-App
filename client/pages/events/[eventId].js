import useRequest from "../../hooks/use-request";
import Router from "next/router";
const EventShow = ({ event }) => {

    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: { eventId: event.id },
        onSuccess: (order) =>  Router.push('/orders/[orderId]', `/orders/${order.id}`)
    });

    // console.log(event);

    return (
        <div>
            <h1>{event.name}</h1>
            <h3>{event.description}</h3>
            <h4>Event is on {new Date(event.date).getDate()}</h4>
            <h4>Ticket Left: {event.ticketsLeft}</h4>
            <h4>Price: {event.price}</h4>
            { errors }
            { event.ticketsLeft === 0 && <div class="alert alert-danger" role="alert"><center>Ticket Not Available 😔. <br/> Come after Sometime.</center></div>}
            <br/>
            <button onClick={() => doRequest()} className="btn btn-primary" disabled={event.ticketsLeft <= 0}>Purchase</button>
        </div>
    );
}

EventShow.getInitialProps = async (context, client) => {
    
    // * will get the ticketId from the params
    const { eventId } = context.query;

    const { data } = await client.get(`/api/events/${eventId}`);


    return { event: data };
}

export default EventShow;