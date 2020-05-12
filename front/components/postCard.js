import React, { useState, useCallback, memo } from 'react';
import { Card, Button, Avatar, List, Comment, Popover  } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

import { EllipsisOutlined, EditOutlined, HeartOutlined, TwitterOutlined } from '@ant-design/icons';

import { LOAD_COMMENTS_REQUEST, LIKE_POST_REQUEST, 
        UNLIKE_POST_REQUEST, RETWEET_REQUEST, REMOVE_POST_REQUEST } from '../reducers/post';
import { UNFOLLOW_USER_REQUEST, FOLLOW_USER_REQUEST } from '../reducers/user';
import PostImages from './postImages';
import PostCardContent from './postCardContent';
import CommentForm from './commentForm';
import FollowButton from './followButton';


const PostCard = memo(({ post } ) => {
  const dispatch = useDispatch()
  const id = useSelector(state => state.user.me && state.user.me.id);
  const [ commentFormOpened, setCommentFormOpened ] = useState(false);
  
  const liked = id && post.Likers && post.Likers.find(v => v.id === id)

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
    if(!commentFormOpened){
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id
      })
    }

  }, [commentFormOpened])

  const onLikeOrUnlike = useCallback(() => {
    if(id){
      alert('No Authentication');
    }
    if(liked){
      dispatch({
        type: UNLIKE_POST_REQUEST,
        data: post.id,
      })
    }else{
      dispatch({
        type: LIKE_POST_REQUEST,
        data: post.id,
      })
    }
  },[id, post && post.id, liked])

  const onRetweet = useCallback(() => {
    dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    })
  }, [id, post && post.id])

  const onUnfollow = useCallback(postUserId => () => {
    dispatch({
      type: UNFOLLOW_USER_REQUEST,
      data: postUserId,
    })
  }, [])

  const onFollow = useCallback(postUserId => () => {
    dispatch({
      type: FOLLOW_USER_REQUEST,
      data: postUserId,
    })
  }, [])

  const onRemovePost = useCallback(postId => () => {
    dispatch({
      type: REMOVE_POST_REQUEST, 
      data: postId,
    })
  }, []);

    return(
      <div>
        <Card
        key={+post.createdAt}
        cover={post.Images && post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <TwitterOutlined key='retweet' onClick={onRetweet} />,
          <HeartOutlined key='heart' onClick={onLikeOrUnlike} />,
          <EditOutlined key="edit" onClick={onToggleComment} />,
          <Popover
            key='ellipsis'
            content={( 
              <Button.Group>
              {id && post.UserId
              ?(<>
                <Button>update</Button>
                <Button type='danger' onClick={onRemovePost(post.id)}>remove</Button>
              </>)
              :<Button>send a complaint</Button>}
              </Button.Group>
            )}
          >
             <EllipsisOutlined key="ellipsis" />
          </Popover>
         ,
        ]}
        title={post.Retweet && post.Retweet.User && post.Retweet.User.nickname && post.User.nickname ? `${post.User.nickname} retweet ${post.Retweet.User.nickname}'s post`: null}
        extra={<FollowButton post={post} onFollow={onFollow} onUnfollow={onUnfollow} />}
        >
          {
            post.RetweetId && post.Retweet && post.Retweet.User && post.Retweet.User.id?
            (<Card
              cover={post.Retweet.Images && post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
            >
              <Card.Meta 
                avatar={<Link href={{ pathname: `/user`, query: {id: post.Retweet.User.id}}} as={`/user/${post.Retweet.User.id}`} >
                         <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                      </Link>}
                title={post.Retweet.User.nickname}
                description={<PostCardContent postData={post.Retweet.content} />}
              />
            </Card>
            ):(
          <Card.Meta 
          avatar={<Link href={{ pathname: `/user`, query: {id: post.User.id}}} as={`/user/${post.User.id}`} >
                   <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                </Link>}
          title={post.User.nickname}
          description={<PostCardContent postData={post.content} />}
          />) 
          }        
        </Card>
        
        { commentFormOpened && 
          <>
            <CommentForm post={post} />
            <List 
              header={`comments: ${post.comments? post.comments.length: 0}`}
              itemLayout="horizontal"
              dataSource={post.comments || []}
              renderItem={item => (
                <li>
                  <Comment 
                  author={item.User.nickname}
                  avatar={<Link as={`/user/${item.User.id}`} href={{ pathname: `/user`, query: {id: item.User.id}}} >
                           <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                          </Link>}
                  content={item.content}
                  />
                </li>
              )}
            
            />
          </>
        }
      </div>
    )
});

PostCard.propTypes = {
    post: PropTypes.shape({
        User: PropTypes.object,
        img: PropTypes.string,
        content: PropTypes.string,
        createdAt: PropTypes.object,
    })
}

export default PostCard;