import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

import Navbar from '../components/Navbar';

import buildClient from "../api/build-client";


const  MyApp = ({ Component, pageProps, currentUser }) => {

  return (
    <div>
      <Navbar currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  )
}

MyApp.getInitialProps = async (appContext) => {

  const client = buildClient(appContext.ctx);

  try {
    const { data } = await client.get('/api/users/currentuser');
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
      
      // * getInitialProps of all children pages which is accessed
      pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
  
    }
  
    return {pageProps, ...data};

  } catch (error) {
    console.error(error.message);
  }

  return {};
}

export default MyApp;
