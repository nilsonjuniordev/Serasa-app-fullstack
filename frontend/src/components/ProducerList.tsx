import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchProducers, deleteProducer } from '../store/producerSlice';
import { Producer } from '../types/Producer';
import { RootState, AppDispatch } from '../store';
import ProducerForm from './ProducerForm';

const ListContainer = styled.div`
  padding: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background-color: #4CAF50;
  color: white;
  padding: 1rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 1rem;
  border-top: 1px solid #eee;
`;

const Button = styled.button<{ variant?: 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  background-color: ${props => props.variant === 'danger' ? '#dc3545' : '#4CAF50'};
  color: white;

  &:hover {
    background-color: ${props => props.variant === 'danger' ? '#c82333' : '#45a049'};
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

export const ProducerList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const producers = useSelector((state: RootState) => state.producer.producers);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchProducers());
  }, [dispatch]);

  const handleEdit = (producer: Producer) => {
    setSelectedProducer(producer);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produtor?')) {
      await dispatch(deleteProducer(id));
      dispatch(fetchProducers());
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setSelectedProducer(null);
    dispatch(fetchProducers());
  };

  return (
    <ListContainer>
      <Button onClick={() => setShowForm(true)}>Novo Produtor</Button>

      <Table>
        <thead>
          <tr>
            <Th>CPF/CNPJ</Th>
            <Th>Nome</Th>
            <Th>Fazenda</Th>
            <Th>Cidade/Estado</Th>
            <Th>Área Total</Th>
            <Th>Culturas</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {producers.map(producer => (
            <tr key={producer.id}>
              <Td>{producer.document}</Td>
              <Td>{producer.name}</Td>
              <Td>{producer.farmName}</Td>
              <Td>{producer.city}/{producer.state}</Td>
              <Td>{producer.totalArea} ha</Td>
              <Td>{producer.crops.join(', ')}</Td>
              <Td>
                <Button onClick={() => handleEdit(producer)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(String(producer.id))}>
                  Excluir
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showForm && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={() => setShowForm(false)}>&times;</CloseButton>
            <h2>{selectedProducer ? 'Editar Produtor' : 'Novo Produtor'}</h2>
            <ProducerForm
              producer={selectedProducer}
              onClose={handleFormSubmit}
              onSuccess={handleFormSubmit}
            />
          </ModalContent>
        </Modal>
      )}
    </ListContainer>
  );
}; 