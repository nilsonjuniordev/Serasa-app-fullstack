import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProducerForm from '../ProducerForm';
import { Producer } from '../../types/Producer';

describe('ProducerForm', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  const producer: Producer = {
    name: 'Produtor Teste',
    document: '12345678901',
    farmName: 'Fazenda Teste',
    city: 'Cidade Teste',
    state: 'SP',
    totalArea: 100,
    arableArea: 60,
    vegetationArea: 40,
    crops: ['Soja'],
  };

  test('deve renderizar o formulário corretamente', () => {
    render(<ProducerForm onClose={mockOnClose} onSuccess={mockOnSuccess} producer={producer} />);

    expect(screen.getByLabelText(/nome/i)).toHaveValue(producer.name);
    expect(screen.getByLabelText(/cpf\/cnpj/i)).toHaveValue(producer.document);
    expect(screen.getByLabelText(/nome da fazenda/i)).toHaveValue(producer.farmName);
    expect(screen.getByLabelText(/cidade/i)).toHaveValue(producer.city);
    expect(screen.getByLabelText(/estado/i)).toHaveValue(producer.state);
    expect(screen.getByLabelText(/área total \(ha\)/i)).toHaveValue(producer.totalArea);
    expect(screen.getByLabelText(/área agricultável \(ha\)/i)).toHaveValue(producer.arableArea);
    expect(screen.getByLabelText(/área de vegetação \(ha\)/i)).toHaveValue(producer.vegetationArea);
    expect(screen.getByLabelText(/culturas/i)).toHaveValue(producer.crops);
  });

  test('deve chamar onClose quando o botão Cancelar é clicado', () => {
    render(<ProducerForm onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    fireEvent.click(screen.getByText(/cancelar/i));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('deve chamar onSuccess e onClose ao submeter o formulário com dados válidos', async () => {
    render(<ProducerForm onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Novo Produtor' } });
    fireEvent.change(screen.getByLabelText(/cpf\/cnpj/i), { target: { value: '12345678901' } });
    fireEvent.change(screen.getByLabelText(/nome da fazenda/i), { target: { value: 'Nova Fazenda' } });
    fireEvent.change(screen.getByLabelText(/cidade/i), { target: { value: 'Nova Cidade' } });
    fireEvent.change(screen.getByLabelText(/estado/i), { target: { value: 'SP' } });
    fireEvent.change(screen.getByLabelText(/área total \(ha\)/i), { target: { value: 100 } });
    fireEvent.change(screen.getByLabelText(/área agricultável \(ha\)/i), { target: { value: 60 } });
    fireEvent.change(screen.getByLabelText(/área de vegetação \(ha\)/i), { target: { value: 40 } });

    // Para o campo "culturas", se for um Select múltiplo, você deve usar a abordagem correta
    fireEvent.change(screen.getByLabelText(/culturas/i), { target: { value: ['Soja'] } });

    fireEvent.click(screen.getByText(/adicionar/i));

    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});