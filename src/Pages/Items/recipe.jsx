import React, { useState, useEffect } from 'react';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { Container, Box, Typography, TextField, FormControl, Button, Select, MenuItem, InputLabel, Autocomplete } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Recipe() {
  const [itemList, setItemList] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/branch/general-menu-list`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          setItemList(result.data);
        } else {
          console.error("Failed to fetch item list:", result);
        }
      })
      .catch((error) => console.error(error));
  }, []);
  
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/branch/ingredients`, requestOptions) 
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          setIngredientList(result.data);
        } else {
          console.error("Failed to fetch ingredient list:", result);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = JSON.stringify({
      itemId: selectedItemId,
      ingredientId: selectedIngredientId,
      quantity: e.target['quantity'].value,
      recipeStatus: e.target['recipeStatus'].value,
    })
    console.log("Sending data:", data);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: data,
      redirect: "follow"
    };
    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/menu/recipe`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS" && result.data) {
          console.log("Response Status:", result.status === "SUCCESS");
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
        <AddBusinessIcon fontSize='inherit' /> Add New Recipe
      </Typography>
      <form onSubmit={onSubmit}>
        <Box sx={{ margin: '20px 0' }}>
        <Typography variant="h5" color="initial">Select Item</Typography>
        <FormControl fullWidth sx={{ mb: "20px" }}>
            <Autocomplete sx={{ mt: 1 }}
              options={itemList}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Item" variant="outlined" size="small" />
              )}
              value={itemList.find(item => item.id === selectedItemId) || null} // Ensure the selected value is displayed
              onChange={(event, newValue) => {
                setSelectedItemId(newValue ? newValue.id : '');
              }}
            />
          </FormControl>
          <Typography variant="h5" color="initial">Select Ingredient</Typography>
          <FormControl fullWidth sx={{ mb: "20px" }}>
            <Autocomplete sx={{ mt: 1 }}
              options={ingredientList}
              getOptionLabel={(option) => option.ingredients_name}
              renderInput={(params) => (
                <TextField {...params} label="Ingredient" variant="outlined" size="small" />
              )}
              value={ingredientList.find(item => item.ingredient_id === selectedIngredientId) || null} // Ensure the selected value is displayed
              onChange={(event, newValue) => {
                setSelectedIngredientId(newValue ? newValue.ingredient_id : '');
              }}
            />
          </FormControl>
          <Typography variant="h5" color="initial">Quantity</Typography>
          <FormControl fullWidth margin="normal">
            <TextField name='quantity' label="Quantity" variant="outlined" required />
          </FormControl>
          <Typography variant="h5" color="initial">Select Recipe Status</Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-RecipeStatus-label">Select Recipe Status</InputLabel>
            <Select
              labelId="demo-simple-select-RecipeStatus-label"
              id="demo-simple-select-RecipeStatus"
              label="Select Recipe Status"
              fullWidth
              name='recipeStatus'
            >
              <MenuItem value="optional">Optional</MenuItem>
              <MenuItem value="required">Required</MenuItem>
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



