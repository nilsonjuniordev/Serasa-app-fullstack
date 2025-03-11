import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProducerForm from '../ProducerForm';
import { Producer } from '../../types/producer.types';

describe('ProducerForm', () => {
  const mockProducer: Producer = {
    id: 1,
    name: 'João Silva',
    document: '123.456.789-00',
    farmName: 'Fazenda São João',
    city: 'São Paulo',
    state: 'SP',
    totalArea: 1000,
    arableArea: 800,
    vegetationArea: 200,
    harvests: [
      {
        id: 1,
        year: 2024,
        crops: [
          { id: 1, cropName: 'Soja' }
        ]
      }
    ]
  };

  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  it('should render form with producer data', () => {
    render(
      <ProducerForm
        producer={mockProducer}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByLabelText(/nome/i)).toHaveValue(mockProducer.name);
    expect(screen.getByLabelText(/cpf\/cnpj/i)).toHaveValue(mockProducer.document);
    expect(screen.getByLabelText(/nome da fazenda/i)).toHaveValue(mockProducer.farmName);
    expect(screen.getByLabelText(/cidade/i)).toHaveValue(mockProducer.city);
    expect(screen.getByLabelText(/estado/i)).toHaveValue(mockProducer.state);
    expect(screen.getByLabelText(/área total/i)).toHaveValue(mockProducer.totalArea);
    expect(screen.getByLabelText(/área agricultável/i)).toHaveValue(mockProducer.arableArea);
    expect(screen.getByLabelText(/área de vegetação/i)).toHaveValue(mockProducer.vegetationArea);
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