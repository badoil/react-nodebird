import React, { useCallback } from 'react';

import NicknameEditForm from '../components/nicknameEditForm';
import { useDispatch, useSelector } from 'react-redux';

import PostCard from '../components/postCard';
import ProfileFollowList from '../components/profileFollowList';
import { LOAD_FOLLOWINGS_REQUEST, LOAD_FOLLOWERS_REQUEST,
        UNFOLLOW_USER_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';


const Profile = () => {
    const { followingList, followerList, hasMoreFollowings, hasMoreFollowers } = useSelector(state => state.user);
    const { mainPosts } = useSelector(state => state.post);
    const dispatch = useDispatch();

    const onUnfollow = useCallback(userId => () =>{
        dispatch({
            type: UNFOLLOW_USER_REQUEST,
            data: userId,
        })
    }, [])

    const onRemoveFollower = useCallback(userId => () => {
        dispatch({
            type: REMOVE_FOLLOWER_REQUEST, 
            data: userId,
        })
     }, [])

    const onLoadMoreFollowings = useCallback(() => {
        dispatch({
            type: LOAD_FOLLOWINGS_REQUEST,
            offset: followingList.length,
        })
    } ,[followingList.length]);

    const onLoadMoreFollowers = useCallback(() => {
        dispatch({
            type: LOAD_FOLLOWERS_REQUEST,
            offset: followerList.length,
        })
    }, [followerList.length]);

    return(
        <div>
            <NicknameEditForm />
            <ProfileFollowList 
            header='following list' 
            hasMoreFollow={hasMoreFollowings}
            onClickMore={onLoadMoreFollowings}
            dataSource={followingList}
            onClickRemove={onUnfollow}
            /> 
            <ProfileFollowList
            header='follower list' 
            hasMoreFollow={hasMoreFollowers}
            onClickMore={onLoadMoreFollowers}
            dataSource={followerList}
            onClickRemove={onRemoveFollower}
            />
            <div>
            {
                mainPosts.map((v) => (
                    <PostCard post={v} key={v.id} />
                ))
            }
            </div>
        </div>
    )
}

Profile.getInitialProps = async (context) => {
    const state = context.store.getState();
    context.store.dispatch({
        type: LOAD_FOLLOWINGS_REQUEST,
        data: state.user.me && state.user.me.id,
    })
    context.store.dispatch({
        type: LOAD_FOLLOWERS_REQUEST,
        data: state.user.me && state.user.me.id,
    })
    context.store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: state.user.me && state.user.me.id,
    })
}

export default Profile;