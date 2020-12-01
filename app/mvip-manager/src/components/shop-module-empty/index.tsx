import React from 'react';

interface Props {
  type: string;
}

export default (props: Props) => {
  return (
    <div>{props.type}: 没有数据</div>
  )
}
