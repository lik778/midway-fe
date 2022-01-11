import React, { useState, useEffect, FC } from 'react';
import { ShopMetas, MetasItem } from '@/interfaces/user'

interface Props {
  cascaderValue: (MetasItem | undefined)[],
  checkboxValue: string[]
  value?: ShopMetas
  onChange?(metas: ShopMetas): void
}

const Metas: FC<Props> = (props: Props) => {
  const { cascaderValue, checkboxValue, onChange } = props
  useEffect(() => {
    onChange && onChange([cascaderValue[0], cascaderValue[1], checkboxValue])
  }, [cascaderValue, checkboxValue])
  return <></>
}

export default Metas