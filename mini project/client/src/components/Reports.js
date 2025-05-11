import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Card,
    CardContent,
    Divider,
    Button,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {
    Download as DownloadIcon,
    Refresh as RefreshIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import useFetch from '../hooks/useFetch';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="textSecondary">
                    {title}
                </Typography>
                {icon}
            </Box>
            <Typography variant="h4" component="div" sx={{ color }}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);

const Reports = () => {
    const { data: prisoners, loading: prisonersLoading } = useFetch('/api/prisoners');
    const { data: staff, loading: staffLoading } = useFetch('/api/staff');
    const { data: visits, loading: visitsLoading } = useFetch('/api/visits');
    const { data: punishments, loading: punishmentsLoading } = useFetch('/api/punishments');
    const [timeRange, setTimeRange] = useState('month');
    const [loading, setLoading] = useState(false);

    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
    };

    const handleRefresh = () => {
        setLoading(true);
        // Simulate refresh delay
        setTimeout(() => setLoading(false), 1000);
    };

    const handleDownload = (type) => {
        // Implement report download functionality
        console.log(`Downloading ${type} report...`);
    };

    // Calculate statistics
    const totalPrisoners = prisoners?.length || 0;
    const totalStaff = staff?.length || 0;
    const totalVisits = visits?.length || 0;
    const activePunishments = punishments?.filter(p => p.status === 'Active').length || 0;

    // Prepare data for charts
    const visitTypeData = visits?.reduce((acc, visit) => {
        acc[visit.visitType] = (acc[visit.visitType] || 0) + 1;
        return acc;
    }, {}) || {};

    const visitTypeChartData = Object.entries(visitTypeData).map(([type, count]) => ({
        name: type,
        value: count
    }));

    const punishmentTypeData = punishments?.reduce((acc, punishment) => {
        acc[punishment.type] = (acc[punishment.type] || 0) + 1;
        return acc;
    }, {}) || {};

    const punishmentTypeChartData = Object.entries(punishmentTypeData).map(([type, count]) => ({
        name: type,
        value: count
    }));

    const monthlyVisitsData = visits?.reduce((acc, visit) => {
        const month = new Date(visit.visitDate).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {}) || {};

    const monthlyVisitsChartData = Object.entries(monthlyVisitsData).map(([month, count]) => ({
        name: month,
        visits: count
    }));

    if (prisonersLoading || staffLoading || visitsLoading || punishmentsLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Reports & Analytics</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Time Range</InputLabel>
                        <Select
                            value={timeRange}
                            label="Time Range"
                            onChange={handleTimeRangeChange}
                        >
                            <MenuItem value="week">Last Week</MenuItem>
                            <MenuItem value="month">Last Month</MenuItem>
                            <MenuItem value="year">Last Year</MenuItem>
                        </Select>
                    </FormControl>
                    <Tooltip title="Refresh Data">
                        <IconButton onClick={handleRefresh} disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Statistics Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Prisoners"
                        value={totalPrisoners}
                        color="#1976d2"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Staff Members"
                        value={totalStaff}
                        color="#2e7d32"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Visits"
                        value={totalVisits}
                        color="#ed6c02"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Punishments"
                        value={activePunishments}
                        color="#9c27b0"
                    />
                </Grid>

                {/* Charts */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Visit Types Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={visitTypeChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {visitTypeChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Monthly Visits Trend
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyVisitsChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <RechartsTooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="visits"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Punishment Types Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={punishmentTypeChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <RechartsTooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Report Download Section */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Download Reports
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleDownload('prisoners')}
                            >
                                Prisoner Report
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleDownload('visits')}
                            >
                                Visit Report
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleDownload('punishments')}
                            >
                                Punishment Report
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleDownload('staff')}
                            >
                                Staff Report
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Reports; 