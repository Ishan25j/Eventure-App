import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {

    // * use state for errors
    const [errors, setErrors] = useState(null);

    const doRequest = async (props = {}) => {
        try {
            // * reset errors before sending request
            setErrors(null);
            // * send request
            const response = await axios[method](url, {...body, ...props});
            
            // * If request is successful and onSuccess function is provided then use it
            if (onSuccess) {
                onSuccess(response.data);
            }

            return response.data;

        } catch (err) {
            try {
            setErrors((<div className="alert alert-danger">
            <h4>Ooops...</h4>
            <ul className="my-0">
              { err.response.data.errors && err.response.data.errors.map(err => <li key={err.message}>{err.message}</li>)}
            </ul>
            </div>))
            } catch (error) {
                console.log('Error:',error.message);
            }
        }
    };

    return { doRequest, errors };
}

export default useRequest;