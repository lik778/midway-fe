import { VerifyStatus, VerifyType } from '@/enums'
import React, { ReactNode } from 'react'

export interface AuthConfigItem {
  type: VerifyType;
  status: VerifyStatus;
  name: string;
  imageSrc: string;
  details: string[];
  example?: ReactNode
}

export const getAuthConfig = (): any => ({
    [VerifyType.LICENCE]: {
      type: VerifyType.LICENCE,
      status: VerifyStatus.DEFAULT,
      name: '企业认证',
      imageSrc: '//file.baixing.net/202011/a86b2b4d6907336443bacfff1e924e99.png',
      details: [ '适合公司（企业）或个体工商户', '需要认证营业执照', '特殊行业的经营许可证'],
      example: <p className="auth-example">例如：开锁行业需提供：公安备案； 搬家需提供：道路运输资质</p>
    },
    [VerifyType.IDCARD]: {
      type: VerifyType.IDCARD,
      status: VerifyStatus.DEFAULT,
      name: '个人认证',
      imageSrc: '//file.baixing.net/202011/9ef06d895702344481e49e5d5a11f9bf.png',
      details: [ '适合个人商家', '需要认证身份证'],
      example: null
    }
})
