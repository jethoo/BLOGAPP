import React, { useState } from 'react';
import Routes from './Routes';
import Nav from './shared/Nav';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Note:
/*
  Directing the traffic from front to back
  In order to allow logging in the users and let back end know that the user is a valid one
  We need to use tokens to let backend know, that the user is a real one
  We are going to use JWT tokens from Front end or in React, to let backend know that the user is indeed real
  Step 1: Create a proxy in the client side, which would allow frond and back end to flow traffic in the same port during development ,
          For that in package.json, add another package called proxy , "proxy":localhost:4000
          This above proxy setting is only for the development phase. When the app is build, then proxy works itself in a 
          different way
  Step 2: Go to package.json in backend side or node side ,and add the following after start script which will be only apply to heroku
   deployment as follows:
    "heroku-postbuild": "cd client && npm install && npm install --only=dev --no-shrinkwrap && npm run build"
  
  Step 3: Go to app.js in the backend side, and add following for the routing of the traffic from front to back end

    */

function App() {
  /*const resp = Axios.get('/test').then(
    resp => {
      console.log(resp.data.message);
    }) */
  const [user, setUser ] = useState(false);
  


  return (
    <React.Fragment>
      <ToastContainer />
      <Nav user={user}/>
      <Routes user={user} setUser={setUser} />
    </React.Fragment>
  );
}

export default App;
