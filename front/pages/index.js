import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PostForm from '../components/postForm';
import PostCard from '../components/postCard';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';


const Home = () => {
    const dispatch = useDispatch();
    const countRef = useRef([]);
    const { me, isLoggedIn } = useSelector(state => state.user);
    const { mainPosts, hasMorePosts } = useSelector(state => state.post);

    const onScroll = useCallback(() => {
        if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
            if(hasMorePosts){
                const lastId = mainPosts[mainPosts.length-1].id
                if(!countRef.current.includes(lastId)){
                    dispatch({
                        type: LOAD_MAIN_POSTS_REQUEST,
                        lastId,
                    })
                    countRef.current.push(lastId);
                }
            }              
        }
    }, [mainPosts && mainPosts.length, hasMorePosts])

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll)
        };
    }, [mainPosts.length])

    return (
        <div>
            {me ? <div>login: {me.nickname}</div>: <div>logout</div>}
            { isLoggedIn && <PostForm />}
              { mainPosts.map((c) => {
                  return(
                      <PostCard key={c.id} post={c} />
                  )
              })
              }
        </div>
    )
}

Home.getInitialProps = async (context) => {
    context.store.dispatch({
        type: LOAD_MAIN_POSTS_REQUEST,
    })
}

export default Home; 