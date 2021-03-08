import React from 'react';

interface Props {
  title: string;
}

const style = {
  fontSize: 18,
  color: '#333',
  margin: '24px 0 24px 50px'
}

export default (props: Props) => {
  return (
    <div style={style}>
      <div>{ props.title }</div>
    </div>
  );
}
