module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@/api': './src/api',
          '@/assets': './src/assets',
          '@/components': './src/components',
          '@/config': './src/config',
          '@/features': './src/features',
          '@/lib': './src/lib',
          '@/navigation': './src/navigation',
          '@/store': './src/store',
          '@/shared': './src/shared',
        },
      },
    ],
    'react-native-reanimated/plugin', // This must be the last plugin
  ],
};