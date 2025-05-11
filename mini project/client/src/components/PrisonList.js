import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Typography, Box, Card, CardContent,
  Grid, Chip
} from '@mui/material';
import axios from 'axios';

const PrisonList = () => {
  const [prisons, setPrisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrisons = async () => {
      try {
        const response = await axios.get('http://localhost:5384/api/prisons');
        setPrisons(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch prisons data');
        setLoading(false);
      }
    };

    fetchPrisons();
  }, []);

  if (loading) return <Typography>Loading prisons data...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Prison Facilities
      </Typography>
      <Grid container spacing={3}>
        {prisons.map((prison) => (
          <Grid item xs={12} md={6} key={prison._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {prison.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Location: {prison.location}
                </Typography>
                <Typography variant="body2" paragraph>
                  Type: {prison.type}
                </Typography>
                <Typography variant="body2" paragraph>
                  Capacity: {prison.capacity} inmates
                </Typography>
                <Typography variant="body2" paragraph>
                  {prison.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Facilities:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {prison.facilities.map((facility, index) => (
                      <Chip 
                        key={index} 
                        label={facility} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PrisonList; 