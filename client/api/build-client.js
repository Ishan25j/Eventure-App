import axios from "axios";

// * here the req will present the browser request information
const buildClient = ({ req }) => {

    if (typeof window === 'undefined') {
        // * We are on Server
        // * request should be made to http://ingress-nginx.ingress-nginx.svc.cluster.local
        // * example: 'http://ingress-nginx.ingress-nginx.svc.cluster.local/api/users/currentuser'
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    } else {
        // * We must be on the browser
        // * request can be made with a base url of ''
        // * example: '/api/users/currentuser'
        return axios.create({
            baseURL: '/'
        });
    }
}

export default buildClient;