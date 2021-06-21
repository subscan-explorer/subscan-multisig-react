import { DownOutlined } from '@ant-design/icons';
import { AutoComplete, AutoCompleteProps, Input, InputProps } from 'antd';

type AccountControlProps = {
  value?: Record<string, string>;
  valueKey?: string;
} & AutoCompleteProps &
  InputProps;

/**
 * TODO unused now
 *
 * @param param0
 * @returns
 */
export function AccountControl({ value, valueKey, placeholder, ...others }: AccountControlProps) {
  return (
    <AutoComplete
      value={valueKey && value && value[valueKey]}
      {...others}
      //       onSelect={(event) => {
      //         console.warn('%c [ event ]-16', 'font-size:13px; background:pink; color:#bf2c9f;', event);
      // 	onSelect()
      //       }}
      options={[
        { label: '111', value: 111 },
        { label: '222', value: 222 },
      ]}
    >
      <Input suffix={<DownOutlined className="opacity-30" />} size={others.size} placeholder={placeholder} />
    </AutoComplete>
  );
}
