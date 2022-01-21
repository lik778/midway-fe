
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css'
import { UploadFile } from 'antd/lib/upload/interface'
import { MediaItem } from '@/components/img-upload/data'
import styles from './index.less';
import CustomToolbar from './components/toolbar'
import { getImgUploadModelValue } from '@/components/img-upload'

interface Props {
  className?: string
  width?: string | number
  placeholder?: string
  disabled?: boolean
  value?: string | undefined
  onChange?(value: string): void,
}

const RichText: FC<Props> = (props) => {
  const { className, value = '', placeholder = '请输入', onChange, disabled, width } = props
  const [modules] = useState<any>({
    toolbar: {
      container: '#toolbar',
      handlers: {
        image() {
          return false
        }
      }
    },
    clipboard: {
      matchVisual: false,
    }
  });
  const [fullScreenFlag, setFullScreenFlag] = useState<boolean>(false)
  const editerRef = useRef<ReactQuill | null>()

  const handleSelectedImg = (values: "" | MediaItem | MediaItem[], fileList: UploadFile<any>[], oldFileList: UploadFile<any>[]) => {
    let data: MediaItem[] = []
    if (values) {
      if (Array.isArray(values)) {
        data = values
      } else {
        data.push(values)
      }
    }
    if (!editerRef.current) return
    let quill = editerRef.current.getEditor();//获取到编辑器本身
    let { index: editorIndex, length: editorLength } = quill.getSelection() || { index: 0, length: 0 }
    data.forEach(item => {
      const value = getImgUploadModelValue(item)
      quill.insertEmbed(editorIndex, "image", value);//插入图片
      editorIndex!++
    })
    quill.setSelection(editorIndex + 1, editorLength);//光标位置加1  
  }

  const handleClickFullScreen: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setFullScreenFlag((fullScreenFlag) => !fullScreenFlag)
  }

  return <>
    <div style={{ width: width }} className={fullScreenFlag ? styles['full-screen'] : ''}>
      <CustomToolbar handleSelectedImg={handleSelectedImg} handleClickFullScreen={handleClickFullScreen} fullScreenFlag={fullScreenFlag}/>
      <ReactQuill
        className={`${className} ${styles['quill']}`}
        ref={(el) => { editerRef.current = el }}
        placeholder={placeholder}
        readOnly={disabled}
        value={value}
        onChange={onChange}
        modules={modules}
        theme="snow"
      />
    </div>
  </>
}

export default RichText

