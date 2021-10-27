import React from 'react';
import { message } from 'antd';
import './index.less';


export const successMessage = (content: string) => {
   message.success({ content: content, duration: 2,
    className: 'my-message-box my-message-success-box',
    icon: <img src="//file.baixing.net/202012/df2cf313c5d16b2e67284682258e04a8.png"/> })
}

export const errorMessage = (content: string, duration?: number) => {
  message.error({ content: content, duration: duration ? duration : 1.5,
    className: 'my-message-box my-message-error-box',
    icon: <img src="//file.baixing.net/202012/b04026daec92a0ba9e7b336b54a2e760.png"/> })
}

export const warnMessage = (content: string, duration?: number) => {
  message.warning({ content: content, duration: duration ? duration : 1.5,
    className: 'my-message-box my-message-warn-box',
    icon: <img src="//file.baixing.net/202104/e461494a5126a00ec8967a46fb9c6684.png"/> })
}
