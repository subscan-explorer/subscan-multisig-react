import { Card } from 'antd';
import { Anime } from '../components/Anime/Anime';

export function Connecting() {
  return (
    <Card className="flex justify-center items-center pt-16 h-full overflow-y-scroll overflow-x-hidden">
      <Anime />
    </Card>
  );
}
