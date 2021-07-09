import React, { useCallback, useEffect, useMemo, useState, useContext, FC } from 'react';
import { Button } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import styles from './index.less'
import ImgUploadContext from '@/components/img-upload/context'
import { UploadFile } from 'antd/lib/upload/interface';

const ModalFooter: FC = () => {
  const context = useContext(ImgUploadContext)
  const { fileList, localFileList, initConfig: { maxLength }, handleChangeLocalFileList, handleChangeFileList, handleChangeAlbumVisible } = context
  const empty = useMemo(() => {
    return Array.from({ length: maxLength - localFileList.length })
  }, [localFileList, maxLength])

  const handleDel = (file: UploadFile) => {
    handleChangeLocalFileList(localFileList.filter(item => item.uid !== file.uid))
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("json", `${index}`)
  }


  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    // 默认地，无法将数据/元素放置到其他元素中。如果需要设置允许放置，我们必须阻止对元素的默认处理方式。这要通过调用ondragover 事件的 event.preventDefault()
    // 如果不阻止dragover的默认行为，drop就不会触发
    e.preventDefault();
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, endIndex: number) => {
    e.preventDefault()
    e.persist()
    const newLocalFileList = [...localFileList]
    const startIndex = Number(e.dataTransfer.getData("json"))
    newLocalFileList[startIndex] = newLocalFileList.splice(endIndex, 1, newLocalFileList[startIndex])[0];
    handleChangeLocalFileList(newLocalFileList)
  }

  const handleClickOk = () => {
    handleChangeFileList([...localFileList], fileList, null)
    handleChangeAlbumVisible(false)
  }

  return <div className={styles['modal-footer']}>
    <div className={styles['tip']}>
      您一共选择了 <span className={styles['num']}>{localFileList.length}</span> 张图片<span className={styles['ps']}>（最多可添加<span>{maxLength}</span>张图片，支持鼠标拖拽排序）</span>
    </div>
    <div className={styles['line']}>
      {
        localFileList.map((item, index) => <div className={styles["item"]} draggable={true} onDragStart={(e) => handleDragStart(e, index)} onDrop={(e) => handleDrop(e, index)} onDragOver={handleDragOver} key={item.uid}>
          <img className={styles['img']} src={item.preview} draggable={false} ></img>
          <div className={styles['delete']} onClick={() => handleDel(item)}>
            <DeleteOutlined style={{
              color: '#fff'
            }} />
          </div>
        </div>)
      }
      {
        empty.map((_item, index) => <div className={styles['empty']} key={`${index}`}>
          <PlusOutlined style={{
            fontSize: 20,
            color: '#999'
          }} />
        </div>)
      }
      <Button disabled={localFileList.length === 0} onClick={handleClickOk}>确定</Button>
    </div>
  </div>
}
export default ModalFooter