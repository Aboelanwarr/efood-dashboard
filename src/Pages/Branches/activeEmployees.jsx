import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Autocomplete, Container, FormControl,TextField, Typography } from '@mui/material';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#D5D5D5',
    color: theme.palette.common.black,
    fontWeight: '600',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderBottom: '10px solid #F9F9F9',
    fontWeight: '500',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
export default function CustomizedTables() {
  const [branchEmployeeList, setBranchEmployeeList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const token = localStorage.getItem('token');
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/branch/branches-list`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(result => {
        if (result.status === "success") {
          setBranchList(result.data);
          // Optionally, set the first branch as selected by default
          if (result.data.length > 0) {
            setSelectedBranchId(result.data[0].id); // Assuming 'id' is the identifier
          }
        } else {
          console.error("Failed to fetch branch list:", result);
        }
      })
      .catch(error => console.error(error));
  }, [token]);

  useEffect(() => {
    // Fetch tables list based on selected branch ID
    if (!selectedBranchId) return; // Do not fetch if no branch is selected
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/branch/activeEmployees/${selectedBranchId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          setBranchEmployeeList(result.data.employees);
          console.log(result.data.employees);
        } else {
          console.error("Failed to fetch employee list:", result);
        }
      })
      .catch((error) => console.error(error));
  }, [selectedBranchId, token]);


  return (
    <Container fixed sx={{ mt: "20px" }}>
      <Typography variant="h4" color="initial" sx={{ mb: "20px" }}>
        <AddBusinessIcon fontSize='inherit' /> Branch Employee List
      </Typography>
      <FormControl fullWidth sx={{ mb: "20px" }}>
        <Autocomplete
          options={branchList}
          getOptionLabel={(option) => option.branch_name}
          renderInput={(params) => (
            <TextField {...params} label="Branch" variant="outlined" size="small" />
          )}
          value={branchList.find(branch => branch.id === selectedBranchId) || null} // Ensure the selected value is displayed
          onChange={(event, newValue) => {
            setSelectedBranchId(newValue ? newValue.branch_id : '');
          }}
        />
      </FormControl>
      <TableContainer component={Paper} sx={{ width: '100%', margin: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Employee ID</StyledTableCell>
              <StyledTableCell>Employee Name</StyledTableCell>
              <StyledTableCell >Employee Date Hired	</StyledTableCell>
              <StyledTableCell >Employee status	</StyledTableCell>
              <StyledTableCell >Employee branch	</StyledTableCell>
              <StyledTableCell >Employee section	</StyledTableCell>
              <StyledTableCell >Employee position	</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {branchEmployeeList.map((row) => (
              <StyledTableRow key={row.employee_id}>
                <StyledTableCell > {row.employee_id}	</StyledTableCell>
                <StyledTableCell > {row.employee_name}	</StyledTableCell>
                <StyledTableCell >{row.employee_date_hired}	</StyledTableCell>
                <StyledTableCell >{row.employee_status}	</StyledTableCell>
                <StyledTableCell >{row.employee_branch}	</StyledTableCell>
                <StyledTableCell >{row.empolyee_section}	</StyledTableCell>
                <StyledTableCell >{row.employee_position}	</StyledTableCell>

              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}


