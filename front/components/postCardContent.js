import React from 'react';
import Proptypes from 'prop-types';
import Link from 'next/link';

const PostCardContent = ({ postData }) => {
    return (
        <div>{postData.split(/(#[^\s]+)/).map((v) => {
            if(v.match(/#[^\s]+/)){
            return (
                <Link as={`/hashtag/${v.slice(1)}`} href={{ pathname: `/hashtag`, query: {tag: v.slice(1)}}}  key={v} >
                    <a>{v}</a>
                </Link>
            )
            }
            return v;
        })}
      </div>
      )
}

PostCardContent.proptypes = {
    postData: Proptypes.string.isRequired,
}

export default PostCardContent;