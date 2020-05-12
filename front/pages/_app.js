import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import createSagamiddleware from 'redux-saga';
import axios from 'axios';

import rootReducer from '../reducers';
import AppLayout from '../components/appLayout';
import rootSaga from '../sagas';
import { LOAD_USER_REQUEST } from '../reducers/user';


const Nodebird = ({ Component, store, pageProps }) => {
    return(
        <>
            <Provider store={store} >
                <Head>
                    <title>Nodebird</title>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
                    <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
                    <link rel="shortcut icon" href="/public/favicon.ico" />
                </ Head>
                <AppLayout>
                    <Component {...pageProps} />
                </AppLayout>
            </Provider>
        </>
    )
}

Nodebird.propTypes = {
    Component: PropTypes.elementType.isRequired,
    store: PropTypes.object.isRequired,
    pageProps: PropTypes.object.isRequired,
}

Nodebird.getInitialProps = async (context) => {
    const { ctx, Component }  = context;
    let pageProps = {};
    const state = ctx.store.getState()
    const cookie = ctx.isServer? ctx.req.headers.cookie: '';
    axios.defaults.headers.Cookie = '';
    if(ctx.isServer && cookie){
        axios.defaults.headers.Cookie = cookie;
    }
    if(!state.user.me){
        ctx.store.dispatch({
            type: LOAD_USER_REQUEST,          // there is no user.me in the reducer state yet
        })                                    // so after Component.getInitialProps work in component Profile,
    }                                         // no working in dispatch 
    if(Component.getInitialProps){
       pageProps =  await Component.getInitialProps(ctx) || {};
    }
    return {pageProps};
}

const configureStore = (initialState, options) => {
    const sagamiddleware = createSagamiddleware();
    const middlewares = [sagamiddleware];
    const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares))
    : compose(applyMiddleware(...middlewares), 
    !options.isServer && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,)

    const store = createStore(rootReducer, initialState, enhancer);
    store.sagaTask = sagamiddleware.run(rootSaga)
    return store;
};

export default  withRedux(configureStore)(withReduxSaga(Nodebird));