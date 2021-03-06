import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import UploadAudio from './pages/UploadAudio/UploadAudioComponent';
import ListAudio from './pages/ListAudio/ListAudioComponent';
import Notfound from './pages/NotFoundComponent';
import Menu from './components/Menu/MenuComponent';

function App() {
  return (
    <div className="App">
      <Menu />
      <Switch>
        <Route exact path="/" component={ListAudio} />
        <Route path="/audio/new" component={UploadAudio} />
        <Route component={Notfound} />
      </Switch>
    </div>
  );
}

export default withRouter(App);
