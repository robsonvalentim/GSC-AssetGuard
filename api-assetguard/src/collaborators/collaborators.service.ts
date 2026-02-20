import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collaborator } from './entities/collaborator.entity';

@Injectable()
export class CollaboratorsService {
  constructor(
    @InjectRepository(Collaborator)
    private collaboratorsRepository: Repository<Collaborator>,
  ) {}

  async create(dadosColaborador: Partial<Collaborator>): Promise<Collaborator> {
    // Sanitizacao do CPF: Expressao Regular (Regex) para manter apenas os digitos numericos
    const cpfLimpo = dadosColaborador.cpf ? dadosColaborador.cpf.replace(/\D/g, '') : '';

    if (cpfLimpo.length !== 11) {
      throw new ConflictException('CPF invalido. Deve conter 11 digitos.');
    }

    const existingCollaborator = await this.collaboratorsRepository.findOne({
      where: { cpf: cpfLimpo }
    });

    if (existingCollaborator) {
      throw new ConflictException('Ja existe um colaborador cadastrado com este CPF.');
    }

    const novoColaborador = this.collaboratorsRepository.create({
      ...dadosColaborador,
      cpf: cpfLimpo,
    });

    return this.collaboratorsRepository.save(novoColaborador);
  }

  async findAll(): Promise<Collaborator[]> {
    return this.collaboratorsRepository.find();
  }
}