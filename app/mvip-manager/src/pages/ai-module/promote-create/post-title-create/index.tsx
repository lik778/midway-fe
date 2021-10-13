import React, { FC, useEffect, useState, useContext, useRef } from 'react';
import { useHistory } from 'umi'
import { Form, Button, Input, Row, Col, Select, Spin } from 'antd';
import MainTitle from '@/components/main-title';
import styles from './index.less';
import { getCookie, randomList, translateProductText, } from '@/utils';
import { modal, prefix } from '@/constants/ai-module'
import { PostToolTitleKeys } from '@/enums/ai-module'
import { CollectionTitleApiParams, CollectionPreviewTitleParmas, CollectionTitleListItem, CollectionCreateTitleParmas, SaveWordParmes } from '@/interfaces/ai-module'
import { createCollectionTitles, previewCollectionTitles, updateCollection, saveWord, getWord } from '@/api/ai-module'
import { Rule, FormItemListItem, FormParmas, SelectListItem } from './data'
import FormTextarea from './components/form-textarea'
import FormArea from './components/form-area'
import { errorMessage, successMessage } from '@/components/message';
import { COOKIE_USER_KEY } from '@/constants/index'
import PostPreviewTitle from '../components/post-preview-title'
import { track } from '@/api/common'
import { BXMAINSITE } from '@/constants/index'
import AiModuleContext from '../context'

const validateItem: (key: string, min: number, max: number, rule: Rule, value: string) => Promise<any> = (key, min, max, rule, value) => {
  if (key === 'area' || key === 'prefix' || key === 'coreWords' || key === 'modal') {
    const dataList = value && typeof value === 'string' ? value.split('\n').filter((item: string) => item !== '') : []
    if (dataList.length < min) {
      return Promise.reject(new Error(`词语数不得少于${min}个`));
    }
    if (dataList.length > max) {
      return Promise.reject(new Error(`词语数不得多于${max}个`));
    }
  }
  return Promise.resolve()
}


const PostTitleCreate: FC = () => {
  const history = useHistory()
  // @ts-ignore
  // 这里是history.location的类型定义里没有query字段
  const { id } = history.location.query
  const { copyId, copyIdType } = useContext(AiModuleContext)
  const [form] = Form.useForm<FormParmas>();
  const [upDataLoading, setUpdataLoading] = useState<boolean>(false)
  const [dataList, setDataList] = useState<CollectionCreateTitleParmas[]>([])
  const [selectTitleVisible, setSelectTitleVisible] = useState<boolean>(false)
  const [saveWordData, setSaveWordData] = useState<Partial<SaveWordParmes>>({})
  const textareaRef = useRef<{
    prefix: { setWordNum: (number: number) => void },
    main: { setWordNum: (number: number) => void },
    suffix: { setWordNum: (number: number) => void },
  }>({
    prefix: { setWordNum: (number: number) => { } },
    main: { setWordNum: (number: number) => { } },
    suffix: { setWordNum: (number: number) => { } }
  })

  const formItemList: FormItemListItem[] = [{
    label: '前缀',
    key: 'prefix',
    min: 3,
    max: 100,
    auto: 8,
    tip: '3-100个',
    rules: [{
      required: true,
      // message: `请输入前缀！(3-100个)`,
      validator: (rule: Rule, value: any) => validateItem('prefix', 3, 100, rule, value),
    }],
    placeholder: '举例：\n修饰词：\n靠谱的\n附近的\n\n行业细分词：\n公司注册：科技公司、游戏公司',
  }, {
    label: '核心词',
    key: 'main',
    placeholder: '举例：\n冰箱维修\n气动隔膜泵',
    min: 3,
    max: 100,
    tip: '3-100个',
    rules: [{
      required: true,
      // message: `请输入核心词！(3-100个)`,
      validator: (rule: Rule, value: any) => validateItem('coreWords', 3, 100, rule, value),
    }],
  }, {
    label: '后缀',
    key: 'suffix',
    placeholder: '请点击按钮获取',
    min: 6,
    max: 100,
    auto: 20,
    tip: '6-100个',
    rules: [{
      required: true,
      validator: (rule: Rule, value: any) => validateItem('modal', 6, 100, rule, value),
    }],
    readOnly: false
  }]

  const setLastPreviewTime = () => {
    const uid = getCookie(COOKIE_USER_KEY)
    localStorage.setItem(`setLastPreviewTiem_${uid}`, String(new Date().getTime()))
  }


  const checkLastPreviewTime = () => {
    const uid = getCookie(COOKIE_USER_KEY)
    const lastTime = localStorage.getItem(`setLastPreviewTiem_${uid}`)
    if (lastTime) {
      const nowTime = new Date().getTime()
      const second = Math.floor((nowTime - Number(lastTime)) / 1000)
      if (second < 30) {
        errorMessage(`操作太快，请${30 - second}秒后再试!`)
        return false
      }
      return true
    }
    return true
  }


  const getWordFn = async () => {
    if (copyId && copyIdType) {
      const res = await getWord({ wordId: copyId })
      const { area, prefix, coreWords, suffix } = res.data
      form.setFieldsValue({
        prefix: (prefix || []).join('\n'),
        main: (coreWords || []).join('\n'),
        suffix: (suffix || []).join('\n'),
      })
      textareaRef.current.prefix.setWordNum(prefix.length)
      textareaRef.current.main.setWordNum(coreWords.length)
      textareaRef.current.suffix.setWordNum(suffix.length)
    }
  }

  useEffect(() => {
    getWordFn()
    track({
      eventType: BXMAINSITE,
      data: {
        site_id: 'post_tool',
        tracktype: 'event',
        action_id: 'entry-page',
        page_id: '标题组合工具界面',
        task_id: id,
        _refer: document.referrer
      }
    })
  }, [])

  const handleClickPreview = async () => {
    await form.validateFields();
    if (!checkLastPreviewTime()) return
    const values = form.getFieldsValue()
    const { notCityWord } = values
    const city = values.city || []
    // 这里城市取选择的多城市的第一个，减少后端生成逻辑，获取的结果在前端替换城市就好
    const params: CollectionPreviewTitleParmas = {
      cityNum: values.city?.length || 0,
      groupWords: {
        [PostToolTitleKeys.CITY]: notCityWord ? undefined : [(city[0])?.label],
        [PostToolTitleKeys.AREA]: values.area?.map(item => item.label) || [],
        [PostToolTitleKeys.PREFIX]: values.prefix.split('\n').filter(item => item),
        [PostToolTitleKeys.MAIN]: values.main.split('\n').filter(item => item),
        [PostToolTitleKeys.SUFFIX]: values.suffix.split('\n').filter(item => item),
      }
    }
    setUpdataLoading(true)
    const res = await previewCollectionTitles(params)
    if (res.success) {
      const { remainSize, titles } = res.data
      console.log(res.data)
      successMessage(`为您总共生成${remainSize * (city.length || 1)}个标题`)
      // 多城市需要拷贝下结果
      if (city.length > 1) {
        setDataList(city.reduce<CollectionCreateTitleParmas[]>((value, item) => {
          return value.concat(titles.map(cItem => {
            return {
              ...cItem,
              city_id: item.value,
              cityName: item.label,
              content: notCityWord ? cItem.content : cItem.content.replace((city[0])?.label, item.label)
            }
          }))
        }, []))
      } else {
        setDataList(titles.map(item => ({
          ...item,
          city_id: (city[0])?.value,
        })))
      }
      setSelectTitleVisible(true)
      setLastPreviewTime()
      setSaveWordData({
        aiSource: 'posttool',
        area: values.area?.map(item => item.label) || [],
        prefix: values.prefix.split('\n'),
        coreWords: values.main.split('\n'),
        suffix: values.suffix.split('\n'),
      })
    }
    setUpdataLoading(false)
  }

  // 保存wordId
  const saveWordFn = async () => {
    const res = await saveWord(saveWordData)
    await updateCollection({ id, wordId: res.data })
  }

  return <>
    <MainTitle title="批量添加标题" showJumpIcon />
    <div className={styles['post-title-create-container']}>
      <ul className={styles["ai-handle-tips"]}>
        <h3>组合规则说明：</h3>
        <li>1.  勾选“标题不含城市”后，标题中不会带有城市</li>
        <li>2.  行政区可以不选择，也可以选择1个或多个</li>
        <li>3.  前置修饰词、主关键词、后置修饰词点击换行（enter）键实现添加，点击文字可以直接修改。</li>
      </ul>
      <Form name="create-task-form" form={form}>
        <Row className={styles["group-words-list"]} gutter={24}>
          <FormArea form={form} key={'FormArea'}></FormArea>
          {
            formItemList.map((item, index) => {
              return <FormTextarea item={item} form={form} key={item.key} ref={ref => textareaRef.current[item.key as keyof Omit<Omit<CollectionTitleApiParams, 'area'>, 'city'>] = ref}></FormTextarea>
            })
          }
        </Row>
      </Form>
      <Button className={styles['create-btn']} disabled={upDataLoading} loading={upDataLoading} onClick={handleClickPreview} >预览标题</Button>
    </div>
    <PostPreviewTitle page='titlePage' action='edit' taskId={id} editDataList={dataList} visible={selectTitleVisible} onCancel={setSelectTitleVisible} onOk={saveWordFn}></PostPreviewTitle>
  </>
}

export default PostTitleCreate