import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Footer = () => {
    return ( 
        <footer>
            <div className="container-fluid footer">
                <center>  
                    <p>Made by Ishan Joshi - {new Date().getFullYear()}</p>
                    {/* <a href=""><FontAwesomeIcon icon={['fab', 'github']}/></a> */}
                </center>
            </div>
        </footer>
    );
}
 
export default Footer;