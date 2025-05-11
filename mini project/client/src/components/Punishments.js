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
    Select
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Warning as WarningIcon,
    Gavel as GavelIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import useFetch from '../hooks/useFetch';

const punishmentTypeColors = {
    'Solitary Confinement': 'error',
    'Loss of Privileges': 'warning',
    'Extra Duty': 'info',
    'Restricted Movement': 'secondary',
    'Warning': 'default'
};

const severityColors = {
    'High': 'error',
    'Medium': 'warning',
    'Low': 'info'
};

const PunishmentDialog = ({ open, handleClose, punishment, prisoners, onSubmit }) => {
    const [formData, setFormData] = useState(punishment || {
        prisonerId: '',
        type: '',
        description: '',
        startDate: '',
        endDate: '',
        severity: 'Medium',
        reason: '',
        imposedBy: '',
        status: 'Active',
        notes: ''
    });

    useEffect(() => {
        if (punishment) {
            setFormData(punishment);
        }
    }, [punishment]);

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
                {punishment ? 'Edit Punishment' : 'Add New Punishment'}
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
                                select
                                label="Punishment Type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                margin="normal"
                                required
                            >
                                {Object.keys(punishmentTypeColors).map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                margin="normal"
                                required
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Start Date"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                margin="normal"
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Date"
                                name="endDate"
                                type="date"
                                value={formData.endDate}
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
                                label="Severity"
                                name="severity"
                                value={formData.severity}
                                onChange={handleChange}
                                margin="normal"
                                required
                            >
                                {Object.keys(severityColors).map((severity) => (
                                    <MenuItem key={severity} value={severity}>
                                        {severity}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Imposed By"
                                name="imposedBy"
                                value={formData.imposedBy}
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
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                margin="normal"
                                required
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
                        {punishment ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const Punishments = () => {
    const { data: punishments, loading: punishmentsLoading, error: punishmentsError, refetch: refetchPunishments } = useFetch('/api/punishments');
    const { data: prisoners, loading: prisonersLoading } = useFetch('/api/prisoners');
    const [open, setOpen] = useState(false);
    const [selectedPunishment, setSelectedPunishment] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpen = (punishment = null) => {
        setSelectedPunishment(punishment);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedPunishment(null);
        setOpen(false);
    };

    const handleSubmit = async (formData) => {
        try {
            const url = selectedPunishment
                ? `/api/punishments/${selectedPunishment._id}`
                : '/api/punishments';
            const method = selectedPunishment ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save punishment');
            }

            refetchPunishments();
        } catch (error) {
            console.error('Error saving punishment:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this punishment record?')) {
            try {
                const response = await fetch(`/api/punishments/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete punishment');
                }

                refetchPunishments();
            } catch (error) {
                console.error('Error deleting punishment:', error);
            }
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
        {
            field: 'type',
            headerName: 'Type',
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={punishmentTypeColors[params.value] || 'default'}
                    size="small"
                />
            ),
        },
        { field: 'description', headerName: 'Description', flex: 1 },
        { field: 'startDate', headerName: 'Start Date', flex: 1 },
        { field: 'endDate', headerName: 'End Date', flex: 1 },
        {
            field: 'severity',
            headerName: 'Severity',
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={severityColors[params.value] || 'default'}
                    size="small"
                />
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'Active' ? 'error' : params.value === 'Completed' ? 'success' : 'default'}
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

    const filteredPunishments = punishments?.filter(punishment =>
        Object.values(punishment).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

    if (punishmentsError) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">Error loading punishments: {punishmentsError}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Punishments</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Add Punishment
                </Button>
            </Box>

            <Paper sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search punishments..."
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
                    rows={filteredPunishments}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableSelectionOnClick
                    loading={punishmentsLoading || prisonersLoading}
                    getRowId={(row) => row._id}
                />
            </Paper>

            <PunishmentDialog
                open={open}
                handleClose={handleClose}
                punishment={selectedPunishment}
                prisoners={prisoners}
                onSubmit={handleSubmit}
            />
        </Box>
    );
};

export default Punishments; 