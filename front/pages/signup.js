import React, { useState, useCallback, useEffect } from 'react';
import { Checkbox, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import styled from 'styled-components';

import { SIGN_UP_REQUEST } from '../reducers/user';

const SignupError = styled.div`
    color: red
`

export const useInput = (initValue = null) => {
    const [ value, setter ] = useState(initValue);
    const handler = useCallback((e) => {
        setter(e.target.value);
    }, [])
    return [ value, handler ]
}

const Signup = () => {
    const [ passwordCheck, setPasswordCheck ] = useState('');
    const [ term, setTerm ] = useState(false);
    const [ passwordCheckError, setPasswordCheckError ] = useState(false);
    const [ termError, setTermError] = useState(false);

    const [ id, onChangeId ] = useInput('');
    const [ nick, onChangeNick ] = useInput('');
    const [ password, onChangePassword ] = useInput('');

    const { isSigningUp, me, isSignedUp } = useSelector(state => state.user);

    const dispatch = useDispatch();

    useEffect(() => {
        if(isSignedUp || me){
            alert('going to go to home due to login')
            Router.push('/');
        }
    }, [ isSignedUp, me ])

    const onSubmit = useCallback((e) => {
        e.preventDefault();

        if(password !== passwordCheck){
            return setPasswordCheckError(true);
        }
        if(!term){
            return setTermError(true);
        }

        dispatch({
            type: SIGN_UP_REQUEST,
            data: {
                userId: id,
                nickname: nick,
                password
            }});

        
    }, [ id, nick, password, passwordCheck, term])

    const onChangePasswordCheck = useCallback((e) => {
        setPasswordCheckError(e.target.value !== password);
        setPasswordCheck(e.target.value);
    }, [password])

    const onChangeTerm = useCallback((e) => {
        setTermError(false); 
        setTerm(e.target.checked);
    }, [])

    if(me){
        return null;
    }

    return(
        <>
            <form onSubmit={onSubmit} style={{ padding: 10}} >
                <div>
                    <label htmlFor="user-id" >id</label>
                    <br />
                    <Input name="user-id" value={id} required onChange={onChangeId} />
                </div>
                <div>
                    <label htmlFor="user-nick" >nickname</label>
                    <br />
                    <Input name="user-nick" value={nick} required onChange={onChangeNick} />
                </div>
                <div>
                    <label htmlFor="user-password">password</label>
                    <br />
                    <Input name="user-password"  value={password} type="password" required onChange={onChangePassword} />
                </div>
                <div>
                    <label htmlFor="user-password-check">password-check</label>
                    <br />
                    <Input name="user-password-check" value={passwordCheck} type="password" required onChange={onChangePasswordCheck} />
                </div>
                { passwordCheckError && <SignupError>dismatch the password</SignupError>}
                <div>
                    <Checkbox name="user-term" checked={term} onChange={onChangeTerm} >Are you sure??</Checkbox>
                </div>
                { termError && <SignupError>you should agree with the term</SignupError>}
                <div style={{ marginTop: 10 }} >
                    <Button type="primary" htmlType="submit" loading={isSigningUp} >Signup</Button>
                </div>
            </form>
        </>
    )
}

export default Signup;