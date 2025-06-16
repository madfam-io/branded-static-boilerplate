export default {
  plugins: {
    'autoprefixer': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-properties': true,
        'custom-media-queries': true,
      }
    },
    'cssnano': process.env.NODE_ENV === 'production' ? {
      preset: ['default', {
        discardComments: {
          removeAll: false, // Preserve educational comments
        },
        normalizeWhitespace: true,
        colormin: true,
        convertValues: true,
      }]
    } : false
  }
};