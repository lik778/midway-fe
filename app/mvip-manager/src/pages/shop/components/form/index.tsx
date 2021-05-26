import React, { FC, useEffect, useState } from 'react';
import { CreateShopParams } from '@/interfaces/shop'
interface Props {
  shopInfoData: CreateShopParams | null,
  actionType: 'add' | 'edit' | ''
}

const ShopForm: FC<Props> = (props) => {
  const { shopInfoData } = props
  const errMsg = useState<string>('')

  return <div>123</div>
}

export default ShopForm

