import React from 'react';
import { WildCatConfig } from '@/components/wildcat/interfaces';
import { PageType } from '@/components/wildcat/enums';
import WildcatForm from '@/components/wildcat/components/form';

interface Props {
  config: WildCatConfig;
}

//主要的页面方式
 export default class Wildcat extends React.Component<Props, any> {
     constructor(props: Props) {
       super(props)
     }

    render() {
      const { formConfig } = this.props.config
      if (this.props.config.type == PageType.form) {
        return (<WildcatForm config={formConfig}/>)
      } else {
        return (<div>这里是野猫</div>)
      }
    }
 }
