import React, { useState, useEffect } from 'react';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { Container, Box, Typography, TextField, FormControl, Button, Select, MenuItem,InputLabel } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ItemByTime() {
  const [itemList, setItemList] = useState([]);
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/branch/general-menu-list`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if(result.status === "success"){
          setItemList(result.data);
        }else{
          console.error("Failed to fetch item list:", result);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = JSON.stringify({
      itemId: e.target['itemId'].value,
      itemDayType: e.target['itemDayType'].value,
    })
    console.log("Sending data:", data);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: data,
      redirect: "follow"
    };
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/menu/itemByTime`, requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      if (result.status === "success" && result.data && result.data.values) {
        console.log("Response Status:", result.status === "success");
        toast.success("Item Added Succesfully");
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
        <AddBusinessIcon fontSize='inherit' /> Add New Item By Time
      </Typography>
      <form onSubmit={onSubmit}>
        <Box sx={{ margin: '20px 0' }}>
        <Typography variant="h5" color="initial">Select Item</Typography>
        <FormControl fullWidth margin="normal">
        <InputLabel id="demo-simple-select-Item-label">Select Item</InputLabel>
          <Select
            labelId="demo-simple-select-Item-label"
            id="demo-simple-select-Item"
            label="Select Item Id"
            fullWidth
            name='itemId'
          >
            {
              itemList?.map(item => (
                <MenuItem key={item["id"]} value={item["id"]}>{item["name"]}</MenuItem>
              ))
            }
          </Select>
          </FormControl>
          <Typography variant="h5" color="initial">Select Item Day Type</Typography>
          <FormControl fullWidth margin="normal">
        <InputLabel id="demo-simple-select-ItemDayType-label">Select Item Day Type</InputLabel>
          <Select
            labelId="demo-simple-select-ItemDayType-label"
            id="demo-simple-select"
            label="Select Item Day Type"
            fullWidth
            name='itemDayType'
          >
            <MenuItem value="breakfast">Breakfast</MenuItem>
            <MenuItem value="lunch">Lunch</MenuItem>
            <MenuItem value="dinner">Dinner</MenuItem>
            <MenuItem value="brunch">Brunch</MenuItem>
            <MenuItem value="supper">Supper</MenuItem>
            <MenuItem value="midnight">Midnight</MenuItem>
            <MenuItem value="snack">Snack</MenuItem>
          </Select>
        </FormControl>
        </Box>
        <Button variant="contained" color="primary" type="submit" sx={{ marginTop: "20px", marginBottom: "20px" }}>
          Add
        </Button>
      </form>
    </Container>
  );
}



