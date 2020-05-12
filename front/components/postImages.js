import React, { useState, useCallback } from 'react';
import Proptypes from 'prop-types';

import ImagesZoom from './imagesZoom/imagesZoom';

import { PlusOutlined } from '@ant-design/icons';

const PostImages = ({ images }) => {
    const [ showImagesZoom, setShowImagesZoom ] = useState(false);

    const onZoom = useCallback(() => {
        setShowImagesZoom(true);
    }, []);
    const onClose = useCallback(() => {
        setShowImagesZoom(false);
    }, []);

    if(images.length === 1){
        return(
            <>
            <img src={`http://localhost:3306/${images[0].src}`} alt={'post image'} onClick={onZoom} />
            {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        )
    }else if(images.length === 2){
        return(
            <>
            <div>
                <img src={`http://localhost:3306/${images[0].src}`} alt={'post image1'} width='50%' onClick={onZoom} />
                <img src={`http://localhost:3306/${images[1].src}`} alt={'post image2'} width='50%' onClick={onZoom} />
            </div>
            {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        )
    }else{
        return(
            <>
            <div>
                <img src={`http://localhost:3306/${images[0].src}`} alt={'post image1'} onClick={onZoom} />
                <div style={{display: 'inline-block', width:'50%', textAlign: 'center', verticalAlign:'middle'}} onClick={onZoom}>
                    <PlusOutlined />
                    <br />
                    See more {images.length - 1} images
                </div>
            </div>
            {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        )
    }
}

PostImages.proptypes = {
    images: Proptypes.arrayOf(Proptypes.object).isRequired,
}

export default PostImages;