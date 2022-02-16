import { Card } from 'antd';
import { Anime } from '../components/Anime/Anime';

export function Connecting() {
  return (
    <Card className="flex justify-center items-center pt-16 overflow-y-scroll overflow-x-hidden absolute lg:left-40 lg:right-40 sm:top-8 sm:bottom-8 top-1 bottom-1 left-4 right-4">
      <Anime />
    </Card>
  );
}
