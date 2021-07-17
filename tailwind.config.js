module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], // tree-shake unused css in production
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: (_) => ({
        darwinia: 'linear-gradient(-45deg, #fe3876 0%, #7c30dd 71%, #3a30dd 100%)',
      }),
      backgroundColor: (_) => ({
        crab: '#EC3783',
        pangolin: '#5745DE',
      }),
      borderRadius: {
        xl: '10px',
        lg: '8px',
      },
    },
  },
};
