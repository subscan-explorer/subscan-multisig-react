import { Layout } from 'antd';
import { NetConfig } from '../model';
import { Language } from './Language';

export function Footer({ className = '' }: { networkConfig: NetConfig; className?: string }) {
  return (
    <Layout.Footer
      className={`flex flex-col md:flex-row md:items-center md:justify-between lg:px-40 px-2 text-gray-400 z-10 md:fixed bottom-0 left-0 right-0 md:py-6 py-2 ${className}`}
      style={{ background: '#2d2d2d' }}
    >
      <div className="flex items-center justify-between md:mt-0 mt-2 gap-4">
        <Language />
      </div>
    </Layout.Footer>
  );
}
