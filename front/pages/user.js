import React, { useEffect } from 'react';
import Proptypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { LOAD_USER_REQUEST } from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/postCard';
import { Avatar, Card } from 'antd';

const User = () => {
    const { mainPosts } = useSelector(state => state.post);
    const { userInfo } = useSelector(state => state.user);

    return(
        <div>
            {
                userInfo? 
                <Card
                    actions={[
                        <div key="tweet">
                            jack, jack
                            <br />
                            {userInfo.Posts}
                        </div>,
                        <div key="following">
                            followings
                            <br />
                            {userInfo.Followings}
                        </div>,
                        <div key="follower">
                            Followers
                            <br />
                            {userInfo.Followers}
                        </div>,
                    ]}
                >
                    <Card.Meta 
                        avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                        title={userInfo.nickname}
                    />
                </Card>
                :null
            }
            {
                mainPosts.map(c => (
                        <PostCard post={c} key={c.id} />
                ))
            }
        </div>
    )
}

User.propTypes = {
    id: Proptypes.number.isRequired,
}

User.getInitialProps = async (context) => {
    const id = parseInt(context.query.id, 10);
    console.log('user getInitialProps: ', context.query.id);

    context.store.dispatch({
        type: LOAD_USER_REQUEST,
        data: id,
    })
    context.store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: id,
    })
}

export default User;