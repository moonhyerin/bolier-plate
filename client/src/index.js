import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';

//Redux의 Store는 객체밖에 못 받기 때문에 Promise와 Function도 받을 수 있도록
//redux-promise와 redux-thunk도 같이 보내주는 것!
const createStoreMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);

//보여주고 싶은 컴포넌트를 넣으면 되는 부분
ReactDOM.render(
    <Provider 
        store={createStoreMiddleware(Reducer, 
            window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__()
        )}
    >
        <App />
    </Provider>
    
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
