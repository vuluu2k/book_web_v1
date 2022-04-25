import React from 'react';

export default function TableCustom({ children, ...props }) {
  return (
    <div className="data-table">
      <div className="data-table-title" style={props.style}>
        <div className="title">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              {props.icon} {props.title} {props.refesh}
            </div>
            <div>{props.search}</div>
          </div>
        </div>
      </div>
      <div className="data-table-container">{children}</div>
    </div>
  );
}
