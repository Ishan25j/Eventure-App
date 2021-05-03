import { useState } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/use-request";

const NewEvent = () => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [ticket, setTicket] = useState('');
    const [price, setPrice] = useState('');

    var clicked = false;

    const { doRequest, errors } = useRequest({
        url: '/api/events/new',
        method: 'post',
        body: {
          name, description, date, price, ticketLeft: ticket
        },
        // * On success, navigate user to root page
        onSuccess: (event) =>  Router.push('/')
      }) 

    const onSubmit = async event => {
        event.preventDefault();
        clicked = true;
        // * Calling a hook function for sending request
        doRequest();
    };

    return (
        <div className="container">
            <br/>
            <h1><center>Create Event</center></h1>
            <br/>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label for="name" className="form-label">Event Name:</label>
                    <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    placeholder="Event Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    />
                </div>
                <div className="mb-3">
                    <label for="description" className="form-label">Description:</label>
                    <textarea 
                    className="form-control" 
                    id="description" 
                    rows="3" 
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)} 
                    required
                    />
                </div>
                <div className="mb-3">
                    <label for="datetime" className="form-label">Date Time Picker:</label>
                    <br/>
                    <input 
                    type="datetime-local" 
                    id="datetime"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                    />
                </div>
                <div className="mb-3">
                    <label for="ticket" className="form-label">Total Tickets:</label>
                    <br/>
                    <input 
                    type="number" 
                    id="ticket" 
                    placeholder="Total Ticket"
                    value={ticket}
                    onChange={e => setTicket(e.target.value)} 
                    required
                    />
                </div>
                <div className="mb-3">
                    <label for="price" className="form-label">Price:</label>
                    <br/>
                    <input 
                    type="number" 
                    id="price" 
                    placeholder="price"
                    value={price}
                    onChange={e => setPrice(e.target.value)} 
                    required
                    />
                </div>
            { errors && <div className="alert alert-danger" role="alert">{errors}</div>}
            <button type="submit" className="btn btn-primary" disabled={clicked} >Submit</button>
            </form>
        </div>
     );
}
 
export default NewEvent;