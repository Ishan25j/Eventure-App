
import Router from 'next/router'

const NotFound = () => {
    setTimeout(() => {
        Router.push('/')
    }, 3000);
    return ( 
        <div>
            <h1>
                <center>
                    404 Page Not Found :(
                </center>
            </h1>
        </div>
     );
}
 
export default NotFound;