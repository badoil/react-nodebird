import React from 'react';
import Link from 'next/link';
import { Menu, Input, Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Router from 'next/router';

import UserProfile from './userProfile';
import LoginForm from './loginForm';


const AppLayout = ({ children }) => {
  const { isLoggedIn } = useSelector(state => state.user);

  const onSearch = value => {
    Router.push({ pathname: '/hashtag', query: { tag: value }}, `/hashtag/${value}`)
  }

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home"><Link href="/"><a>노드버드</a></Link></Menu.Item>
        <Menu.Item key="profile"><Link href="/profile" prefetch><a>프로필</a></Link></Menu.Item>
        <Menu.Item key="mail" >
          <Input.Search enterButton style={{ verticalAlign: 'middle' }} onSearch={onSearch} />
        </Menu.Item>
      </Menu>
      <Row gutter={10}>
          <Col xs={24} md={6}  >
            {isLoggedIn
            ? <UserProfile />
            : <LoginForm />
            }
          </Col>
          
          <Col xs={24} md={12} >
             {children}
          </Col>
          <Col xs={24} md={6} ></Col>
      </Row>

    </div>
  );
};

AppLayout.propTypes = {
    children: PropTypes.node,
}

export default AppLayout;