import { Alert, Button, Space, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../hooks';
import { simulateCall, SimulationResult, withSimulationTimeout } from '../utils/helper/simulation';

interface Props {
  address: string;
  callHex: string;
  prepareCall?: () => Promise<string>;
  scope?: 'inner' | 'operation';
}

// eslint-disable-next-line complexity
export function TransactionSimulation({ address, callHex, prepareCall, scope = 'inner' }: Props) {
  const { api, rpc } = useApi();
  const specVersion = api?.runtimeVersion.specVersion.toString();
  const { t } = useTranslation();
  const [result, setResult] = useState<SimulationResult>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const generation = useRef(0);
  useEffect(() => {
    generation.current += 1;
    setResult(undefined);
    setError('');
    setBusy(false);
    return () => {
      generation.current += 1;
    };
  }, [api, rpc, specVersion, address, callHex, prepareCall, scope]);

  // eslint-disable-next-line complexity
  const run = async () => {
    if (!api) return;
    const request = ++generation.current;
    setBusy(true);
    setError('');
    setResult(undefined);
    try {
      const value = await withSimulationTimeout(
        (async () => {
          const hex = prepareCall ? await prepareCall() : callHex;
          return simulateCall(api, address, hex);
        })()
      );
      if (request === generation.current) setResult(value);
    } catch (failure) {
      if (request === generation.current) {
        const reason = failure instanceof Error ? failure.message : '';
        setError(['simulation.unsupported', 'simulation.timeout'].includes(reason) ? reason : 'simulation.unavailable');
      }
    } finally {
      if (request === generation.current) setBusy(false);
    }
  };

  const outcome = result?.errors.length
    ? 'failed'
    : scope === 'inner'
    ? 'innerSuccess'
    : result?.executed
    ? 'executed'
    : result?.approvalOnly
    ? 'approvalOnly'
    : 'success';
  return (
    <div className="my-3" style={{ minWidth: 0 }}>
      <Space wrap>
        <Typography.Text strong>
          {t(scope === 'inner' ? 'simulation.innerTitle' : 'simulation.operationTitle')}
        </Typography.Text>
        <Button size="small" loading={busy} disabled={!api || !address || (!callHex && !prepareCall)} onClick={run}>
          {t(result ? 'simulation.rerun' : 'simulation.run')}
        </Button>
      </Space>
      <p className="text-sm mt-2">{t(scope === 'inner' ? 'simulation.innerScope' : 'simulation.operationScope')}</p>
      {error && <Alert showIcon type="warning" message={t(error)} />}
      {result && (
        <div aria-live="polite">
          <Alert
            showIcon
            type={result.errors.length ? 'error' : 'success'}
            message={t(`simulation.${outcome}`)}
            description={result.errors.length ? result.errors.join('; ') : undefined}
          />
          <Typography.Paragraph className="mt-2" style={{ overflowWrap: 'anywhere' }}>
            {t('simulation.block')}: <Typography.Text copyable>{result.block}</Typography.Text>
          </Typography.Paragraph>
          {result.forwardedXcm && <Alert type="warning" message={t('simulation.xcm')} />}
          <details>
            <summary>{t('simulation.events')}</summary>
            <pre style={{ maxHeight: 240, overflow: 'auto', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
              {JSON.stringify(result.events, null, 2)}
            </pre>
          </details>
        </div>
      )}
      <p className="text-sm mt-2">{t('simulation.disclaimer')}</p>
    </div>
  );
}
