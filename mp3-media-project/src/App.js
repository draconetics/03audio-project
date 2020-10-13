import React from 'react';
import './App.css';
import UploadAudio from './components/UploadAudioComponent'
import ListAudio from './components/ListAudioComponent'
import Notfound from './components/NotFoundComponent'
import Menu from './components/MenuComponent'
import {

  Switch,
  Route
} from "react-router-dom";
import { withRouter } from 'react-router-dom';



function App() {
  return (

    <div className="App">        
        <Menu></Menu>
        <Switch>
        <Route exact path="/" component={ListAudio}/>
        <Route path="/audio/new" component={UploadAudio}/>
        <Route component={Notfound} />
        </Switch>
        
    </div>

  );
}

export default withRouter(App);
