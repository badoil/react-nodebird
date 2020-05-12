import React, { useState, useCallback } from 'react';
import { Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { EDIT_NICKNAME_REQUEST } from '../reducers/user';

const NicknameEditForm = () => {
    const [ nickname, setNickname ] = useState('');

    const dispatch = useDispatch();
    const { me, isEditingNickname } = useSelector(state => state.user);

    const onSubmitEditNickname = useCallback((e) => {
        e.preventDefault();
        dispatch({
            type: EDIT_NICKNAME_REQUEST,
            data: nickname,
        })
    }, [ nickname ])

    const onEditNickname = useCallback((e) => {
        setNickname(e.target.value)
    }, [])

    return (
        <form style={{ marginBottom:'20px', border:'1px solid #d9d9d9', padding: '20px' }} onSubmit={onSubmitEditNickname} >
            <Input addonBefore='nickname' value={nickname || (me && me.nickname) } onChange={onEditNickname} />
            <Button type='primary' htmlType='submit' loading={isEditingNickname} >update</Button>
        </form>
    )
};

export default NicknameEditForm;