import { Modal, Row, Col, Button } from 'antd';
import { useMemo } from 'react';
import { useApi } from 'src/hooks';
import { getThemeColor } from 'src/config';

interface ConfirmDialogProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

export const ConfirmDialog = (props: ConfirmDialogProps) => {
  const { network } = useApi();

  const mainColor = useMemo(() => {
    return getThemeColor(network);
  }, [network]);

  return (
    <Modal
      title={null}
      footer={null}
      visible={props.visible}
      destroyOnClose
      onCancel={props.onCancel}
      bodyStyle={{
        paddingTop: '50px',
        paddingLeft: '80px',
        paddingRight: '80px',
        paddingBottom: '50px',
      }}
    >
      <div className="text-center text-black-800 text-xl font-semibold leading-none">{props.title}</div>

      <div className="text-center text-sm text-black-800 font-semibold mt-6">{props.content}</div>

      <Row gutter={16} className="mt-6">
        <Col span={12}>
          <Button block type="primary" onClick={props.onConfirm}>
            OK
          </Button>
        </Col>

        <Col span={12}>
          <Button
            block
            style={{
              color: mainColor,
            }}
            onClick={props.onCancel}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};
