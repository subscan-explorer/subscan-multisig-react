import { RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { NetworkType } from '../model';

export const genExpandIcon =
  (network: NetworkType) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ expanded, onExpand, record }: any) =>
    (
      <Button
        shape="circle"
        onClick={(event) => onExpand(record, event)}
        icon={<RightOutlined className={`text-sm text-${network}-main`} />}
        className={`flex items-center justify-center transition origin-center duration-300 transform rotate-${
          expanded ? '90' : '0'
        }`}
      />
    );
