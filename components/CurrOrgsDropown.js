import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

// This component is a dropdown menu that allows the user to select their organization
const data = [
  { label: 'Item 1', value: '1'},
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

const CurrOrgsDropdown = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <Dropdown
      style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      data={data}
      labelField="label"
      valueField="value"
      placeholder={'Select Your Organization'}
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={item => {
        setValue(item.value);
        setIsFocus(false);
      }}
      autoScroll={false}
    />
  );
};

export default CurrOrgsDropdown;

const styles = StyleSheet.create({
  dropdown: {
    width: '100%',
    height: '100%',
  },
  placeholderStyle: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedTextStyle: {
    fontSize: 16,
    textAlign: 'center',
  }
});