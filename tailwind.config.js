module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: (_) => ({
        darwinia: 'linear-gradient(-45deg, #fe3876 0%, #7c30dd 71%, #3a30dd 100%)',
      }),
      backgroundColor: (_) => ({
        crab: '#7C30DD',
        pangolin: '#5745DE',
        polkadot: '#e6007a',
        kusama: '#000',
      }),
      borderRadius: {
        xl: '10px',
        lg: '8px',
      },
      colors: (_) => ({
        pangolin: {
          main: '#5745DE',
        },
        crab: {
          main: '#7C30DD',
        },
        darwinia: {
          main: '#3a30dd',
        },
        polkadot: {
          main: '#e6007a',
        },
        kusama: {
          main: '#000',
        },
        custom: {
          main: '#e6007a',
        },
        red: {
          800: '#E90979',
        },
        black: {
          800: '#302B3C',
        },
        gray: {
          100: '#F3F5F9',
          200: '#f8f9fa',
        },
        divider: '#efefef',
      }),
      height: {
        'screen-sub-head': 'calc(100vh - 68px)',
        'screen-sub-head-footer': 'calc(100vh - 2 * 68px)',
      },
    },
  },
};
