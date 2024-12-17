import { AppDataSource } from "../data-source";
import { Producer } from "../entities/Producer";
import { validate } from "class-validator";

export class ProducerService {
  private producerRepository = AppDataSource.getRepository(Producer);

  private validateCPF(cpf: string): boolean {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  private validateCNPJ(cnpj: string): boolean {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]/g, '');

    // Verifica se tem 14 dígitos
    if (cnpj.length !== 14) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    // Validação do primeiro dígito verificador
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return false;

    // Validação do segundo dígito verificador
    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
  }

  private validateDocument(document: string): boolean {
    // Remove caracteres não numéricos
    const cleanDoc = document.replace(/[^\d]/g, '');

    // Verifica se é CPF (11 dígitos) ou CNPJ (14 dígitos)
    if (cleanDoc.length === 11) {
      return this.validateCPF(cleanDoc);
    } else if (cleanDoc.length === 14) {
      return this.validateCNPJ(cleanDoc);
    }

    return false;
  }

  async create(producerData: Partial<Producer>): Promise<Producer> {
    // Validar documento
    if (!this.validateDocument(producerData.document!)) {
      throw new Error("CPF/CNPJ inválido");
    }

    const producer = this.producerRepository.create(producerData);

    // Validar áreas
    if (producer.arableArea + producer.vegetationArea > producer.totalArea) {
      throw new Error("A soma da área agricultável e vegetação não pode ser maior que a área total");
    }

    // Validar dados com class-validator
    const errors = await validate(producer);
    if (errors.length > 0) {
      throw new Error(Object.values(errors[0].constraints!)[0]);
    }

    return await this.producerRepository.save(producer);
  }

  async update(id: string, producerData: Partial<Producer>): Promise<Producer> {
    const producer = await this.producerRepository.findOne({ where: { id: Number(id) } });
    if (!producer) {
      throw new Error("Produtor não encontrado");
    }

    // Se o documento foi atualizado, validar
    if (producerData.document && !this.validateDocument(producerData.document)) {
      throw new Error("CPF/CNPJ inválido");
    }

    // Mesclar dados atualizados
    Object.assign(producer, producerData);

    // Validar áreas
    if (producer.arableArea + producer.vegetationArea > producer.totalArea) {
      throw new Error("A soma da área agricultável e vegetação não pode ser maior que a área total");
    }

    // Validar dados com class-validator
    const errors = await validate(producer);
    if (errors.length > 0) {
      throw new Error(Object.values(errors[0].constraints!)[0]);
    }

    return await this.producerRepository.save(producer);
  }

  async delete(id: string): Promise<void> {
    const result = await this.producerRepository.delete(id);
    if (result.affected === 0) {
      throw new Error("Produtor não encontrado");
    }
  }

  async findAll(): Promise<Producer[]> {
    return await this.producerRepository.find();
  }

  async getDashboardData() {
    const producers = await this.producerRepository.find();
    
    const totalFarms = producers.length;
    const totalArea = producers.reduce((sum, producer) => sum + producer.totalArea, 0);

    // Contagem por estado
    const stateCount = producers.reduce((acc, producer) => {
      acc[producer.state] = (acc[producer.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Contagem por cultura
    const cropCount = producers.reduce((acc, producer) => {
      producer.crops.forEach(crop => {
        acc[crop] = (acc[crop] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Uso do solo
    const soilUse = {
      arableArea: producers.reduce((sum, producer) => sum + producer.arableArea, 0),
      vegetationArea: producers.reduce((sum, producer) => sum + producer.vegetationArea, 0)
    };

    return {
      totalFarms,
      totalArea,
      stateCount,
      cropCount,
      soilUse
    };
  }
} 