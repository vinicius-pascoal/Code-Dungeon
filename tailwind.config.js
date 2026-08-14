module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Press Start 2P"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        mono: ['"Press Start 2P"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        bg: '#090A14',
        panel: '#0D0E18',
        floor: '#000000',
        wall: '#171826',
        border: '#752438',
        primaryText: '#EBEDE9',
        secondaryText: '#B9BDB6',
        magic: '#EBEDE9',
        danger: '#752438',
        success: '#EBEDE9',
        treasure: '#EBEDE9',
        wood: '#7A367B'
      }
    }
  },
  plugins: []
};
