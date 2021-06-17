import { svgIconFactory } from './icon-factory';

function Down() {
  return (
    <svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g id="DVM" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="其他网络" transform="translate(-528.000000, -195.000000)" fill="#000000">
          <g id="通用/Icon图标/Line/Down" transform="translate(528.000000, 195.000000)">
            <g id="up" fillRule="nonzero" opacity="0">
              <rect id="矩形" x="0" y="0" width="14" height="14"></rect>
            </g>
            <path
              d="M2.88128157,4.63128157 C3.22299032,4.28957281 3.77700968,4.28957281 4.11871843,4.63128157 L7.2123106,7.72487373 L10.3059028,4.63128157 C10.6476115,4.28957281 11.2016309,4.28957281 11.5433396,4.63128157 C11.8850484,4.97299032 11.8850484,5.52700968 11.5433396,5.86871843 L7.83102903,9.58102903 C7.48932028,9.92273779 6.93530092,9.92273779 6.59359217,9.58102903 L2.88128157,5.86871843 C2.53957281,5.52700968 2.53957281,4.97299032 2.88128157,4.63128157 Z"
              id="路径"
              fillOpacity="0.65"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
}

export const DownIcon = svgIconFactory(Down);
