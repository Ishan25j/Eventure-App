import useRequest from "../../hooks/use-request";
import Router from "next/router";
const EventShow = ({ event }) => {

    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: { eventId: event.id },
        onSuccess: (order) =>  Router.push('/orders/[orderId]', `/orders/${order.id}`)
    });

    // * set color red if ticket left is less than 5
    const Styles = (ticket) => {
        if (ticket < 5) {
          return {
            'color': 'red'
          }
        } else {
          return {
            'color': '#007bff'
          }
        }
      }

    return (
        <div className="container-fluid">
            <center>
                <h1>{event.name}</h1>
                <hr/>
                <p className="event-date">Event is on: <strong>{new Date(event.date).getDate()} - {new Date(event.date).getMonth()} - {new Date(event.date).getFullYear()}</strong></p>
                <p className="event-ticket" style={Styles(event.ticketsLeft)}>Ticket Left: {event.ticketsLeft}</p>
                <p className="event-price">To pay: <br/> <span className="event-price" style={{'color': 'green'}}>{event.price}$</span></p>
                { errors }
                { event.ticketsLeft === 0 && <div class="alert alert-danger" role="alert"><center>Ticket Not Available 😔. <br/> Come after Sometime.</center></div>}
                <button onClick={() => doRequest()} className="btn btn-primary purchase" disabled={event.ticketsLeft <= 0}>Purchase</button>
                <br/>
                <hr/>
            </center>
                <h3>Description:</h3>
                <p style={{'marginLeft': '5rem'}}> {event.description}</p>
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