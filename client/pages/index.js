import Head from 'next/head'
import Link from 'next/link'

const Home = ({ events }) => {
  
  
  if (events.length > 0) {
    const eventCard = events.map(event => {
      if (event.ticketsLeft > 0) {
        return (
          <Link href="/events/[eventId]" as={`/events/${event.id}`}>
            <div className="col-sm events" key={event.id}>
              <div className="card" style={{'width': '18rem', 'minHeight': '20rem','margin': '1rem' }}>
                <div className="card-body">
                  <h5 className="card-title">{event.name}</h5>
                  <hr/>
                  <p className="card-text">{ event.description.length > 10 ? (event.description.substring(10) + '...') : event.description }</p>
                  <a className="btn btn-primary">LearnMore</a>
                </div>
              </div>
            </div>
          </Link>
        )
      } 
    })
  }
    
  return (
    <div>
      <center>
        <div className="container-fluid welcome-home">
          <span className="welcome-text">Welcome to Eventure</span> 
        </div>
      </center>
      <div className="container">
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