import React from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { People, Business, Group, Gavel } from '@mui/icons-material';
import useFetch from '../hooks/useFetch';

const StatCard = ({ title, value, icon, loading }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography color="textSecondary" gutterBottom>
                        {title}
                    </Typography>
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <Typography variant="h4" component="div">
                            {value}
                        </Typography>
                    )}
                </Box>
                <Box
                    sx={{
                        backgroundColor: 'primary.main',
                        borderRadius: '50%',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </Paper>
    );
};

const Dashboard = () => {
    const { data: prisoners, loading: prisonersLoading } = useFetch('/api/prisoners');
    const { data: prisons, loading: prisonsLoading } = useFetch('/api/prisons');
    const { data: staff, loading: staffLoading } = useFetch('/api/staff');
    const { data: punishments, loading: punishmentsLoading } = useFetch('/api/punishments');

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Prisoners"
                        value={prisoners?.length || 0}
                        icon={<People sx={{ color: 'white' }} />}
                        loading={prisonersLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Prisons"
                        value={prisons?.length || 0}
                        icon={<Business sx={{ color: 'white' }} />}
                        loading={prisonsLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Staff Members"
                        value={staff?.length || 0}
                        icon={<Group sx={{ color: 'white' }} />}
                        loading={staffLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Cases"
                        value={punishments?.length || 0}
                        icon={<Gavel sx={{ color: 'white' }} />}
                        loading={punishmentsLoading}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 