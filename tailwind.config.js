module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['Fira Code', 'Monaco', 'Courier New', 'monospace'],
      },
      colors: {
        bg: '#0F172A',
        panel: '#111827',
        floor: '#1E293B',
        wall: '#334155',
        border: '#475569',
        primaryText: '#F8FAFC',
        secondaryText: '#CBD5E1',
        magic: '#38BDF8',
        danger: '#EF4444',
        success: '#22C55E',
        treasure: '#FACC15',
        wood: '#92400E'
      }
    }
  },
  plugins: []
};
