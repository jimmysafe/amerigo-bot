import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from "react-redux";
import mainReducer from "./store/reducers";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: mainReducer
  });
  

const Root = () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    )
}

ReactDOM.render(<Root />, document.getElementById('root'));
