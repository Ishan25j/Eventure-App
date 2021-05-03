import { useState } from 'react';
import useRequest from '../../hooks/use-request';

import Router from 'next/router';


const SignUp = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    // * A hook for sending request and recieving response or errors
    const { doRequest, errors } = useRequest({
      url: '/api/users/signin',
      method: 'post',
      body: {
        email, password
      },
      // * On success, navigate user to root page
      onSuccess: () => Router.push('/')
    }) 

    const onSubmit = async event => {
        event.preventDefault();

        // * Calling a hook function for sending request
        doRequest();
    };

    return (
        <div className="container">
            <br/>
            <h1>Sign In</h1>
            <hr/>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Email address</label>
                    <input
                    type="email" 
                    className="form-control" 
                    aria-describedby="emailHelp"
                    value={email}
                    onChange={e => setEmail(e.target.value)} 
                    />
                    <div id="emailHelp" className="form-text"><i>Write valid email.</i></div>
                </div>
                <div className="mb-3">
                        <label for="exampleInputPassword1" className="form-label">Password</label>
                        <input 
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        />
                </div>
                { errors && <div class="alert alert-danger" role="alert">{errors}</div>}
                <button type="submit" className="btn btn-primary">Submit</button>    
            </form>
        </div>
    );
}
 
export default SignUp;