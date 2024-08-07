import React, { useState, useEffect } from 'react';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { Container, Box, Typography, TextField, FormControl, Button, Select, MenuItem, InputLabel, Autocomplete } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function AddCategory() {
  const [sectionList, setSectionList] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState('');
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/menu/sectionsList`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          setSectionList(result.data.sections);
        } else {
          console.error("Failed to fetch Section list:", result);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = JSON.stringify({
      sectionId: selectedSectionId,
      categoryName: e.target['categoryName'].value,
      categoryDescription: e.target['categoryDescription'].value,
    })
    console.log("Sending data:", data);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: data,
      redirect: "follow"
    };
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/menu/category`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.status === "success" && result.data) {
        console.log("Response Status:", result.status === "success");
        toast.success("Item Added Successfully");
      } else {
        toast.error(result.message);
      }
    })
    .catch((error) => {
      toast.error(error.message);
      console.log(error);
    });
};

  return (
    <Container fixed sx={{ mt: "20px" }}>
      <Typography variant="h4" color="initial">
        <AddBusinessIcon fontSize='inherit' /> Add New Category
      </Typography>
      <form onSubmit={onSubmit}>
        <Box sx={{ margin: '20px 0' }}>
        <Typography variant="h5" color="initial">Select Section</Typography>
        <FormControl fullWidth sx={{ mb: "20px" }}>
            <Autocomplete sx={{ mt: 1 }}
              options={sectionList}
              getOptionLabel={(option) => option.section_name}
              renderInput={(params) => (
                <TextField {...params} label="Sections" variant="outlined" size="small" />
              )}
              value={sectionList.find(section => section.section_id === selectedSectionId) || null} // Ensure the selected value is displayed
              onChange={(event, newValue) => {
                setSelectedSectionId(newValue ? newValue.section_id : '');
              }}
            />
          </FormControl>
          <Typography variant="h5" color="initial">Category Name</Typography>
          <FormControl fullWidth margin="normal">
            <TextField name='categoryName' label="Category Name" variant="outlined" required />
          </FormControl>
          <Typography variant="h5" color="initial">Category Description</Typography>
          <FormControl fullWidth margin="normal">
            <TextField name='categoryDescription' label="Category Description" variant="outlined" required />
          </FormControl>
        </Box>
        <Button variant="contained" color="primary" type="submit" sx={{ marginTop: "20px", marginBottom: "20px" }}>
          Add
        </Button>
      </form>
    </Container>
  );
}



