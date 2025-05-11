import React, { useState } from 'react';
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
    InputAdornment
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import useFetch from '../hooks/useFetch';

const PrisonDialog = ({ open, handleClose, prison, onSubmit }) => {
    const [formData, setFormData] = useState(prison || {
        name: '',
        location: '',
        capacity: '',
        type: '',
        description: ''
    });

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
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{prison ? 'Edit Prison' : 'Add New Prison'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Capacity"
                        name="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {prison ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const Prisons = () => {
    const { data: prisons, loading, error, refetch } = useFetch('/api/prisons');
    const [open, setOpen] = useState(false);
    const [selectedPrison, setSelectedPrison] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpen = (prison = null) => {
        setSelectedPrison(prison);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedPrison(null);
        setOpen(false);
    };

    const handleSubmit = async (formData) => {
        try {
            const url = selectedPrison
                ? `/api/prisons/${selectedPrison._id}`
                : '/api/prisons';
            const method = selectedPrison ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save prison');
            }

            refetch();
        } catch (error) {
            console.error('Error saving prison:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this prison?')) {
            try {
                const response = await fetch(`/api/prisons/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete prison');
                }

                refetch();
            } catch (error) {
                console.error('Error deleting prison:', error);
            }
        }
    };

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'location', headerName: 'Location', flex: 1 },
        { field: 'capacity', headerName: 'Capacity', flex: 1 },
        { field: 'type', headerName: 'Type', flex: 1 },
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

    const filteredPrisons = prisons?.filter(prison =>
        Object.values(prison).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">Error loading prisons: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Prisons</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Add Prison
                </Button>
            </Box>

            <Paper sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search prisons..."
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
                    rows={filteredPrisons}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableSelectionOnClick
                    loading={loading}
                    getRowId={(row) => row._id}
                />
            </Paper>

            <PrisonDialog
                open={open}
                handleClose={handleClose}
                prison={selectedPrison}
                onSubmit={handleSubmit}
            />
        </Box>
    );
};

export default Prisons; 