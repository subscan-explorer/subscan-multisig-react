import { svgIconFactory } from './icon-factory';

function RightCircle() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient x1="100%" y1="100%" x2="0%" y2="0%" id="linearGradient-1">
          <stop stopColor="#FE3876" offset="0%"></stop>
          <stop stopColor="#7C30DD" offset="71.4447846%"></stop>
          <stop stopColor="#3A30DD" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g id="1.通用/2.Icon图标/Line/Transfer" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect id="矩形" fill="#000000" fillRule="nonzero" opacity="0" x="0" y="0" width="16" height="16"></rect>
        <path
          d="M8,2 C11.3137085,2 14,4.6862915 14,8 C14,11.3137085 11.3137085,14 8,14 C4.6862915,14 2,11.3137085 2,8 C2,4.6862915 4.6862915,2 8,2 Z M8.18292438,5.53068972 C8.13528934,5.51160431 8.03411294,5.48263129 7.90940733,5.51361634 C7.77455412,5.54713648 7.72044572,5.60037425 7.69882816,5.6355888 L7.69882816,5.6355888 L7.68539442,5.66677971 L7.68458378,7.22354105 L4.5,7.22349545 L4.5,8.71302802 L7.68458378,8.71340996 L7.6845886,10.3720623 L7.68692954,10.3777259 L7.71239893,10.4137214 C7.74161382,10.4445431 7.7992945,10.4834957 7.90941216,10.4974672 C8.03788276,10.5132414 8.11858825,10.4509334 8.14658865,10.4320043 L8.14658865,10.4320043 L11.2134117,8.3584871 L11.2581911,8.3323611 C11.3387941,8.28015839 11.5,8.14987346 11.5,7.94283744 C11.5,7.74053338 11.3855806,7.62784669 11.328371,7.58414734 L11.328371,7.58414734 L8.21246579,5.54437602 Z"
          id="形状结合"
          fill="url(#linearGradient-1)"
        ></path>
      </g>
    </svg>
  );
}

export const RightCircleIcon = svgIconFactory(RightCircle);
