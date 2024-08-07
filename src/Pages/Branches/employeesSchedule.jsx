import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Autocomplete, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import DatePicker from '../../components/DatePicker';

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
  const [employeeAttendanceList, setEmployeeAttendanceList] = useState([]);
  const handleDateChange = (newDate, dateType) => {
    console.log(`Selected Date for ${dateType}:`, newDate);
    if (dateType === 'fromDate') {
      setFromDate(newDate);
    } else if (dateType === 'toDate') {
      setToDate(newDate);
    }
  };
  const [branchList, setBranchList] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    // Fetch branches list
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/branch/branches-list`, requestOptions)
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
  }, []);
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/branch/employeesSchedule/${selectedBranchId}?fromDate=${fromDate}&toDate=${toDate}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          setEmployeeAttendanceList(result.data.schedule);
        } else {
          console.error("Failed to fetch employee list:", result);
        }
      })
      .catch((error) => console.error(error));
  }, [selectedBranchId, fromDate, toDate]);
  return (
    <Container fixed sx={{ mt: "20px" }}>
      <Typography variant="h4" color="initial" sx={{ mb: "20px" }}>
        <AddBusinessIcon fontSize='inherit' /> Employee Schedule List
      </Typography>
      <FormControl fullWidth sx={{ mb: "20px" }}>
            <Autocomplete sx={{ mt: 1 }}
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
      <InputLabel id="demo-simple-select-label">From Date</InputLabel>
      <FormControl fullWidth sx={{ mb: "20px" }}>
        <DatePicker onChange={(newDate) => handleDateChange(newDate, 'fromDate')} />
      </FormControl>
      <InputLabel id="demo-simple-select-label">To Date</InputLabel>
      <FormControl fullWidth sx={{ mb: "20px" }}>
        <DatePicker onChange={(newDate) => handleDateChange(newDate, 'toDate')} />
      </FormControl>
      <TableContainer component={Paper} sx={{ width: '100%', margin: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Employee ID</StyledTableCell>
              <StyledTableCell>Employee Name</StyledTableCell>
              <StyledTableCell >Employee shift start time	</StyledTableCell>
              <StyledTableCell >Employee attendance in	</StyledTableCell>
              <StyledTableCell >Employee shift end time	</StyledTableCell>
              <StyledTableCell >Employee attendance out	</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employeeAttendanceList.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell > {index + 1}	</StyledTableCell>
                <StyledTableCell > {row.employee}	</StyledTableCell>
                <StyledTableCell > {row.shift_start_time}	</StyledTableCell>
                <StyledTableCell >{row.attendance_in}	</StyledTableCell>
                <StyledTableCell >{row.shift_end_time}	</StyledTableCell>
                <StyledTableCell >{row.attendance_out}	</StyledTableCell>

              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}


