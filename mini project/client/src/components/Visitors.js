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
    Chip,
    FormControl,
    InputLabel,
    Select,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import useFetch from '../hooks/useFetch';

const visitTypeColors = {
    'Regular Visit': 'primary',
    'Legal Visit': 'info',
    'Family Visit': 'success',
    'Special Visit': 'warning'
};

const statusColors = {
    'Pending': 'warning',
    'Approved': 'success',
    'Rejected': 'error',
    'Completed': 'info',
    'Cancelled': 'default'
};

const VisitorDialog = ({ open, handleClose, visit, prisoners, onSubmit }) => {
    const [formData, setFormData] = useState(visit || {
        prisonerId: '',
        visitorName: '',
        visitorId: '',
        relationship: '',
        visitType: 'Regular Visit',
        visitDate: '',
        visitTime: '',
        duration: '30',
        status: 'Pending',
        purpose: '',
        notes: ''
    });

    useEffect(() => {
        if (visit) {
            setFormData(visit);
        }
    }, [visit]);

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
                {visit ? 'Edit Visit' : 'Schedule New Visit'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Prisoner"
                                name="prisonerId"
                                value={formData.prisonerId}
                                onChange={handleChange}
                                margin="normal"
                                required
                            >
                                {prisoners?.map((prisoner) => (
                                    <MenuItem key={prisoner._id} value={prisoner._id}>
                                        {`${prisoner.firstName} ${prisoner.lastName}`}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Visitor Name"
                                name="visitorName"
                                value={formData.visitorName}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Visitor ID"
                                name="visitorId"
                                value={formData.visitorId}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Relationship"
                                name="relationship"
                                value={formData.relationship}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Visit Type"
                                name="visitType"
                                value={formData.visitType}
                                onChange={handleChange}
                                margin="normal"
                                required
                            >
                                {Object.keys(visitTypeColors).map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Visit Date"
                                name="visitDate"
                                type="date"
                                value={formData.visitDate}
                                onChange={handleChange}
                                margin="normal"
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Visit Time"
                                name="visitTime"
                                type="time"
                                value={formData.visitTime}
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
                                label="Duration (minutes)"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                margin="normal"
                                required
                            >
                                <MenuItem value="30">30 minutes</MenuItem>
                                <MenuItem value="60">1 hour</MenuItem>
                                <MenuItem value="90">1.5 hours</MenuItem>
                                <MenuItem value="120">2 hours</MenuItem>
                            </TextField>
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
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Purpose of Visit"
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                margin="normal"
                                required
                                multiline
                                rows={2}
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
                        {visit ? 'Update' : 'Schedule'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const Visitors = () => {
    const { data: visits, loading: visitsLoading, error: visitsError, refetch: refetchVisits } = useFetch('/api/visits');
    const { data: prisoners, loading: prisonersLoading } = useFetch('/api/prisoners');
    const [open, setOpen] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpen = (visit = null) => {
        setSelectedVisit(visit);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedVisit(null);
        setOpen(false);
    };

    const handleSubmit = async (formData) => {
        try {
            const url = selectedVisit
                ? `/api/visits/${selectedVisit._id}`
                : '/api/visits';
            const method = selectedVisit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save visit');
            }

            refetchVisits();
        } catch (error) {
            console.error('Error saving visit:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this visit record?')) {
            try {
                const response = await fetch(`/api/visits/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete visit');
                }

                refetchVisits();
            } catch (error) {
                console.error('Error deleting visit:', error);
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await fetch(`/api/visits/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update visit status');
            }

            refetchVisits();
        } catch (error) {
            console.error('Error updating visit status:', error);
        }
    };

    const getPrisonerName = (prisonerId) => {
        const prisoner = prisoners?.find(p => p._id === prisonerId);
        return prisoner ? `${prisoner.firstName} ${prisoner.lastName}` : 'Unknown';
    };

    const columns = [
        {
            field: 'prisonerId',
            headerName: 'Prisoner',
            flex: 1,
            valueGetter: (params) => getPrisonerName(params.value),
        },
        { field: 'visitorName', headerName: 'Visitor', flex: 1 },
        { field: 'relationship', headerName: 'Relationship', flex: 1 },
        {
            field: 'visitType',
            headerName: 'Type',
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={visitTypeColors[params.value] || 'default'}
                    size="small"
                />
            ),
        },
        { field: 'visitDate', headerName: 'Date', flex: 1 },
        { field: 'visitTime', headerName: 'Time', flex: 1 },
        { field: 'duration', headerName: 'Duration', flex: 1, valueGetter: (params) => `${params.value} min` },
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
                    {params.row.status === 'Pending' && (
                        <>
                            <IconButton
                                color="success"
                                onClick={() => handleStatusChange(params.row._id, 'Approved')}
                            >
                                <CheckCircleIcon />
                            </IconButton>
                            <IconButton
                                color="error"
                                onClick={() => handleStatusChange(params.row._id, 'Rejected')}
                            >
                                <CancelIcon />
                            </IconButton>
                        </>
                    )}
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

    const filteredVisits = visits?.filter(visit =>
        Object.values(visit).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

    if (visitsError) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">Error loading visits: {visitsError}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Visits</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Schedule Visit
                </Button>
            </Box>

            <Paper sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search visits..."
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
                    rows={filteredVisits}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableSelectionOnClick
                    loading={visitsLoading || prisonersLoading}
                    getRowId={(row) => row._id}
                />
            </Paper>

            <VisitorDialog
                open={open}
                handleClose={handleClose}
                visit={selectedVisit}
                prisoners={prisoners}
                onSubmit={handleSubmit}
            />
        </Box>
    );
};

export default Visitors; 