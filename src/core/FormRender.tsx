import React, { memo, useEffect, RefObject } from 'react';
import { Form, Select, InputNumber, Input, Switch, Radio } from 'antd';
import MutiText from './FormComponents/MutiText';
import Color from './FormComponents/Color';
import Pos from './FormComponents/Pos';
import RichText from './FormComponents/XEditor';
import { Store } from 'antd/lib/form/interface';
import FormItems from './FormComponents/FormItems';

const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

interface FormEditorProps {
  uid: string;
  onSave: Function;
  defaultValue: { [key: string]: any };
  config: Array<any>;
  rightPannelRef: RefObject<HTMLDivElement>;
}

const FormEditor = (props: FormEditorProps) => {
  const { config, defaultValue, onSave, rightPannelRef, uid } = props;

  const renderFormItem = (item: any, i: number) => {
    let node;
    switch (item.type) {
      case 'Number':
        node = (
          <Form.Item label={item.name} name={item.key} key={i}>
            <InputNumber min={0} max={item.range && item.range[1]} />
          </Form.Item>
        );
        break;
      case 'Text':
        node = (
          <Form.Item label={item.name} name={item.key} key={i}>
            <Input placeholder={item.placeholder} />
          </Form.Item>
        );
        break;
      case 'TextArea':
        node = (
          <Form.Item label={item.name} name={item.key} key={i}>
            <TextArea rows={4} />
          </Form.Item>
        );
        break;
      case 'Color':
        node = (
          <Form.Item label={item.name} name={item.key} key={i}>
            <Color />
          </Form.Item>
        );
        break;
      case 'MutiText':
        node = (
          <Form.Item label={item.name} name={item.key} key={i}>
            <MutiText />
          </Form.Item>
        );
        break;
      case 'Select':
        node = (
          <Form.Item label={item.name} name={item.key} key={i}>
            <Select placeholder="请选择">
              {item.range.map((v: any, i: number) => {
                return (
                  <Option value={v.key} key={i}>
                    {v.text}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        );
        break;
      case 'Radio':
        node = (
          <Form.Item label={item.name} name={item.key} key={i}>
            <Radio.Group>
              {item.range.map((v: any, i: number) => {
                return (
                  <Radio value={v.key} key={i}>
                    {v.text}
                  </Radio>
                );
              })}
            </Radio.Group>
          </Form.Item>
        );
        break;
      case 'Switch':
        node = (
          <Form.Item
            label={item.name}
            name={item.key}
            valuePropName="checked"
            key={i}
          >
            <Switch />
          </Form.Item>
        );
        break;
      case 'FormItems':
        node = (
          <Form.Item name={item.key} valuePropName="formList" key={i}>
            <FormItems data={item.data} rightPannelRef={rightPannelRef} />
          </Form.Item>
        );
        break;
      case 'Pos':
        node = (
          <Form.Item label={item.name} name={item.key} key={i}>
            <>
              <Pos />
              {item.placeObj && (
                <div style={{ marginTop: 10, fontSize: 12 }}>
                  <a href={item.placeObj.link} target="_blank">
                    {item.placeObj.text}
                  </a>
                </div>
              )}
            </>
          </Form.Item>
        );
        break;
      case 'RichText':
        node = (
          <Form.Item label={item.name} name={item.key} noStyle={true} key={i}>
            <RichText />
          </Form.Item>
        );
        break;
      default:
        node = null;
    }
    return node;
  };

  const onFinish = (values: Store) => {
    onSave && onSave(values);
  };

  const handlechange = () => {
    onFinish(form.getFieldsValue());
  };

  const [form] = Form.useForm();

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, [uid, form]);
  return (
    <Form
      form={form}
      name={`form_editor`}
      {...formItemLayout}
      onFinish={onFinish}
      initialValues={defaultValue}
      onValuesChange={handlechange}
    >
      <div>
        <h3>基本配置</h3>
        {config.map((item, i) => {
          return renderFormItem(item, i);
        })}
      </div>
    </Form>
  );
};

export default memo(FormEditor);
