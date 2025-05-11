import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';

const VisitList = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await axios.get('http://localhost:5384/api/visits');
        setVisits(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch visits data');
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  const handleInfoClick = (visit) => {
    setSelectedVisit(visit);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVisit(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  if (loading) return <Typography>Loading visits data...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Visit Schedule
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Visitor Name</TableCell>
              <TableCell>Relationship</TableCell>
              <TableCell>Visit Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit._id}>
                <TableCell>{visit.visitorName}</TableCell>
                <TableCell>{visit.relationship}</TableCell>
                <TableCell>{visit.visitType}</TableCell>
                <TableCell>{new Date(visit.visitDate).toLocaleDateString()}</TableCell>
                <TableCell>{visit.visitTime}</TableCell>
                <TableCell>{visit.duration} minutes</TableCell>
                <TableCell>
                  <Chip 
                    label={visit.status}
                    color={getStatusColor(visit.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleInfoClick(visit)}>
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedVisit && (
          <>
            <DialogTitle>
              Visit Details: {selectedVisit.visitorName}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Visitor Information
                </Typography>
                <Typography>Name: {selectedVisit.visitorName}</Typography>
                <Typography>Relationship: {selectedVisit.relationship}</Typography>
                <Typography>Visitor ID: {selectedVisit.visitorId}</Typography>
                <Typography>Phone: {selectedVisit.phone}</Typography>
                <Typography>Address: {selectedVisit.address}</Typography>

                <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                  Visit Details
                </Typography>
                <Typography>Type: {selectedVisit.visitType}</Typography>
                <Typography>Date: {new Date(selectedVisit.visitDate).toLocaleDateString()}</Typography>
                <Typography>Time: {selectedVisit.visitTime}</Typography>
                <Typography>Duration: {selectedVisit.duration} minutes</Typography>
                <Typography>Status: {selectedVisit.status}</Typography>
                <Typography>Purpose: {selectedVisit.purpose}</Typography>
                <Typography>Notes: {selectedVisit.notes}</Typography>
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

export default VisitList; 