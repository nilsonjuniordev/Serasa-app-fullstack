import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
} from '@mui/material';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

interface DashboardData {
  totalFarms: number;
  totalArea: number;
  stateCount: Record<string, number>;
  cropCount: Record<string, number>;
  harvestsByYear: Record<number, Record<string, number>>;
  soilUse: {
    totalArea: number;
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
    harvestsByYear: {},
    soilUse: {
      totalArea: 0,
      arableArea: 0,
      vegetationArea: 0
    }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://147.79.83.158:3006/produtores/dashboard');
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
    redTransparent: 'rgba(232, 0, 112, 0.2)',
    blueTransparent: 'rgba(0, 55, 123, 0.2)',
    purpleTransparent: 'rgba(132, 26, 126, 0.2)',
    greenTransparent: 'rgba(9, 183, 70, 0.2)',
    yellowTransparent: 'rgba(239, 239, 16, 0.2)',
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
        backgroundColor: [chartColors.red, chartColors.purple],
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

  // Prepara dados para o gráfico de safras por ano
  const harvestChartData = {
    labels: Object.keys(dashboardData.harvestsByYear).sort((a, b) => Number(b) - Number(a)),
    datasets: Object.keys(dashboardData.cropCount).map((crop, index) => {
      const baseColor = [
        chartColors.red,
        chartColors.blue,
        chartColors.purple,
        chartColors.green,
        chartColors.yellow,
      ][index % 5];

      const transparentColor = [
        chartColors.redTransparent,
        chartColors.blueTransparent,
        chartColors.purpleTransparent,
        chartColors.greenTransparent,
        chartColors.yellowTransparent,
      ][index % 5];

      return {
        label: crop,
        data: Object.keys(dashboardData.harvestsByYear)
          .sort((a, b) => Number(b) - Number(a))
          .map(year => dashboardData.harvestsByYear[Number(year)][crop] || 0),
        backgroundColor: transparentColor,
        borderColor: baseColor,
        borderWidth: 2,
        pointBackgroundColor: baseColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: baseColor,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      };
    }),
  };

  const harvestChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            return `  ${context.dataset.label}: ${context.parsed.y} produtores`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 10,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          padding: 10,
          stepSize: 1,
          callback: function(value: any) {
            return Math.round(value) + ' produtores';
          }
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const
    },
    transitions: {
      active: {
        animation: {
          duration: 400
        }
      }
    },
    hover: {
      mode: 'point' as const,
      intersect: true
    }
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

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Safras por Ano
              </Typography>
              <Box sx={{ height: isMobile ? 300 : 400, p: 2 }}>
                <Line
                  data={harvestChartData}
                  options={harvestChartOptions}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;