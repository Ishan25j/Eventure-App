import { useState } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/use-request";
import Link from 'next/link';

const NewEvent = ({ currentUser }) => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [ticket, setTicket] = useState('');
    const [price, setPrice] = useState('');

    var clicked = false;

    if (!currentUser) {
        clicked = true
    }

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
            <h1 style={{'color': 'white'}}><center>Create Event</center></h1>
            <br/>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <p className="form-label">Event Name:</p>
                    <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    placeholder="Event Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    autoFocus
                    />
                </div>
                <div className="mb-3">
                    <p className="form-label">Description:</p>
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
                    <p className="form-label">Date and Time for Event:</p>
                    <input 
                    type="datetime-local" 
                    id="datetime"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                    />
                </div>
                <div className="mb-3">
                    <p className="form-label">Total Tickets:</p>
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
                    <p className="form-label">Price:</p>
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
            { 
                !currentUser && (
                    <div>
                        <div className="alert alert-danger" role="alert">You have not logged In</div>
                        <Link href="/auth/signup">
                            <button className="btn btn-success signup">Sign Up</button>
                        </Link> 
                        <Link href="/auth/signin">
                            <button className="btn btn-success signin">Sign In</button>
                        </Link> 
                    </div>
                )
            }
            <br/>
            <button type="submit" className="btn btn-primary" disabled={clicked} >Submit</button>
            </form>
        </div>
     );
}
 
export default NewEvent;