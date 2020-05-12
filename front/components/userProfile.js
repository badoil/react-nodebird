import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';

import { LOG_OUT_REQUEST } from '../reducers/user';

const UserProfile = () => {
    const { me } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const onLogout = useCallback(() => {
        dispatch({
            type: LOG_OUT_REQUEST,
        });
    }, [])

    return(
        <Card
            actions = {[
                <Link href='/profile' key='post' prefetch><a><div>jack,jack<br/>{me && me.Posts && me.Posts.length}</div></a></Link>,
                <Link href='/profile' key='followers' prefetch ><a><div>Followers<br/>{me && me.Followers && me.Followers.length}</div></a></Link>,
                <Link href='/profile' key='follwings' prefetch><a><div>Followings<br/>{me && me.Followings && me.Followings.length}</div></a></Link>,
            ]}
        >
            <Card.Meta 
                avatar={<Avatar>{me && me.nickname && me.nickname[0]}</Avatar>}
                title={me && me.nickname}
            />
            <Button onClick={onLogout} >logout</Button>
        </Card>
    )
}

export default UserProfile;