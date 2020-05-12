import React from 'react';
import { useSelector } from 'react-redux';
import Proptypes from 'prop-types';
import { LOAD_POST_REQUEST } from '../reducers/post';

const Post = () => {
    const { singlePost } = useSelector(state => state.post);
    console.log('singlePost:', singlePost)
    return(
        <>
            <div>{singlePost && singlePost.User.nickname}</div>
            <div>{singlePost && singlePost.content}</div>
            <div>{singlePost && <img src={`http://localhost:3306/${singlePost.Images[0].src}`}/>}</div>
        </>
    )
}

Post.getInitialProps = async (context) => {
    console.log('PostContext:', context)
    context.store.dispatch({
        type: LOAD_POST_REQUEST,
        data: context.query.id,
    })
}

// SinglePost.prototypes = {
//     id: Proptypes.number.isRequired,
// }

export default Post;