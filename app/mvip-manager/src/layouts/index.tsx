import React from 'react';
import styles from './index.less';

export default (props: any) => {
  return (
    <div>
      <h1>
        { props.children }
      </h1>
    </div>
  );
}
