import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Box,

} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardData {
  totalFarms: number;
  totalArea: number;
  stateCount: { [key: string]: number };
  cropCount: { [key: string]: number };
  soilUse: {
    arableArea: number;
    vegetationArea: number;
  };
}

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalFarms: 0,
    totalArea: 0,
    stateCount: {},
    cropCount: {},
    soilUse: {
      arableArea: 0,
      vegetationArea: 0
    }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://147.79.83.158:3006/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Erro ao carregar dados do dashboard');
      console.error('Erro ao buscar dados do dashboard:', error);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('pt-BR');
  };

  const formatArea = (area: number) => {
    return `${formatNumber(area)} ha`;
  };


  const chartColors = {
    red: '#E80070',
    blue: '#00377B',
    purple: '#841A7E',
    green: '#09b746',
    yellow: '#efef10',  
    teal: '#E43A86',
    orange: '#E67E22',
  };

  const estadosChartData = {
    labels: Object.keys(dashboardData.stateCount || {}),
    datasets: [
      {
        data: Object.values(dashboardData.stateCount || {}),
        backgroundColor: [
          chartColors.red,
          chartColors.purple,
          chartColors.blue,          
          chartColors.yellow,
          chartColors.orange,
          chartColors.teal,
          chartColors.green,
        ],
      },
    ],
  };

  const culturasChartData = {
    labels: Object.keys(dashboardData.cropCount || {}),
    datasets: [
      {
        data: Object.values(dashboardData.cropCount || {}),
        backgroundColor: [
      
          chartColors.red,     
              chartColors.blue,       
          chartColors.purple,
          chartColors.yellow,
          chartColors.teal,        
          
       
        ],
      },
    ],
  };

  const soloChartData = {
    labels: ['Área Agricultável', 'Área de Vegetação'],
    datasets: [
      {
        data: [
          dashboardData.soilUse.arableArea,
          dashboardData.soilUse.vegetationArea,
        ],
        backgroundColor: [ chartColors.red,            
          chartColors.purple],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: isMobile ? 'bottom' as const : 'right' as const,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Fazendas
              </Typography>
              <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>
                {formatNumber(dashboardData.totalFarms)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Área Total
              </Typography>
              <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>
                {formatArea(dashboardData.totalArea)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Fazendas por Estado
              </Typography>
              <Box sx={{ height: isMobile ? 200 : 300 }}>
                <Pie data={estadosChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Culturas
              </Typography>
              <Box sx={{ height: isMobile ? 200 : 300 }}>
                <Pie data={culturasChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Uso do Solo
              </Typography>
              <Box sx={{ height: isMobile ? 200 : 300 }}>
                <Pie data={soloChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;