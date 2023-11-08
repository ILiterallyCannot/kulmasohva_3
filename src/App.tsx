import  React from "react";
import { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

type Props = {};

type State = {
  redirect: string | null,
}

class App extends Component<Props, State> {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
