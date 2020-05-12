import React, { memo } from 'react';
import Proptypes from 'prop-types';

import { List, Button, Card } from 'antd';
import { StopOutlined } from '@ant-design/icons';

const ProfileFollowList = memo(({ header, hasMoreFollow, onClickMore, dataSource, onClickRemove}) => {
    return(
        <List
            style={{ marginBottom: '20px' }}
            grid={{ gutter: 4, xs: 2, md: 3 }}
            size="small"
            header={<div>{header}</div>}
            loadMore={ hasMoreFollow && <Button style={{ width: '100%' }} onClick={onClickMore} >더 보기</Button>}
            bordered
            dataSource={dataSource}
            renderItem={item => (
            <List.Item style={{ marginTop: '20px' }}>
                <Card actions={[<StopOutlined key='stop' onClick={onClickRemove(item.id)} />]}>
                    <Card.Meta description={item.nickname} />
                </Card>
            </List.Item>
            )}
        />
    )
})

ProfileFollowList.proptypes = {
    header: Proptypes.string.isRequired,
    hasMoreFollow: Proptypes.bool.isRequired,
    onClickMore: Proptypes.func.isRequired,
    dataSource: Proptypes.array.isRequired,
    onClickRemove: Proptypes.func.isRequired,
}

export default ProfileFollowList;