import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import { Client } from 'components/layouts';
import { blogActions } from 'actions';
import { selectBlog } from 'selectors';

const { Meta } = Card;

function Blog(props) {
  const {
    actions,
    selectBlogData: { blogs },
  } = props;
  const [stateMoreDescription, setStateMoreDescription] = useState(false);
  useEffect(() => {
    actions.loadListBlog({});
  }, []);

  return (
    <Client>
      <div className="mb-16">
        {blogs.map(item => (
          <div key={item._id} className="text-align box-shadow mt-16 p-16 border-radius-16 description">
            <img alt={item.title} src={item.image_link} width="100%" />
            <div
              style={{
                backgroundColor: 'white',
                height: stateMoreDescription ? '100%' : 500,
                overflow: stateMoreDescription ? 'visible' : 'hidden',
                width: '100%',
              }}
              dangerouslySetInnerHTML={{ __html: item.description }}></div>
            <div className="w-100 text-center bg-description">
              <Button
                onClick={() => setStateMoreDescription(!stateMoreDescription)}
                icon={stateMoreDescription ? <UpOutlined /> : <DownOutlined />}
                className="box-shadow"
                style={{ borderRadius: 8, border: 'none', minWidth: 200 }}>
                {stateMoreDescription ? 'Thu gọn' : 'Xem thêm'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Client>
  );
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...blogActions }, dispatch) });
const mapStateToProps = state => ({ ...selectBlog(state) });

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
