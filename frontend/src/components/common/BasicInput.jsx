import { InputBase, styled } from "@mui/material";

//                              Useages
//  <BasicInput
//   placeholder="Search system wise"
//   name="appName"
//   endAdornment={
//     <InputAdornment position="end">
//       <SearchIcon sx={{ color: '#ced4da' }} />
//     </InputAdornment>
//   }
// />

const BasicInput = styled(InputBase)(({ theme }) => ({
  '&.MuiInputBase-root': {
    position: 'relative',
    marginTop: theme.spacing(1.5),
    backgroundColor: 'white',
    fontSize: 15,
    height: '2.5rem',
    padding: '0px 12px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    '&:focus-within': {
      boxShadow: 'unset',
    },
  },

  // Start and End Adornment styles
  '& .MuiInputAdornment-positionStart': {
    marginRight: 8,
    color: '#6f42c1',
  },
  '& .MuiInputAdornment-positionEnd': {
    marginLeft: 8,
  },

  // Input inside
  '& input': {
    flex: 1,
    fontSize: '15px',
    padding: 0,
    border: 'none',
    outline: 'none',
    height: '100%',
    backgroundColor: 'transparent',
    '&::placeholder': {
      color: '#082852',
    },
  },
}));

export default BasicInput;
