import React from 'react';
import Proptypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button } from 'antd';


const FollowButton = ({ post, onFollow, onUnfollow }) => {
    const { me } = useSelector(state => state.user);
    return(
        !me || (post.User.id === me.id) 
          ? null
          : me.Followings && me.Followings.find(v => v.id === post.User.id)
            ? <Button onClick={onUnfollow(post.User.id)} >Unfollow</Button>
            : <Button onClick={onFollow(post.User.id)} >Follow</Button>
    )
};

FollowButton.proptypes = {
    post: Proptypes.object.isRequired,
    onFollow: Proptypes.func.isRequired,
    onUnfollow: Proptypes.func.isRequired,
};

export default FollowButton;