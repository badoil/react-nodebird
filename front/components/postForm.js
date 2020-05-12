import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../reducers/post';

const PostForm = () => {
    const { imagePaths, isAddingPost, postAdded } = useSelector(state => state.post);
    const dispatch = useDispatch();
    const [ text, setText ] = useState('');
    const imageInput = useRef();


    useEffect(() => {
        if (postAdded) {
            setText('');
          }
    }, [ postAdded ])

    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        if( !text || !text.trim()){
            return alert('no text');
        }
        const formData = new FormData();
        imagePaths.forEach((v) => {
            formData.append('image', v)
        })
        formData.append('content', text)
        dispatch({
            type: ADD_POST_REQUEST,
            data: formData,
        })
    }, [text]);

    const onChangeText = useCallback((e) => {
        setText(e.target.value);
    }, []);

    const onChangeImages = useCallback((e) => {
        console.log('targetFile:', e.target.files);
        const imageFormData = new FormData();
        [].forEach.call(e.target.files, (f)=> {
            imageFormData.append('image', f)
        })
        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imageFormData,
        })
    }, [])

    const onImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current])

    const onRemoveImage = useCallback((index) => () => {
        dispatch({
            type: REMOVE_IMAGE,
            index,
        })
    }, [])


    return (
        <form style={{ margin: '10px 0 20px'}} encType="multipart/form-data" onSubmit={onSubmitForm} >
                <Input.TextArea maxLength={140} placeholder='write something' value={text} onChange={onChangeText} />
                <div>
                    <input type='file' multiple hidden ref={imageInput} onChange={onChangeImages} />
                    <Button onClick={onImageUpload} >image upload</Button>
                    <Button type='primary' htmlType='submit' style={{float: 'right'}} loading={isAddingPost} >submit</Button>
                </div>
                <div>
                    { imagePaths.map((v, i) => {
                        return(
                            <div key={v} style={{ display: 'inline-block' }} >
                                <img  src={`http://localhost:3306/${v}`} style={{ width: '200px'}} alt={v} />
                                <div>
                                    <Button onClick={onRemoveImage(i)} >remove</Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
              </form>
    )
};

export default PostForm;