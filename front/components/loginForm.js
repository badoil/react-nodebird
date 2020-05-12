import React, { useCallback } from 'react';
import Link from 'next/link';
import { Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { useInput } from '../pages/signup';
import { LOG_IN_REQUEST } from '../reducers/user';

const LoginError = styled.div`
    color: red
`

const LoginForm = () => {
    const [ userId, onChangeUserId ] = useInput('');
    const [ password, onChangePassword ] = useInput('');
    const dispatch = useDispatch();
    const { isLoggingIn, loginErrorReason } = useSelector(state => state.user);

    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        dispatch({
            type: LOG_IN_REQUEST,
            data: {
                userId, password
            }
        });
        
    }, [userId, password]);

    return(
        <>
            <form onSubmit={onSubmitForm} style={{ padding: '10px'}} >
                <div>
                    <label htmlFor="user-id">id</label>
                    <br />
                    <Input name="user-id" value={userId} required onChange={onChangeUserId} ></Input>
                </div>
                <div>
                    <label htmlFor="password" >password</label>
                    <br />
                    <Input name="password" value={password} type='password' required onChange={onChangePassword} ></Input>
                </div>
                <LoginError>{loginErrorReason}</LoginError>
                <div style={{ marginTop: '10px'}} >
                    <Button type='primary' htmlType='submit' loading={isLoggingIn} >Login</Button>
                    <Link href="/signup"><a><Button>회원가입</Button></a></Link>
                </div>
            </form>
        </>
    )
}

export default LoginForm;