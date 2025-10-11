import React from 'react';
import { RadioButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface Props extends React.ComponentProps<typeof RadioButton.Item> {}

export default function AppRadioButtonItem(props: Props) {
  return (
    <RadioButton.Item
      {...props}
      labelStyle={[styles.label, props.labelStyle]}
      style={[styles.itemStyle, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: 'PatrickHandSC',
    fontSize: 16,
  },
  itemStyle: {
    marginRight: 4, // 👈 reduce horizontal spacing between items
    paddingHorizontal: 0, // remove side padding
    paddingVertical: 0, // tighten up vertical spacing if needed
  },
});
