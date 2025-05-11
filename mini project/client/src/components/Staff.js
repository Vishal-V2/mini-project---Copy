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
    Person as PersonIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import useFetch from '../hooks/useFetch';

const roleColors = {
    'Warden': 'error',
    'Guard': 'primary',
    'Medical Staff': 'success',
    'Counselor': 'warning',
    'Administrative': 'info'
};

const shiftOptions = [
    'Morning (6AM-2PM)',
    'Afternoon (2PM-10PM)',
    'Night (10PM-6AM)'
];

const StaffDialog = ({ open, handleClose, staff, prisons, onSubmit }) => {
    const [formData, setFormData] = useState(staff || {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        prisonId: '',
        shift: '',
        salary: '',
        hireDate: '',
        qualifications: '',
        emergencyContact: '',
        notes: ''
    });

    useEffect(() => {
        if (staff) {
            setFormData(staff);
        }
    }, [staff]);

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
                {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
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
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                margin="normal"
                                required
                            >
                                {Object.keys(roleColors).map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
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
                                select
                                label="Shift"
                                name="shift"
                                value={formData.shift}
                                onChange={handleChange}
                                margin="normal"
                                required
                            >
                                {shiftOptions.map((shift) => (
                                    <MenuItem key={shift} value={shift}>
                                        {shift}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Salary"
                                name="salary"
                                type="number"
                                value={formData.salary}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Hire Date"
                                name="hireDate"
                                type="date"
                                value={formData.hireDate}
                                onChange={handleChange}
                                margin="normal"
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Qualifications"
                                name="qualifications"
                                value={formData.qualifications}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Emergency Contact"
                                name="emergencyContact"
                                value={formData.emergencyContact}
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
                        {staff ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const Staff = () => {
    const { data: staff, loading: staffLoading, error: staffError, refetch: refetchStaff } = useFetch('/api/staff');
    const { data: prisons, loading: prisonsLoading } = useFetch('/api/prisons');
    const [open, setOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpen = (staff = null) => {
        setSelectedStaff(staff);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedStaff(null);
        setOpen(false);
    };

    const handleSubmit = async (formData) => {
        try {
            const url = selectedStaff
                ? `/api/staff/${selectedStaff._id}`
                : '/api/staff';
            const method = selectedStaff ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save staff member');
            }

            refetchStaff();
        } catch (error) {
            console.error('Error saving staff member:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                const response = await fetch(`/api/staff/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete staff member');
                }

                refetchStaff();
            } catch (error) {
                console.error('Error deleting staff member:', error);
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
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phone', headerName: 'Phone', flex: 1 },
        {
            field: 'role',
            headerName: 'Role',
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={roleColors[params.value] || 'default'}
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
        { field: 'shift', headerName: 'Shift', flex: 1 },
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

    const filteredStaff = staff?.filter(staffMember =>
        Object.values(staffMember).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

    if (staffError) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">Error loading staff: {staffError}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Staff Members</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Add Staff Member
                </Button>
            </Box>

            <Paper sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search staff members..."
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
                    rows={filteredStaff}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableSelectionOnClick
                    loading={staffLoading || prisonsLoading}
                    getRowId={(row) => row._id}
                />
            </Paper>

            <StaffDialog
                open={open}
                handleClose={handleClose}
                staff={selectedStaff}
                prisons={prisons}
                onSubmit={handleSubmit}
            />
        </Box>
    );
};

export default Staff; 