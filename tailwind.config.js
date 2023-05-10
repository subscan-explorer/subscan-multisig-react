module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: (_) => ({
        polkadot: '#e6007a',
        kusama: '#000',
      }),
      borderRadius: {
        xl: '10px',
        lg: '8px',
      },
      colors: (_) => ({
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
