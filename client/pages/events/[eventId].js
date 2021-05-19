import useRequest from "../../hooks/use-request";
import Router from "next/router";
import { useEffect, useState } from "react";

import { io } from "socket.io-client";

function useSocket(url) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketIo = io(url, { reconnection: true })

    setSocket(socketIo)

    function cleanup() {
      socketIo.disconnect()
    }
    return cleanup

    // should only run once and not on every re-render,
    // so pass an empty array
  }, [])

  return socket
}

const EventShow = ({ getEvent, reqErr, currentUser }) => {

  const socket = useSocket();
  const [event, setEvent] = useState(getEvent);

  useEffect(() => {
    if (getEvent) {
      setEvent(getEvent);
    }
  }, []);

  // * Handle Error
  if (event === undefined || reqErr) {
    return (
      <div className="handle-error">
        <center>
          <h1 style={{color: 'red', margin: '20rem 5rem'}}> Can't Load page <br /> Error {reqErr && reqErr.message}</h1>
        </center>
      </div>
    );
  }

  useEffect(() => {
    if (socket) {
      socket.on('event', data => {
        setEvent(data);
      })
    }
  }, [socket]);

  // * If user is not logged In
  if (currentUser === undefined || currentUser === null) {
    setTimeout(() => {Router.push('/')}, 2000); 
    return (
      <div style={{marginTop: '5rem', color: 'red', fontSize: 'larger'}}>
        <center>
          Please Logged In first to purchase this ticket
        </center>
      </div>
    )
  }

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
        'color': 'red',
        'fontSize': 'x-large'
      }
    } else {
      return {
        'color': 'rgb(68 158 255)',
        'fontSize': 'x-large'
      }
    }
  }

  // * To validate event date
  var dateObtained = event.date;
  if ( event.date[event.date.length - 1] === 'Z') {
    dateObtained = event.date.slice(0, -1);
  }
  const dateValid = (new Date(dateObtained) - new Date())/1000 - (10*60) > 0

  return (
      <div className="container-fluid">
          <center>
              <h1>{event.name}</h1>
              <hr/>
              <div className="event-date">
                Event is on : <strong>{new Date(event.date).getUTCDate()} - {new Date(event.date).getMonth()} - {new Date(event.date).getFullYear()}</strong> 
                <br />
                At :  <strong>{new Date(event.date).getUTCHours()} hours: {new Date(event.date).getUTCMinutes()} minutes</strong>
              </div>
              <p className="event-ticket" style={Styles(event.ticketsLeft)}>Ticket Left: {event.ticketsLeft}</p>
              <p className="event-price">To pay: <br/> <span className="event-price" style={{'color': 'green'}}>$ {event.price}</span></p>
              { errors }
              { event.ticketsLeft === 0 && <div class="alert alert-danger" role="alert"><center>Ticket Not Available 😔. <br/> Come after Sometime.</center></div>}
              { !dateValid && <div class="alert alert-warning" role="alert"><center>Ticket can't be Bought before 10 mintues of a event 😔.</center></div>}
              <br/>
              <button onClick={() => doRequest()} className="btn btn-primary purchase" disabled={event.ticketsLeft <= 0 || !dateValid}>Purchase</button>
              <br/>
              <hr/>
          </center>
              <h3>Description:</h3>
              <p className="event-description"> {event.description}</p>
      </div>
  );
}

EventShow.getInitialProps = async (context, client) => {
    
    // * will get the ticketId from the params
    const { eventId } = context.query;

    try {
      
      const { data } = await client.get(`/api/events/${eventId}`);
      return { getEvent: data };

    } catch (error) {

      console.log(error.message);
      return { reqErr: error.message };
    }
}

export default EventShow;