import Head from 'next/head'
import Link from 'next/link'

const Home = ({ events }) => {
  
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
    if (event.ticketsLeft > 0) {
      return (
        <div className="col-sm events" key={event.id}>
          <Link href="/events/[eventId]" as={`/events/${event.id}`} key={event.id}>
            <div className="card" style={{'width': '18rem', 'minHeight': '20rem','margin': '1rem' }}>
              <div className="card-body">
                <h5 className="card-title">{event.name}</h5>
                <hr/>
                <div className="card-text">
                  <p className="text">{ event.description.length > 100 ? (event.description.substring(0,100) + '...') : event.description }</p> 
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

  
  
  return (
    <div>
      <center>
        <div className="container-fluid welcome-home">
          <span className="welcome-text">Welcome to Eventure</span> 
        </div>
      </center>
      <div className="container">
        <br/>
        <input 
        className="form-control" 
        type="search" 
        onChange={Typed} 
        placeholder="Search Event Title"
        onChange={Typed}
        autoFocus
        />
        <div className="row">
              { events.length > 0 && eventCard }
        </div>
      { 
      events.length <= 0 && <div className="container no-event" ><center>No Event Available. Try to Create One</center> <br/> <Link href="/events/new"><a className="btn btn-success">Create Event</a></Link> </div> 
      }
      </div>
      <div className="space"></div>
    </div>
  )
}


Home.getInitialProps = async (context, client, currentUser) => {

  const { data } = await client.get('/api/events');
  
  return { events: data };
};

export default Home; 