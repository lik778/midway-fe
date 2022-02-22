import { checkInfoStatus, seoCheckInfoType } from '@/api/seo-setting';
import { Progress } from 'antd';
import React, { FC } from 'react';
import styles from './index.less'

interface propsType {
    seoCheckInfo: seoCheckInfoType
}
const SeoAuditIng : FC<propsType> = (props: propsType) => {
    const { seoCheckInfo: { checkInfo } } = props
    return <>
        <p className={styles["seo-check_title"]}><span>SEO检测</span>（完成SEO检测后，进行一键优化，可获得相关的优化建议）</p>
        <p className={styles['seo-check_status']}>检测状态： <span><i></i>{checkInfo && checkInfo.status === checkInfoStatus.DEFAULT ? '检测中' : '已完成'}</span></p>
        {
        checkInfo && checkInfo.status === checkInfoStatus.DEFAULT ? <div>
            <p className={styles['seo-check_progress']}>检测进度：<Progress percent={30} /></p>
            <p className={styles['seo-check_tips']}>正在进行SEO检测中…预计24小时内可查看检测结果</p>
        </div> : <>
            <p className={checkInfo && checkInfo.status === checkInfoStatus.APPROVE ? styles['seo-check_status'] : styles['seo-check_reject']}>检测结果： <span><i></i>{checkInfo && checkInfo.status === checkInfoStatus.APPROVE ? '通过' : '不通过'}</span></p>
            {
                checkInfo && checkInfo.status === checkInfoStatus.REJECT && <div>
                    <p className={styles['seo-check_jianyi']}><span>优化建议：</span>请按照优化建议修改完成后，再重新进行SEO检测</p>
                    <div className={styles['seo-check_reason']}>{checkInfo.msg}</div>
                </div>
            }
        </>
        }
    </>
}

export default SeoAuditIng