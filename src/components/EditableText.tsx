import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import React, { CSSProperties, useState } from 'react';
import { validateMessages } from '../config';
import i18n from '../config/i18n';

export interface EditableTextProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  textNode: any;
  onSave: (value: Record<string, unknown>) => void;
  // onCancel: (value: Record<string, unknown>) => void;
  allowEnterToSave?: boolean;
  hideControlBtn?: boolean;
  textContainerStyles?: CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues?: { [key: string]: any };
  layout?: 'column' | 'row';
  isEditing?: boolean;
}

// eslint-disable-next-line complexity
export function EditableText(props: React.PropsWithChildren<EditableTextProps>) {
  const [isEditing, setIsEditing] = useState(!!props.isEditing);
  const [form] = useForm();
  const isColumn = props.layout === 'column';

  return (
    <>
      {isEditing ? (
        <Form
          form={form}
          onFinish={(value) => {
            props.onSave(value);
            setIsEditing(false);
          }}
          onKeyDown={(event: React.KeyboardEvent) => {
            if (props.allowEnterToSave && event.key === 'Enter') {
              form.submit();
            }
          }}
          initialValues={props?.initialValues}
          style={{ width: '100%' }}
          validateMessages={validateMessages[i18n.language as 'en' | 'zh-CN' | 'zh']}
        >
          <div
            className="flex items-center"
            style={{
              display: isColumn ? 'block' : 'flex',
            }}
          >
            {props.children}
            {!props.hideControlBtn && (
              <div style={isColumn ? { display: 'flex', gap: 10, marginTop: 10 } : {}}>
                <Button type={isColumn ? 'default' : 'link'} danger={isColumn} onClick={() => setIsEditing(false)}>
                  {isColumn ? 'Cancel' : <CloseOutlined />}
                </Button>
                <Button htmlType="submit" type={isColumn ? 'default' : 'link'}>
                  {isColumn ? 'Save' : <CheckOutlined />}
                </Button>
              </div>
            )}
          </div>
        </Form>
      ) : (
        <div className="flex items-center gap-2">
          <div onDoubleClick={() => setIsEditing(true)} style={props?.textContainerStyles}>
            {props.textNode}
          </div>

          <EditOutlined onClick={() => setIsEditing(true)} className="opacity-30 hover:opacity-70" />
        </div>
      )}
    </>
  );
}
