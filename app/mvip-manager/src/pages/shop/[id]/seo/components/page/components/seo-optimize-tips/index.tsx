import { seoCheckInfoType, submitSeoCheck } from '@/api/seo-setting'
import { Button } from 'antd'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import styles from './index.less'
import { useState } from 'react';

interface propsType {
    id: String,
    seoCheckInfo?: seoCheckInfoType,
    seoCheck?: (param: any) => void
}
const SeoOptimizeTips : FC<propsType> = (props: propsType) => {
    const { id, seoCheckInfo, seoCheck = () => {} } = props
    const [upDateLoading, setUpDateLoading] = useState<boolean>(false)
    
    return <>
           <p className={styles['seo-optimize-tips']}>优化建议：<span>请按照优化建议修改完成后，才可进行SEO检测</span></p>
    <ul className={styles['seo-optimize-content']}>
        <li className={styles['seo-title']}>SEO设置优化建议</li>
        <li className={styles['sub-title']}>
            <span>地域/后缀</span>
            <Link to={`/shop/${id}/seo/area`}>去提升</Link>
        </li>
        <li className={styles['seo-optimize-item']}>
            <p><label>地域：</label>本店铺已填写<span className={styles['seo-optimize-item_num']}>{seoCheckInfo?.numInfo.areaNum}</span>个 | 至少填写 15 个</p>
            <p><label>后缀：</label>本店铺已填写<span className={styles['seo-optimize-item_num']}>{seoCheckInfo?.numInfo.suffixNum}</span>个 | 至少填写 10 个</p>
        </li>
        <li className={styles['sub-title']}>
            <span>产品数量</span>
            <Link to={`/shop/${id}/product`}>去提升</Link>
        </li>
        <li className={styles['seo-optimize-item']}>
            <p>本店铺已填写<span className={styles['seo-optimize-item_num']}>{seoCheckInfo?.numInfo.productNum}</span>个 | 至少填写15个</p>
        </li>
    </ul>
    <Button className={styles['btn']} type="primary" onClick={seoCheck} disabled={!seoCheckInfo?.numInfo.pass} loading={upDateLoading}>立即检测</Button>
    <p className={styles['tip']}>注：1.店铺新建产品分组、产品页才可再次一键优化 2.一键优化后3天后可通过营销报表查看上词。</p>
    </>
}

export default SeoOptimizeTips