import React from 'react';
import Proptypes from 'prop-types';

const MyError = ({ statusCode }) => {
    return(
        <div>
            <h1>{statusCode} Error Occured</h1>
        </div>
    );
};

MyError.proptypes = {
    statusCode: Proptypes.number,
};

MyError.defaultProps = {
    statusCode: 400,
};

MyError.getInitialProps = async(context) => {
    const statusCode = context.res? context.res.statusCode: context.err? context.err.statusCode: null;
    console.log('statusCode:', statusCode);
    return { statusCode };
};

export default MyError;