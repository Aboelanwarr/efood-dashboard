import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { Container, Box, Typography, TextField, FormControl, Button} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddGeneralSection() {
  const onSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data = JSON.stringify({
      section_name: e.target['section_name'].value,
      section_description: e.target['section_description'].value
    })

    fetch(`${process.env.REACT_APP_SERVER_URL}/admin/branch/add-general-section`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: data,
      redirect: "follow"
    })
    .then((response) => response.json())
    .then((result) => {
      if (result.status === "success" && result.data) {
        console.log("Response Status:", result.status === "success");
        toast.success("Branch Added Successfully");
      } else {
        toast.error("Failed to add branch section");
      }
    })
    .catch((error) => {
      toast.error("Failed to add branch section");
      console.log(error);
    });
};

  return (
    <Container fixed sx={{ mt: "20px" }}>
      <Typography variant="h4" color="initial">
        <AddBusinessIcon fontSize='inherit' /> Add General Section
      </Typography>
      <form onSubmit={onSubmit}>
        <Box sx={{ margin: '20px 0' }}>
          <Typography variant="h6" color="initial">General Section Details</Typography>
          <FormControl fullWidth margin="normal">
            <TextField name='section_name' label="Section Name" variant="outlined" required />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField name='section_description' label="Section Description" variant="outlined" required />
          </FormControl>
        </Box>
        <Button variant="contained" color="primary" type="submit" sx={{ marginTop: "20px", marginBottom: "20px" }}>
          Add
        </Button>
      </form>
    </Container>
  );
}