import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';
import App from './components/App/App';

function importAll(r) {
  r.keys().forEach(r);
}

// Load resources
importAll(require.context('./resources', true, /.*\.*$/));

ReactDOM.render(<App />, document.getElementById('root'));
