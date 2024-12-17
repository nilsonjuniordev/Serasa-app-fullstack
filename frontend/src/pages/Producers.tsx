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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';
import ProducerForm from '../components/ProducerForm.tsx';
import { Producer } from '../types/Producer';

const Producers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [producers, setProducers] = useState<Producer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);

  useEffect(() => {
    fetchProducers();
  }, []);

  const fetchProducers = async () => {
    try {
      const response = await axios.get('http://147.79.83.158:3006/produtores');
      setProducers(response.data);
    } catch (error) {
      toast.error('Erro ao carregar produtores');
      console.error('Erro ao buscar produtores:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produtor?')) {
      try {
        await axios.delete(`http://147.79.83.158:3006/produtores/${id}`);
        toast.success('Produtor excluído com sucesso!');
        fetchProducers();
      } catch (error) {
        toast.error('Erro ao excluir produtor');
        console.error('Erro ao excluir produtor:', error);
      }
    }
  };

  const handleEdit = (producer: Producer) => {
    setSelectedProducer(producer);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProducer(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProducer(null);
  };

  const renderMobileView = () => (
    <Grid container spacing={2}>
      {producers.map((producer) => (
        <Grid item xs={12} key={producer.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {producer.name}
              </Typography>
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
              <Typography variant="body2" gutterBottom>
                Culturas: {producer.crops.join(', ')}
              </Typography>
              <Button
                startIcon={<EditIcon />}
                onClick={() => handleEdit(producer)}
                sx={{ mr: 1, mt: 1 }}
              >
                Editar
              </Button>
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(producer.id!)}
                sx={{ mt: 1 }}
              >
                Excluir
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderDesktopView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
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
            <TableRow key={producer.id}>
              <TableCell>{producer.name}</TableCell>
              <TableCell>{producer.document}</TableCell>
              <TableCell>{producer.farmName}</TableCell>
              <TableCell>{producer.city}/{producer.state}</TableCell>
              <TableCell>{producer.totalArea} ha</TableCell>
              <TableCell>{producer.crops.join(', ')}</TableCell>
              <TableCell align="right">
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(producer)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(producer.id!)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Grid item>
          <Typography variant="h4" component="h1" gutterBottom>
            Produtores
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Adicionar Produtor
          </Button>
        </Grid>
      </Grid>

      {isMobile ? renderMobileView() : renderDesktopView()}

      {isModalOpen && (
        <ProducerForm
          producer={selectedProducer}
          onClose={handleCloseModal}
          onSuccess={fetchProducers}
        />
      )}
    </Container>
  );
};

export default Producers; 