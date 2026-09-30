import IcomoonReact from 'icomoon-react';

import iconSet from '../../icomoon-selection.json';

export const MoonIcon = (
  props: React.HTMLAttributes<HTMLElement> & {
    icon: string;
    size?: number | string;
    color?: string;
    className?: string;
  }
) => <IcomoonReact iconSet={iconSet} {...props} />;
