import React from 'react';
import {
  InputBase,
  MenuItem,
  Select,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';

//                                Useages

// <BasicSelect
// fullWidth
//   options={DUMMY_OPTIONS}
//     value={name}
//     onChange={(e)=> setName(e.target.value)}
//   defaultText="Select Privacy"
//   mapping={{ label: 'label', value: 'value' }}
// />

const BasicInputSelect = styled(InputBase)(({ theme }) => ({
  backgroundColor: 'white',
  fontSize: '15px',
  height: '2.5rem',
  padding: '0 12px',
  borderRadius: '4px',
  border: '1px solid #ced4da',
  transition: theme.transitions.create(['border-color', 'box-shadow']),
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  '&:focus': {
    borderRadius: 4,
    boxShadow: 'unset',
    backgroundColor: '#fff',
  },
  '& input::placeholder': {
    color: '#082852',
  },
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    minHeight: 'unset',
    height: '100%',
    padding: '0 !important',
  },
  '& .MuiSelect-icon': {
    right: 10,
  },
}));


const menuItemSx = {
  '&:hover': {
    backgroundColor: '#cbd4ff',
    color: '#133159',
  },
  '&.Mui-selected': {
    backgroundColor: '#cbd4ff',
    color: '#133159',
  },
};

const lineThroughItemSx = {
  textDecoration: 'line-through',
  color: '#ee1b54',
};

const deletedNoteSx = {
  fontSize: '9px',
  ml: 1,
};

const preloaderSx = {
  position: 'absolute',
  top: 0,
  left: 0,
  backgroundColor: '#e3e9e9',
  width: '100%',
  padding: '8px',
  fontSize: '13px',
  borderRadius: '4px',
  border: '1px solid #ced4da',
  color: '#c89999',
  userSelect: 'none',
  cursor: 'progress',
};

const BasicSelect = ({
  options,
  mapping = { label: 'title', value: 'id' },
  defaultText = 'Select',
  name = 'default',
  onChange,
  value = '',
  disabled = false,
  selectedOption,
  deletedMapping,
  className = null,
  emptyable = false,
  fullWidth = true,
  multiple = false,
  isLoading = false,
  error = '',
  dropDownHeight = '350px'
}) => {
  const placeholderColor = 'rgb(8 40 82 / 44%)';
  const activeColor = '#36454F';

  const handleSelectChange = (event) => {
    let newValue = event.target.value;

    if (multiple) {
      if (!newValue.length) {
        newValue = [''];
      } else {
        if (newValue[newValue.length - 1] === '' && emptyable) {
          newValue = [''];
        } else {
          newValue = newValue.filter((val) => val !== '');
        }
      }
    }

    onChange({ ...event, target: { ...event.target, value: newValue } });

    if (selectedOption && !multiple) {
      const selected = options.find(
        (option) => option[mapping.value] === newValue
      );
      if (selected) {
        selectedOption(selected);
      }
    }
  };

  const renderOptions = () =>
    options.map((option, index) => {
      const isDeleted =
        deletedMapping && option[deletedMapping.field] === deletedMapping.value;
      const isCurrent = value === option[mapping.value];

      if (isDeleted && !isCurrent) return null;

      return (
        <MenuItem
          key={index}
          value={option[mapping.value]}
          sx={{
            ...menuItemSx,
            ...(isDeleted ? lineThroughItemSx : {}),
          }}
        >
          {option[mapping.label]}
          {isDeleted && <span style={deletedNoteSx}>(deleted)</span>}
        </MenuItem>
      );
    });

  return (
    <div style={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
      <Select
        fullWidth={fullWidth}
        defaultValue={value}
        value={value}
        onChange={handleSelectChange}
        name={name}
        displayEmpty
        disabled={disabled}
        multiple={multiple}
        input={
          <BasicInputSelect
            style={{
              color:
                multiple ? (!value[0] ? placeholderColor : activeColor) : (!value ? placeholderColor : activeColor),
            }}
          />
        }
        inputProps={{ 'aria-label': 'Without label' }}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          PaperProps: {
            style: {
              maxHeight: dropDownHeight,
            },
            sx: {
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                borderRadius: '10px',
                backgroundColor: '#346fef',
              },
              '&::-webkit-scrollbar-track': {
                borderRadius: '10px',
                backgroundColor: '#2c3e50',
              },
            },
          },
          getContentAnchorEl: null,
        }}
        className={className ?? ''}
        error={!!error}
      >
        <MenuItem
          value=""
          disabled={!emptyable}
          sx={{
            ...menuItemSx, color: '#c0c0c0', fontSize: '15px',

            '&.Mui-disabled': {
              opacity: 1,
              color: '#999',
              fontStyle: 'italic',
              fontSize: '15px'
            },
          }}
        >
          {defaultText}
        </MenuItem>
        {renderOptions()}
      </Select>

      {isLoading && <div style={preloaderSx}>Loading...</div>}

      {!!error && (
        <FormHelperText style={{ position: 'absolute' }} error>
          {error}
        </FormHelperText>
      )}
    </div>
  );
};

export default BasicSelect;
