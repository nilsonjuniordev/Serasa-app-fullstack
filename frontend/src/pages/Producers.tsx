import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Box,
  Collapse,
  Chip,
  Divider,
  Tooltip,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Agriculture as AgricultureIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';
import ProducerForm from '../components/ProducerForm';
import { Producer } from '../types/producer.types';

interface RowProps {
  producer: Producer;
  onEdit: (producer: Producer) => void;
  onDelete: (id: number) => void;
}

const Row: React.FC<RowProps> = ({ producer, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const cropColors = {
    'Soja': theme.palette.success.main,
    'Milho': theme.palette.warning.main,
    'Algodão': theme.palette.info.main,
    'Café': theme.palette.error.main,
    'Cana de Açúcar': theme.palette.secondary.main,
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <Tooltip title={open ? "Ocultar Safras" : "Ver Safras"}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setOpen(!open)}
              startIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              endIcon={<AgricultureIcon />}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Safras
            </Button>
          </Tooltip>
        </TableCell>
        <TableCell>{producer.name}</TableCell>
        <TableCell>{producer.document}</TableCell>
        <TableCell>{producer.farmName}</TableCell>
        <TableCell>{producer.city}/{producer.state}</TableCell>
        <TableCell>{producer.totalArea} ha</TableCell>
        <TableCell>
          {producer.harvests
            ?.flatMap(harvest => harvest.crops.map(crop => crop.cropName))
            .filter((value, index, self) => self.indexOf(value) === index)
            .join(', ') || '-'}
        </TableCell>
        <TableCell align="right">
          <Button
            startIcon={<EditIcon />}
            onClick={() => onEdit(producer)}
            sx={{ mr: 1 }}
            size="small"
          >
            Editar
          </Button>
          <IconButton
            color="error"
            onClick={() => onDelete(producer.id!)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, backgroundColor: theme.palette.grey[50], borderRadius: 1, p: 2 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                component="div"
                sx={{ 
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <AgricultureIcon /> Safras
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Ano</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Culturas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {producer.harvests.map((harvest, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '&:nth-of-type(odd)': { 
                          backgroundColor: theme.palette.grey[100] 
                        }
                      }}
                    >
                      <TableCell 
                        component="th" 
                        scope="row"
                        sx={{ 
                          color: theme.palette.primary.main,
                          fontWeight: 'bold'
                        }}
                      >
                        {harvest.year}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {harvest.crops.map((crop, cropIndex) => (
                            <Chip
                              key={cropIndex}
                              label={crop.cropName}
                              size="small"
                              sx={{
                                backgroundColor: cropColors[crop.cropName as keyof typeof cropColors] || theme.palette.primary.main,
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const MobileCard: React.FC<RowProps> = ({ producer, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const cropColors = {
    'Soja': theme.palette.success.main,
    'Milho': theme.palette.warning.main,
    'Algodão': theme.palette.info.main,
    'Café': theme.palette.error.main,
    'Cana de Açúcar': theme.palette.secondary.main,
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">{producer.name}</Typography>
          <Box>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => onEdit(producer)}
              sx={{ mr: 1 }}
            >
              Editar
            </Button>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(producer.id!)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography color="textSecondary" gutterBottom>
          CPF/CNPJ: {producer.document}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Fazenda: {producer.farmName}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Localização: {producer.city}/{producer.state}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Área Total: {producer.totalArea} ha
        </Typography>

        <Box mt={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpen(!open)}
            startIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            endIcon={<AgricultureIcon />}
            fullWidth
            sx={{ mb: 2 }}
          >
            {open ? 'Ocultar Safras' : 'Ver Safras'}
          </Button>

          <Collapse in={open}>
            {producer.harvests.map((harvest, index) => (
              <Box 
                key={index} 
                mb={2} 
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: 1,
                  p: 2,
                  border: `1px solid ${theme.palette.grey[200]}`
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  gutterBottom
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 'bold'
                  }}
                >
                  Safra {harvest.year}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {harvest.crops.map((crop, cropIndex) => (
                    <Chip
                      key={cropIndex}
                      label={crop.cropName}
                      size="small"
                      sx={{
                        backgroundColor: cropColors[crop.cropName as keyof typeof cropColors] || theme.palette.primary.main,
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  ))}
                </Box>
                {index < producer.harvests.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
          </Collapse>
        </Box>
      </CardContent>
    </Card>
  );
};

const Producers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [producers, setProducers] = useState<Producer[]>([]);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducers = async () => {
    try {
      const response = await axios.get<Producer[]>('http://147.79.83.158:3006/produtores');
      setProducers(response.data);
    } catch (error) {
      toast.error('Erro ao carregar produtores');
    }
  };

  useEffect(() => {
    loadProducers();
  }, []);

  const handleEdit = (producer: Producer) => {
    setSelectedProducer(producer);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://147.79.83.158:3006/produtores/${id}`);
      toast.success('Produtor removido com sucesso!');
      loadProducers();
    } catch (error) {
      toast.error('Erro ao remover produtor');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Produtores</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedProducer(null);
            setShowForm(true);
          }}
        >
          Novo Produtor
        </Button>
      </Box>

      {isMobile ? (
        <Box>
          {producers.map((producer) => (
            <MobileCard
              key={producer.id}
              producer={producer}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Safras</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>CPF/CNPJ</TableCell>
                <TableCell>Fazenda</TableCell>
                <TableCell>Cidade/Estado</TableCell>
                <TableCell>Área Total</TableCell>
                <TableCell>Culturas</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {producers.map((producer) => (
                <Row
                  key={producer.id}
                  producer={producer}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {showForm && (
        <ProducerForm
          producer={selectedProducer}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            loadProducers();
            setShowForm(false);
          }}
        />
      )}
    </Container>
  );
};

export default Producers; 