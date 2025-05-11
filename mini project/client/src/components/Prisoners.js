import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Typography,
    Paper,
    InputAdornment,
    MenuItem,
    Grid,
    Chip
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import useFetch from '../hooks/useFetch';

const statusColors = {
    'Incarcerated': 'error',
    'Released': 'success',
    'On Parole': 'warning',
    'Transferred': 'info'
};

const PrisonerDialog = ({ open, handleClose, prisoner, prisons, onSubmit }) => {
    const [formData, setFormData] = useState(prisoner || {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        crime: '',
        sentence: '',
        status: 'Incarcerated',
        prisonId: '',
        cellNumber: '',
        releaseDate: '',
        notes: ''
    });

    useEffect(() => {
        if (prisoner) {
            setFormData(prisoner);
        }
    }, [prisoner]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {prisoner ? 'Edit Prisoner' : 'Add New Prisoner'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                margin="normal"
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                margin="normal"
                                required
                            >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Crime"
                                name="crime"
                                value={formData.crime}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Sentence"
                                name="sentence"
                                value={formData.sentence}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                margin="normal"
                                required
                            >
                                {Object.keys(statusColors).map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Prison"
                                name="prisonId"
                                value={formData.prisonId}
                                onChange={handleChange}
                                margin="normal"
                                required
                            >
                                {prisons?.map((prison) => (
                                    <MenuItem key={prison._id} value={prison._id}>
                                        {prison.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Cell Number"
                                name="cellNumber"
                                value={formData.cellNumber}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Release Date"
                                name="releaseDate"
                                type="date"
                                value={formData.releaseDate}
                                onChange={handleChange}
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                margin="normal"
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {prisoner ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const Prisoners = () => {
    const { data: prisoners, loading: prisonersLoading, error: prisonersError, refetch: refetchPrisoners } = useFetch('/api/prisoners');
    const { data: prisons, loading: prisonsLoading } = useFetch('/api/prisons');
    const [open, setOpen] = useState(false);
    const [selectedPrisoner, setSelectedPrisoner] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpen = (prisoner = null) => {
        setSelectedPrisoner(prisoner);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedPrisoner(null);
        setOpen(false);
    };

    const handleSubmit = async (formData) => {
        try {
            const url = selectedPrisoner
                ? `/api/prisoners/${selectedPrisoner._id}`
                : '/api/prisoners';
            const method = selectedPrisoner ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save prisoner');
            }

            refetchPrisoners();
        } catch (error) {
            console.error('Error saving prisoner:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this prisoner?')) {
            try {
                const response = await fetch(`/api/prisoners/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete prisoner');
                }

                refetchPrisoners();
            } catch (error) {
                console.error('Error deleting prisoner:', error);
            }
        }
    };

    const getPrisonName = (prisonId) => {
        const prison = prisons?.find(p => p._id === prisonId);
        return prison ? prison.name : 'Unknown';
    };

    const columns = [
        {
            field: 'fullName',
            headerName: 'Name',
            flex: 1,
            valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`,
        },
        { field: 'dateOfBirth', headerName: 'Date of Birth', flex: 1 },
        { field: 'gender', headerName: 'Gender', flex: 1 },
        { field: 'crime', headerName: 'Crime', flex: 1 },
        { field: 'sentence', headerName: 'Sentence', flex: 1 },
        { field: 'cellNumber', headerName: 'Cell Number', flex: 1 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={statusColors[params.value] || 'default'}
                    size="small"
                />
            ),
        },
        {
            field: 'prisonId',
            headerName: 'Prison',
            flex: 1,
            valueGetter: (params) => getPrisonName(params.value),
        },
        { 
            field: 'releaseDate', 
            headerName: 'Release Date', 
            flex: 1,
            valueGetter: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'N/A'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        color="primary"
                        onClick={() => handleOpen(params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => handleDelete(params.row._id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const filteredPrisoners = prisoners?.filter(prisoner =>
        Object.values(prisoner).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

    if (prisonersError) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">Error loading prisoners: {prisonersError}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Prisoners</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Add Prisoner
                </Button>
            </Box>

            <Paper sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search prisoners..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={filteredPrisoners}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableSelectionOnClick
                    loading={prisonersLoading || prisonsLoading}
                    getRowId={(row) => row._id}
                />
            </Paper>

            <PrisonerDialog
                open={open}
                handleClose={handleClose}
                prisoner={selectedPrisoner}
                prisons={prisons}
                onSubmit={handleSubmit}
            />
        </Box>
    );
};

export default Prisoners; 