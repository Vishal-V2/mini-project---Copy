import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';

const PrisonerList = () => {
  const [prisoners, setPrisoners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrisoner, setSelectedPrisoner] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchPrisoners = async () => {
      try {
        const response = await axios.get('http://localhost:5384/api/prisoners');
        setPrisoners(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch prisoners data');
        setLoading(false);
      }
    };

    fetchPrisoners();
  }, []);

  const handleInfoClick = (prisoner) => {
    setSelectedPrisoner(prisoner);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPrisoner(null);
  };

  if (loading) return <Typography>Loading prisoners data...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Prisoner Registry
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Crime</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cell Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prisoners.map((prisoner) => (
              <TableRow key={prisoner._id}>
                <TableCell>{`${prisoner.firstName} ${prisoner.lastName}`}</TableCell>
                <TableCell>
                  {new Date().getFullYear() - new Date(prisoner.dateOfBirth).getFullYear()}
                </TableCell>
                <TableCell>{prisoner.crime}</TableCell>
                <TableCell>
                  <Chip 
                    label={prisoner.severityLevel}
                    color={
                      prisoner.severityLevel === 'High' ? 'error' :
                      prisoner.severityLevel === 'Medium' ? 'warning' : 'success'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{prisoner.status}</TableCell>
                <TableCell>{prisoner.cellNumber}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleInfoClick(prisoner)}>
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedPrisoner && (
          <>
            <DialogTitle>
              Prisoner Details: {selectedPrisoner.firstName} {selectedPrisoner.lastName}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Personal Information
                </Typography>
                <Typography>Date of Birth: {new Date(selectedPrisoner.dateOfBirth).toLocaleDateString()}</Typography>
                <Typography>Gender: {selectedPrisoner.gender}</Typography>
                <Typography>Address: {selectedPrisoner.address}</Typography>

                <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                  Case Information
                </Typography>
                <Typography>Crime: {selectedPrisoner.crime}</Typography>
                <Typography>Sentence: {selectedPrisoner.sentence} years</Typography>
                <Typography>Admission Date: {new Date(selectedPrisoner.admissionDate).toLocaleDateString()}</Typography>
                <Typography>Release Date: {new Date(selectedPrisoner.releaseDate).toLocaleDateString()}</Typography>

                <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                  Emergency Contact
                </Typography>
                <Typography>Name: {selectedPrisoner.emergencyContact.name}</Typography>
                <Typography>Relationship: {selectedPrisoner.emergencyContact.relationship}</Typography>
                <Typography>Phone: {selectedPrisoner.emergencyContact.phone}</Typography>
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

export default PrisonerList; 