import React, { useContext, useState, useEffect, useRef } from 'react';
import { Input, Form, Spin } from 'antd';
import { EditableContext } from './context'
import styles from './style.less'
import { errorMessage } from '@/components/message';

const TextArea = Input.TextArea

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  upDataLoading: boolean;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  upDataLoading,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<Input>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    // 如果数据在上传 则不允许修改其他项（因为没记录当前修改项）
    if (upDataLoading) return
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      if (values[dataIndex] !== record[dataIndex]) {
        if (!values[dataIndex] || values[dataIndex].length === 0) {
          errorMessage('问答内容不得为空！')
        } else {
          await handleSave({ ...record, ...values });
        }
      }
      toggleEdit();
    } catch (errInfo) {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }
  };

  let childNode = <span className={styles['text-value-wrap']}>{children}</span>;

  if (editable) {
    childNode = editing ? (
      <Spin spinning={upDataLoading}>
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
        >
          <TextArea ref={inputRef}  autoSize={{ minRows: 1, maxRows: 6 }} onPressEnter={save} onBlur={save} />
        </Form.Item>
      </Spin>
    ) : (
      <div className={`${styles['editable-cell-value-wrap']} ${styles['text-value-wrap']}`} style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell