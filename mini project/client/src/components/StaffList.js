import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, Card, CardContent
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get('/api/staff');
        setStaff(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch staff data');
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleInfoClick = (staffMember) => {
    setSelectedStaff(staffMember);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStaff(null);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Warden': return 'error';
      case 'Guard': return 'warning';
      case 'Medical Staff': return 'success';
      case 'Counselor': return 'info';
      default: return 'default';
    }
  };

  if (loading) return <Typography>Loading staff data...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Staff Directory
      </Typography>
      <Grid container spacing={3}>
        {staff.map((staffMember) => (
          <Grid item xs={12} md={6} lg={4} key={staffMember._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {staffMember.firstName} {staffMember.lastName}
                  </Typography>
                  <IconButton onClick={() => handleInfoClick(staffMember)} size="small">
                    <InfoIcon />
                  </IconButton>
                </Box>
                <Chip 
                  label={staffMember.role}
                  color={getRoleColor(staffMember.role)}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="textSecondary">
                  Email: {staffMember.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Phone: {staffMember.phone}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Hire Date: {new Date(staffMember.hireDate).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedStaff && (
          <>
            <DialogTitle>
              Staff Details: {selectedStaff.firstName} {selectedStaff.lastName}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Personal Information
                </Typography>
                <Typography>Date of Birth: {new Date(selectedStaff.dateOfBirth).toLocaleDateString()}</Typography>
                <Typography>Gender: {selectedStaff.gender}</Typography>
                <Typography>Address: {selectedStaff.address}</Typography>

                <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                  Professional Information
                </Typography>
                <Typography>Role: {selectedStaff.role}</Typography>
                <Typography>Email: {selectedStaff.email}</Typography>
                <Typography>Phone: {selectedStaff.phone}</Typography>
                <Typography>Salary: ₹{selectedStaff.salary.toLocaleString()}</Typography>
                <Typography>Hire Date: {new Date(selectedStaff.hireDate).toLocaleDateString()}</Typography>
                <Typography>Qualifications: {selectedStaff.qualifications}</Typography>

                <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                  Responsibilities
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedStaff.responsibilities.map((responsibility, index) => (
                    <Chip 
                      key={index} 
                      label={responsibility} 
                      size="small" 
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                  Emergency Contact
                </Typography>
                <Typography>Name: {selectedStaff.emergencyContact.name}</Typography>
                <Typography>Relationship: {selectedStaff.emergencyContact.relationship}</Typography>
                <Typography>Phone: {selectedStaff.emergencyContact.phone}</Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default StaffList; 