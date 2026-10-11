/* global jest */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Icon-Fonts werden in Tests nicht geladen; Icons als Text-Platzhalter rendern.
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const Icon = ({ name }) => React.createElement(Text, { accessibilityElementsHidden: true }, '');
  Icon.displayName = 'MockIcon';
  return { Ionicons: Icon };
});

jest.mock('expo-haptics', () => ({ selectionAsync: jest.fn(() => Promise.resolve()) }));
