module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/config': './src/config',
          '@/features': './src/features',
          '@/hooks': './src/hooks',
          '@/navigation': './src/navigation',
          '@/screens': './src/screens',
          '@/services': './src/services',
          '@/store': './src/store',
          '@/types': './src/types',
          '@/utils': './src/utils',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};