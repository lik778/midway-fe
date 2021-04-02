import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, Spin } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { EditableContext } from './context'
import style from './style.less'
import { errorMessage } from '@/components/message';


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
          errorMessage('问题内容不得为空！')
        } else {
          await handleSave({ ...record, ...values });
        }
      }
      toggleEdit();
    } catch (errInfo) {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
      console.log('保存失败', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Spin spinning={upDataLoading}>
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      </Spin>
    ) : (
      <div className={style['editable-cell-value-wrap']} style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell