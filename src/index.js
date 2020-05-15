import React              from 'react';
import ReactDOM           from 'react-dom';
import MainFragment       from './fragments/main/MainFragment';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <React.StrictMode>
        <MainFragment />
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorker.unregister();
