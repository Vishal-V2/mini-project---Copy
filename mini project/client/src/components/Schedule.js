import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    IconButton,
    Tooltip,
    Tabs,
    Tab,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Event as EventIcon,
    Group as GroupIcon,
    Person as PersonIcon,
    AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import useFetch from '../hooks/useFetch';

const eventTypes = {
    'Program': { color: '#1976d2', icon: <GroupIcon /> },
    'Visit': { color: '#2e7d32', icon: <PersonIcon /> },
    'Staff Meeting': { color: '#ed6c02', icon: <GroupIcon /> },
    'Medical Checkup': { color: '#9c27b0', icon: <PersonIcon /> },
    'Counseling': { color: '#d32f2f', icon: <PersonIcon /> }
};

const EventDialog = ({ open, handleClose, event, prisoners, staff, onSubmit }) => {
    const [formData, setFormData] = useState(event || {
        title: '',
        type: 'Program',
        startDate: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        location: '',
        description: '',
        participants: [],
        staff: [],
        status: 'Scheduled'
    });

    useEffect(() => {
        if (event) {
            setFormData(event);
        }
    }, [event]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            startDate: date
        }));
    };

    const handleTimeChange = (field) => (time) => {
        setFormData(prev => ({
            ...prev,
            [field]: time
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
                {event ? 'Edit Event' : 'Schedule New Event'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Event Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Event Type</InputLabel>
                                <Select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    label="Event Type"
                                    required
                                >
                                    {Object.keys(eventTypes).map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Date"
                                    value={formData.startDate}
                                    onChange={handleDateChange}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    label="Start Time"
                                    value={formData.startTime}
                                    onChange={handleTimeChange('startTime')}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    label="End Time"
                                    value={formData.endTime}
                                    onChange={handleTimeChange('endTime')}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Participants</InputLabel>
                                <Select
                                    multiple
                                    name="participants"
                                    value={formData.participants}
                                    onChange={handleChange}
                                    label="Participants"
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const prisoner = prisoners?.find(p => p._id === value);
                                                return (
                                                    <Chip
                                                        key={value}
                                                        label={prisoner ? `${prisoner.firstName} ${prisoner.lastName}` : value}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                >
                                    {prisoners?.map((prisoner) => (
                                        <MenuItem key={prisoner._id} value={prisoner._id}>
                                            {`${prisoner.firstName} ${prisoner.lastName}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Staff</InputLabel>
                                <Select
                                    multiple
                                    name="staff"
                                    value={formData.staff}
                                    onChange={handleChange}
                                    label="Staff"
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const staffMember = staff?.find(s => s._id === value);
                                                return (
                                                    <Chip
                                                        key={value}
                                                        label={staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : value}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                >
                                    {staff?.map((staffMember) => (
                                        <MenuItem key={staffMember._id} value={staffMember._id}>
                                            {`${staffMember.firstName} ${staffMember.lastName}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {event ? 'Update' : 'Schedule'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const EventCard = ({ event, onEdit, onDelete }) => {
    const eventType = eventTypes[event.type] || { color: '#757575', icon: <EventIcon /> };

    return (
        <Card sx={{ mb: 2, borderLeft: `4px solid ${eventType.color}` }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            {event.title}
                        </Typography>
                        <Chip
                            icon={eventType.icon}
                            label={event.type}
                            size="small"
                            sx={{ mb: 1, bgcolor: eventType.color, color: 'white' }}
                        />
                    </Box>
                    <Box>
                        <IconButton size="small" onClick={() => onEdit(event)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => onDelete(event._id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endTime).toLocaleTimeString()}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    {event.location}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                    {event.description}
                </Typography>
            </CardContent>
        </Card>
    );
};

const Schedule = () => {
    const { data: events, loading: eventsLoading, refetch: refetchEvents } = useFetch('/api/events');
    const { data: prisoners, loading: prisonersLoading } = useFetch('/api/prisoners');
    const { data: staff, loading: staffLoading } = useFetch('/api/staff');
    const [open, setOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tabValue, setTabValue] = useState(0);

    const handleOpen = (event = null) => {
        setSelectedEvent(event);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedEvent(null);
        setOpen(false);
    };

    const handleSubmit = async (formData) => {
        try {
            const url = selectedEvent
                ? `/api/events/${selectedEvent._id}`
                : '/api/events';
            const method = selectedEvent ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save event');
            }

            refetchEvents();
        } catch (error) {
            console.error('Error saving event:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const response = await fetch(`/api/events/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete event');
                }

                refetchEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const filteredEvents = events?.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate.toDateString() === selectedDate.toDateString();
    }) || [];

    if (eventsLoading || prisonersLoading || staffLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Schedule</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Schedule Event
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Select Date"
                                value={selectedDate}
                                onChange={setSelectedDate}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2 }}>
                        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                            <Tab label="All Events" />
                            <Tab label="Programs" />
                            <Tab label="Visits" />
                            <Tab label="Staff Meetings" />
                        </Tabs>

                        <Box sx={{ mt: 2 }}>
                            {filteredEvents.length === 0 ? (
                                <Typography color="textSecondary" align="center">
                                    No events scheduled for this date
                                </Typography>
                            ) : (
                                filteredEvents.map((event) => (
                                    <EventCard
                                        key={event._id}
                                        event={event}
                                        onEdit={handleOpen}
                                        onDelete={handleDelete}
                                    />
                                ))
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <EventDialog
                open={open}
                handleClose={handleClose}
                event={selectedEvent}
                prisoners={prisoners}
                staff={staff}
                onSubmit={handleSubmit}
            />
        </Box>
    );
};

export default Schedule; 