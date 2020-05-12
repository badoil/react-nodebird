import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_COMMENT_REQUEST } from '../reducers/post';
import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';


const CommentForm = ({ post }) => {
    const [ commentText, setCommentText ] = useState('');

    const { isAddingComment, commentAdded } = useSelector(state => state.post);
    const { me } = useSelector(state => state.user);
    const dispatch = useDispatch();


    useEffect(() => {
        setCommentText('');
      }, [ commentAdded === true]);

    const onSubmitComment = useCallback((e) => {
        e.preventDefault();
        if(!me){
          return alert('you need to login');
        }
        return dispatch({
          type: ADD_COMMENT_REQUEST,
          data: {
            postId: post.id,
            content: commentText,
          }
        })
      }, [ me && me.id, commentText ])

    const onChangeCommentText = useCallback((e) => {
        setCommentText(e.target.value);
      }, [])
    return(
        <>
            <form onSubmit={onSubmitComment} >
                <Form.Item>
                    <Input.TextArea row={4} value={commentText} onChange={onChangeCommentText} />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={isAddingComment} >jack</Button>
            </form>
        </>
    )   
}

CommentForm.propTypes = {
    post: PropTypes.object.isRequired,
}

export default CommentForm;