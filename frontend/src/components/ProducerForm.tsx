import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  InputLabel,
  FormControl,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Producer } from '../types/Producer';
import { validateDocument, formatDocument } from '../utils/validators.ts';

interface ProducerFormProps {
  producer?: Producer | null;
  onClose: () => void;
  onSuccess: () => void;
}

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const culturas = ['Soja', 'Milho', 'Algodão', 'Café', 'Cana de Açúcar'];

const ProducerForm: React.FC<ProducerFormProps> = ({ producer, onClose, onSuccess }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState<Producer>({
    name: '',
    document: '',
    farmName: '',
    city: '',
    state: '',
    totalArea: 0,
    arableArea: 0,
    vegetationArea: 0,
    crops: [],
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (producer) {
      setFormData(producer);
    }
  }, [producer]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Validação do documento (CPF/CNPJ)
    if (!validateDocument(formData.document)) {
      newErrors.document = 'CPF/CNPJ inválido';
    }

    // Validação das áreas
    if (formData.arableArea + formData.vegetationArea > formData.totalArea) {
      newErrors.arableArea = 'A soma da área agricultável e vegetação não pode ser maior que a área total';
      newErrors.vegetationArea = 'A soma da área agricultável e vegetação não pode ser maior que a área total';
    }

    // Validação dos campos obrigatórios
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.farmName.trim()) newErrors.farmName = 'Nome da fazenda é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.state) newErrors.state = 'Estado é obrigatório';
    if (formData.crops.length === 0) newErrors.crops = 'Selecione pelo menos uma cultura';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'document') {
      // Formata o documento enquanto o usuário digita
      setFormData(prev => ({
        ...prev,
        [name]: formatDocument(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name.includes('Area') ? Number(value) : value,
      }));
    }

    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string | string[]>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpa o erro do campo quando o usuário seleciona um valor
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    try {
      if (producer?.id) {
        await axios.put(`http://147.79.83.158:3006/produtores/${producer.id}`, formData);
        toast.success('Produtor atualizado com sucesso!');
      } else {
        await axios.post('http://147.79.83.158:3006/produtores', formData);
        toast.success('Produtor cadastrado com sucesso!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Erro ao salvar produtor. Tente novamente.');
      }
      console.error('Erro ao salvar produtor:', error);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{producer ? 'Editar Produtor' : 'Novo Produtor'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleTextFieldChange}
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CPF/CNPJ"
                name="document"
                value={formData.document}
                onChange={handleTextFieldChange}
                required
                error={!!errors.document}
                helperText={errors.document}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome da Fazenda"
                name="farmName"
                value={formData.farmName}
                onChange={handleTextFieldChange}
                required
                error={!!errors.farmName}
                helperText={errors.farmName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cidade"
                name="city"
                value={formData.city}
                onChange={handleTextFieldChange}
                required
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.state}>
                <InputLabel>Estado</InputLabel>
                <Select
                  label="Estado"
                  name="state"
                  value={formData.state}
                  onChange={handleSelectChange}
                  required
                >
                  {estados.map(estado => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </Select>
                {errors.state && (
                  <Box component="span" sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                    {errors.state}
                  </Box>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Área Total (ha)"
                name="totalArea"
                value={formData.totalArea}
                onChange={handleTextFieldChange}
                required
                error={!!errors.totalArea}
                helperText={errors.totalArea}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Área Agricultável (ha)"
                name="arableArea"
                value={formData.arableArea}
                onChange={handleTextFieldChange}
                required
                error={!!errors.arableArea}
                helperText={errors.arableArea}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Área de Vegetação (ha)"
                name="vegetationArea"
                value={formData.vegetationArea}
                onChange={handleTextFieldChange}
                required
                error={!!errors.vegetationArea}
                helperText={errors.vegetationArea}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.crops}>
                <InputLabel>Culturas</InputLabel>
                <Select
                  multiple
                  label="Culturas"
                  name="crops"
                  value={formData.crops}
                  onChange={handleSelectChange}
                  required
                >
                  {culturas.map(cultura => (
                    <MenuItem key={cultura} value={cultura} sx={{mb:-1}}>
                      {cultura}
                    </MenuItem>
                  ))}
                </Select>
                {errors.crops && (
                  <Box component="span" sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                    {errors.crops}
                  </Box>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box p={2} width="100%" display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={onClose} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {producer ? 'Salvar' : 'Adicionar'}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProducerForm; 