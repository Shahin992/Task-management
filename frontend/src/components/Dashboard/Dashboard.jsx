import React from 'react';
import { InputAdornment } from '@mui/material';
import BasicSelect from '../common/BasicSelect';

const DUMMY_OPTIONS = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
  { label: 'Team Only', value: 'team' },
  { label: 'Internal', value: 'internal' },
  { label: 'Partners Only', value: 'partners' },
  { label: 'Restricted', value: 'restricted' },
  { label: 'Beta Testers', value: 'beta' },
  { label: 'Admin Only', value: 'admin' },
  { label: 'Managers Only', value: 'managers' },
  { label: 'Confidential', value: 'confidential' },
  { label: 'Draft', value: 'draft' },
  { label: 'Archived', value: 'archived' },
  { label: 'In Review', value: 'review' },
  { label: 'Pending Approval', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'On Hold', value: 'hold' },
  { label: 'Live', value: 'live' },
  { label: 'Deprecated', value: 'deprecated' },
  { label: 'Custom Access', value: 'custom' },
];

const Dashboard = () => {
    const [name, setName] = React.useState('');
    
    return (
        <div style={{width:'100%', height:'100%',display:'flex',justifyContent:'center',alignItems:'center', backgroundColor:'#ffffff', borderRadius:'6px'}}>
            dashboard page
            <div style={{ width: 300 }}>
      <BasicSelect
      fullWidth
        options={DUMMY_OPTIONS}
         value={name}
         onChange={(e)=> setName(e.target.value)}
        defaultText="Select Privacy"
        mapping={{ label: 'label', value: 'value' }}
      />
    </div>
        </div>
    );
};

export default Dashboard;
