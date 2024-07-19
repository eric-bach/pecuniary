'use client';

import { useMemo } from 'react';
import type { SingleValue } from 'react-select';
import * as Select from 'react-select/creatable';

type SelectProps = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};

export const CreatableSelect = ({ value, onChange, onCreate, options = [], disabled, placeholder }: SelectProps) => {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: '#fff',
      borderColor: state.isFocused ? '#000' : '#ccc',
      boxShadow: state.isFocused ? '0 0 0 1px #000' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#000' : '#aaa',
      },
      minHeight: '38px',
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '2px 8px',
    }),
    input: (provided: any) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: '#999',
      '&:hover': {
        color: '#666',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      marginTop: '2px',
      borderRadius: '4px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#f0f0f0' : state.isFocused ? '#e8e8e8' : '#fff',
      color: '#333',
      '&:active': {
        backgroundColor: '#dcdcdc',
      },
      // paddingLeft: '40px', // Indent the items to the right
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#333',
    }),
  };

  return (
    <Select.default
      placeholder={placeholder}
      className='h-10 text-sm'
      styles={customStyles}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  );
};
