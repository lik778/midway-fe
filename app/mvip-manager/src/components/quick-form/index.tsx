import React from 'react'
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Slider,
  Switch,
  TreeSelect,
  InputNumber,
  TimePicker,
  Radio
} from 'antd'
import moment from 'moment'

import './index.less'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

const DEFAULT_ROW_GUTTER = 24
const DEFAULT_COL_SPAN = { span: 6 }

function themed(styles: any, type: any) {
  let defaultWidth
  switch (type) {
    default:
      defaultWidth = '100%'
  }
  return Object.assign({ width: defaultWidth }, styles)
}

interface Props {
  fields: any
  onFieldsChange: any
  onValuesChange: any
  className?: string
  form: any // TODO
  items: any[]
  children?: React.ReactNode
  autoLayout?: boolean
  fixedLabelWidth?: boolean
  colSpan?: any
  rowGutter?: number
}
export default function InlineForm(props: Props) {
  const {
    fields,
    onFieldsChange,
    onValuesChange,
    className = '',
    form,
    items,
    children,
    autoLayout = true,
    fixedLabelWidth = false,
    colSpan = DEFAULT_COL_SPAN,
    rowGutter = DEFAULT_ROW_GUTTER,
    ...rest
  } = props

  let countNullLen = 0
  let countArrayLen = 0
  let formItems = items.map((item, formItemIdx) => {
    const { type = 'input' } = item
    const key = item.name || item.type
    const allProps = { type, item, form, key }
    if (type === 'null') {
      countNullLen += 1
    }
    if (type === 'line') {
      countNullLen = 0
      countArrayLen = 0
    }

    const $item =
      type === 'render'
        ? item.render instanceof Array
          ? item.render.filter(Boolean)
          : item.render
        : getFormItemInstance(allProps)

    const calcColSpanVal = (indexOffset = 0) => {
      let colSpanValue = colSpan instanceof Function
        ? colSpan(item, formItemIdx + indexOffset - countNullLen + countArrayLen)
        : colSpan
      switch (type) {
        case 'range-picker':
          colSpanValue = { span: 8 }
          break
        case 'line':
          colSpanValue = { span: 24 }
          break
      }
      return colSpanValue
    }

    if (!$item) return null
    if (!autoLayout) return $item

    return $item instanceof Array ? (
      (() => {
        countArrayLen += $item.length
        return $item.map((x, i) => <Col {...calcColSpanVal(i)} key={key+i}>{x}</Col>)
      })
    ) : (
      <Col {...calcColSpanVal()} key={key}>{$item}</Col>
    )
  })

  // 过滤空子项并降维
  formItems = formItems.filter(Boolean)  .reduce((p, c) => p.concat(c), [])

  return (
    <Form
      layout='inline'
      className={[
        'inline-form',
        className,
        autoLayout ? 'auto-layout' : '',
        fixedLabelWidth ? 'fixed-label-width' : ''
      ].join(' ')}
      fields={fields}
      onFieldsChange={(_, allFields) => onFieldsChange(allFields)}
      onValuesChange={(_, allValues) => onValuesChange(allValues)}
      {...rest}
    >
      {autoLayout ? (
        <Row gutter={rowGutter}>{formItems}</Row>
      ):(
        <React.Fragment>{formItems}</React.Fragment>
      )}
    </Form>
  )
}

function getFormItemInstance(allProps: any) {
  const { type, item = {} } = allProps
  switch (type) {
    case 'select':
      return <FormSelect {...allProps} {...item} />
    case 'range-picker':
      return <FormRangePicker {...allProps} {...item} />
    case 'line':
      return <div />
    case 'null':
      return null
    default:
      throw new Error('Unsupported FormItem Type!')
  }
}

function FormSelect(props: any) {
  const {
    item,
    form,
    colStyle = {},
    style = {},
    ...rest
  } = props
  const {
    type,
    label,
    name,
    required = false,
    message,
    options = [],
  } = item
  return (
    <FormItem name={name} label={label} rules={[{required,message}]} {...colStyle}>
      <Select allowClear style={themed(style, type)} {...rest}>
        {options.map(({ label, value }) => (
          <Option value={value} key={value}>
            {label}
          </Option>
        ))}
      </Select>
    </FormItem>
  )
}

function FormRangePicker(props: any) {
  const {
    item,
    form,
    colStyle = {},
    style = {},
    format = 'YYYY-MM-DD',
    ...rest
  } = props
  const {
    type,
    label,
    name,
    required = false,
    message,
  } = item
  return (
    <FormItem name={name} label={label} rules={[{required,message}]} {...colStyle}>
      <RangePicker style={themed(style, type)} {...rest} />
    </FormItem>
  )
}
