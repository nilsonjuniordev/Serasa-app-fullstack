import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Producer } from "../entities/Producer";

export class ProducerController {
  private repository = AppDataSource.getRepository(Producer);

  async findAll(req: Request, res: Response) {
    console.log('Requisição recebida:', req.method, req.url);
    try {
      console.log("Buscando todos os produtores");
      const producers = await this.repository.find();
      console.log(`Encontrados ${producers.length} produtores`);
      return res.json(producers);
    } catch (error) {
      console.error("Erro ao buscar produtores:", error);
      return res.status(500).json({ message: "Erro ao buscar produtores", error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      console.log("Criando novo produtor:", req.body);
      const producer = this.repository.create(req.body);
      const result = await this.repository.save(producer);
      console.log("Produtor criado com sucesso:", result);
      return res.status(201).json(result);
    } catch (error) {
      console.error("Erro ao criar produtor:", error);
      return res.status(500).json({ message: "Erro ao criar produtor", error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(`Atualizando produtor ${id}:`, req.body);
      const producer = await this.repository.findOne({ where: { id: Number(id) } });
      
      if (!producer) {
        console.log(`Produtor ${id} não encontrado`);
        return res.status(404).json({ message: "Produtor não encontrado" });
      }

      this.repository.merge(producer, req.body);
      const result = await this.repository.save(producer);
      console.log("Produtor atualizado com sucesso:", result);
      return res.json(result);
    } catch (error) {
      console.error("Erro ao atualizar produtor:", error);
      return res.status(500).json({ message: "Erro ao atualizar produtor", error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(`Deletando produtor ${id}`);
      const result = await this.repository.delete(id);
      
      if (result.affected === 0) {
        console.log(`Produtor ${id} não encontrado para deleção`);
        return res.status(404).json({ message: "Produtor não encontrado" });
      }

      console.log(`Produtor ${id} deletado com sucesso`);
      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar produtor:", error);
      return res.status(500).json({ message: "Erro ao excluir produtor", error: error.message });
    }
  }

  async getDashboardData(req: Request, res: Response) {
    console.log('Requisição recebida:', req.method, req.url);
    try {
      console.log("Buscando dados do dashboard");
      const producers = await this.repository.find();
      
      const totalFarms = producers.length;
      const totalArea = producers.reduce((sum, p) => sum + p.totalArea, 0);
      
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

      const dashboardData = {
        totalFarms,
        totalArea,
        stateCount,
        cropCount,
        soilUse
      };

      console.log("Dados do dashboard:", dashboardData);
      return res.json(dashboardData);
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      return res.status(500).json({ message: "Erro ao buscar dados do dashboard", error: error.message });
    }
  }
} 