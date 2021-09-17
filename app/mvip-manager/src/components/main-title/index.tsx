import React from 'react';

interface Props {
  title: React.ReactNode;
}

const style = {
  fontSize: 18,
  color: '#333',
  margin: '24px 0 24px 50px'
}

export default (props: Props) => {
  return (
    <div className="page-main-title" style={style}>
      <div>{props.title}</div>
    </div>
  );
}
