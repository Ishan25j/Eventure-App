import Head from 'next/head'
import Link from 'next/link'

const Home = ({ events, reqErr }) => {
  
  // * Handle Error
  if (events === undefined || reqErr) {
    return (
      <div className="handle-error">
        <center>
          <h1 style={{color: 'red', margin: '20rem auto'}}>Error: {reqErr.message}</h1>
        </center>
      </div>
    );
  }

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

  
  // * create card list of events
  const eventCard = events.map(event => {
    var dateObtained = event.date;
    if ( event.date[event.date.length - 1] === 'Z') {
      dateObtained = event.date.slice(0, -1);
    }
    if (event.ticketsLeft > 0 && (new Date(dateObtained) - new Date()) > 0) {
      return (
        <div className="col-sm events" key={event.id}>
          <Link href="/events/[eventId]" as={`/events/${event.id}`} key={event.id}>
            <div className="card" style={{'width': '18rem', 'minHeight': '20rem','margin': '1rem', 'borderRadius': '1rem' }}>
              <div className="card-body" style={{borderRadius: '1rem', border: 'none'}}>
                <h5 className="card-title">{event.name.length > 26 ?  (event.name.substring(0,21) + '...') : event.name }</h5>
                <hr/>
                <div className="card-text">
                  <p className="text-card"  >{ event.description.length > 250 ? (event.description.substring(0,250) + '...') : event.description }</p> 
                  <p className="ticketleft" style={Styles(event.ticketsLeft)}>Ticket Left: {event.ticketsLeft}</p>
                  <a className="btn btn-primary learnmore">LearnMore</a>
                </div>
              </div>
            </div>
          </Link>
          </div>
      )
    } 
  })

  // * search event
  function searchkey(search) {
    let filter = search.toUpperCase();
    let card = document.querySelectorAll(".card");
    for (let i = 0; i < card.length; i++) {
        let h5 = document.querySelectorAll("h5.card-title")[i];
        if (h5) {
            let textValueh = h5.textContent;
            if (textValueh.toUpperCase().indexOf(filter) > -1) {
                document.querySelectorAll(".card")[i].style.display = "";
            } else {
                document.querySelectorAll(".card")[i].style.display = "none";
            }
        }
    }
  }

  const Typed = (event) => {
    const value = event.target.value;
    searchkey(value);
  }


  // * Checking if there is some event exist
  var IsValid = true;
  const lenEvent = eventCard.length;
  var c = 0;
  for (let index = 0; index < lenEvent; index++) {
    if (eventCard[index] === undefined) {
      c++;
    }
  }

  if (c === lenEvent) {
    IsValid = false;
  }

  // * Rendering the page
  return (
    <div>
      <center>
        <div className="welcome-home">
          <span className="welcome-text">Welcome to Eventure</span>
          <span className="createdby">Made by <strong>Ishan Joshi</strong> - {new Date().getFullYear()}</span>
        </div>
      </center>
      <div className="container search-bar">
        <input 
        className="form-control search-input" 
        type="search" 
        onChange={Typed} 
        placeholder="Search Event Title"
        onChange={Typed}
        autoFocus
        />
        </div>
        <div className="container content">
          <div className="row">
                { events.length > 0 && eventCard }
          </div>
        { 
          (events.length <= 0 || !IsValid) && <div className="container no-event" ><br/><center>No Event Available. Try to Create One</center> <br/> <Link href="/events/new"><a className="btn btn-success">Create Event</a></Link> </div> 
        }
        {/* { 
          IsValid && <div className="container no-event" ><br/><center>No Event Available. Try to Create One</center> <br/> <Link href="/events/new"><a className="btn btn-success">Create Event</a></Link> </div> 
        } */}
        </div>
    </div>
  )
}


Home.getInitialProps = async (context, client, currentUser) => {

  try {
    const { data } = await client.get('/api/events');

    return { events: data };
    
  } catch (error) {

    console.log(error.message);
    return { reqErr: error.message };
  }
  
};

export default Home; 