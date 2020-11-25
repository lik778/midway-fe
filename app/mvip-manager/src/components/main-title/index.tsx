import React from 'react';

export default (props: any) => {
  return (
    <div style={{ fontSize: 18, color: '#333', margin: '24px 0 24px 16px' }}>
      <div>{ props.title }</div>
    </div>
  );
}
