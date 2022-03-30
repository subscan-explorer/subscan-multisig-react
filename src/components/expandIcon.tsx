import { Tooltip } from 'antd';
import iconDown from 'src/assets/images/icon_down.svg';
import iconMembers from 'src/assets/images/icon_members.svg';

export const genExpandIcon =
  () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ expanded, onExpand, record }: any) =>
    (
      // <Button
      //   shape="circle"
      //   onClick={(event) => onExpand(record, event)}
      //   icon={<RightOutlined className={`text-sm text-${network}-main`} />}
      //   className={`flex items-center justify-center transition origin-center duration-300 transform rotate-${
      //     expanded ? '90' : '0'
      //   }`}
      // />
      <div
        style={{ border: 'solid 1px #DBDBDB', transform: expanded ? 'rotate(180deg)' : '' }}
        className="w-12 h-6 flex items-center justify-center rounded-md cursor-pointer"
        onClick={(event) => onExpand(record, event)}
      >
        <img src={iconDown} />
      </div>
    );

export const genExpandMembersIcon =
  (tooltipText: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ onExpand, record }: any) =>
    (
      // <Button
      //   shape="circle"
      //   onClick={(event) => onExpand(record, event)}
      //   icon={<RightOutlined className={`text-sm text-${network}-main`} />}
      //   className={`flex items-center justify-center transition origin-center duration-300 transform rotate-${
      //     expanded ? '90' : '0'
      //   }`}
      // />
      <div
        style={{ border: 'solid 1px #DBDBDB' }}
        className="w-14 h-7 flex items-center justify-center rounded-md cursor-pointer"
        onClick={(event) => onExpand(record, event)}
      >
        <Tooltip title={tooltipText}>
          <img src={iconMembers} />
        </Tooltip>
      </div>
    );
