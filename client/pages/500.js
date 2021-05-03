
import Router from 'next/router'

const ServerError = () => {
    setTimeout(() => {
        Router.push('/')
    }, 3000);
    return ( 
        <div>
            <h1>
                <center>
                    500 error :(
                </center>
            </h1>
        </div>
     );
}
 
export default ServerError