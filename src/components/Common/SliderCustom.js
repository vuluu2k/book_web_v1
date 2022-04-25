import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { useSpring, animated } from 'react-spring';

import { ProductItem } from 'components/product';

const size = (window.innerWidth <= 992 && 2) || (window.innerWidth <= 1600 && 4) || 6;
const offset = (window.innerWidth <= 992 && 2) || (window.innerWidth <= 1600 && 4) || 6;
let start = 0;
let end = size;

export default function SliderCustom(props) {
  const [item, setItem] = useState(props.item.slice(start, end));
  useEffect(() => {
    setItem(props.item.slice(start, end));
  }, [props.item]);

  const onNext = () => {
    if (props.item.length > end) {
      start += offset;
      end += offset;
      setItem(props.item.slice(start, end));
    }
  };

  const onPre = () => {
    if (start > 0) {
      start -= offset;
      end -= offset;
      setItem(props.item.slice(start, end));
    }
  };

  const anim = useSpring({
    opacity: 1,
    transform: 'translateX(0)',
    from: {
      opacity: 0,
      transform: 'translateX(200px)',
    },
  });
  if (window.innerWidth <= 736) return null;
  return (
    <div className="slider-custom pos-relative">
      <h1 className="text-white text-upper">{props.title}</h1>
      <animated.div style={anim}>
        <Row gutter={15}>
          {item.map((a, index) => (
            <Col key={index} xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }} xxl={{ span: 4 }}>
              <ProductItem name={a.name} value={a.value} imageLink={a.image_link} id={a._id} />
            </Col>
          ))}
        </Row>
      </animated.div>
      <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)' }} onClick={() => onPre()}>
        <div
          style={{
            background: 'rgba(255,255,255,0.8)',
            padding: '16px 8px 16px 0px',
            borderRadius: '0 8px 8px 0',
            cursor: 'pointer',
            border: '1px solid #f0f0f0',
          }}>
          <LeftOutlined />
        </div>
      </div>
      <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }} onClick={() => onNext()}>
        <div
          style={{
            background: 'rgba(255,255,255,0.8)',
            padding: '16px 0px 16px 8px',
            borderRadius: '8px 0 0 8px',
            cursor: 'pointer',
            border: '1px solid #f0f0f0',
          }}>
          <RightOutlined />
        </div>
      </div>
    </div>
  );
}
