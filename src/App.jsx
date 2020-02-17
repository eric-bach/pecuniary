import React from "react";
import { Route } from "react-router-dom";

import HomePage from "./HomePage";
import ProtectedApp from "./components/App/App";

class App extends React.Component {
  render() {
    return (
      <>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/(.+)' render={() => <ProtectedApp />} />
      </>
    );
  }
}

export default App;
