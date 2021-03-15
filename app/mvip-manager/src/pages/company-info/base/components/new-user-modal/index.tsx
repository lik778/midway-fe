import React  from 'react';
import { Modal } from 'antd';
import { history } from '@@/core/history';

export default () => {
     Modal.confirm({
      width: 532,
      className: 'contact-newman-modal',
      icon: '',
      content: '您的企业资料已经填写完毕，是否现在去创建店铺？',
      title: <img src="//file.baixing.net/202101/17914d789bc8679e787dbcf12b49de6c.png" />,
      cancelButtonProps: { className: 'cancel-btn' },
      okButtonProps: { className: 'ok-btn' },
      okText: '立即前往',
      cancelText: '稍后再说',
      onOk: () => history.push('/shop'),
    })
}
