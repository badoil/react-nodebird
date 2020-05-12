import React, { useEffect } from 'react';
import Proptypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/postCard';

const Hashtag = ({ tag }) => {
    console.log('tag:', tag);
    const dispatch = useDispatch();
    const { mainPosts, hasMore } = useSelector(state => state.post);

    const onScroll = () => {
        if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
            if(hasMore){
                dispatch({
                    type: LOAD_HASHTAG_POSTS_REQUEST,
                    lastId: mainPosts[mainPosts.length - 1].id,
                    data: tag,
                })
            }
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onscroll);
        }
    }, [])


    return(
        <div>
            {
                mainPosts.map(c => (
                    <PostCard post={c} key={c.id} />
                ))
            }
        </div>
    )
}

Hashtag.propTypes = {
    tag: Proptypes.string.isRequired,
}

Hashtag.getInitialProps = async (context) => {
    const tag = context.query.tag;
    console.log('context.query.tag: ', tag);
    context.store.dispatch({
        type: LOAD_HASHTAG_POSTS_REQUEST,
        data: tag,
    })
    return { tag };
}

export default Hashtag;