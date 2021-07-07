import { AtlasImageListItem } from '@/interfaces/shop';
import React, { useCallback, useEffect, useMemo, useState, FC } from 'react';

interface Props {
  detail: AtlasImageListItem
}

const ImgItem: FC<Props> = (props) => {
  const { detail } = props

  return <div>{detail.id}</div>
}
export default ImgItem