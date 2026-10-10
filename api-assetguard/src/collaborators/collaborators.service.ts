import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Collaborator } from './entities/collaborator.entity';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import 'multer';

@Injectable()
export class CollaboratorsService {
  constructor(
    @InjectRepository(Collaborator)
    private collaboratorsRepository: Repository<Collaborator>,
  ) {}

  async create(
    createCollaboratorDto: CreateCollaboratorDto,
  ): Promise<Collaborator> {
    const { cpf, matricula } = createCollaboratorDto;

    if (cpf.length !== 11) {
      throw new ConflictException(
        'CPF invalido. Deve conter exatos 11 digitos.',
      );
    }

    const existingCpf = await this.collaboratorsRepository.findOne({
      where: { cpf },
    });

    if (existingCpf) {
      throw new ConflictException(
        'Ja existe um colaborador cadastrado com este CPF.',
      );
    }

    const existingMatricula = await this.collaboratorsRepository.findOne({
      where: { matricula },
    });

    if (existingMatricula) {
      throw new ConflictException(
        'Ja existe um colaborador cadastrado com esta matricula.',
      );
    }

    const novoColaborador = this.collaboratorsRepository.create(
      createCollaboratorDto,
    );

    return this.collaboratorsRepository.save(novoColaborador);
  }

  async findAll(search?: string): Promise<Collaborator[]> {
    if (search) {
      return this.collaboratorsRepository.find({
        where: [
          { nome: ILike(`%${search}%`) },
          { cpf: ILike(`%${search}%`) },
          { matricula: ILike(`%${search}%`) },
        ],
      });
    }
    return this.collaboratorsRepository.find();
  }

  //Desativa um colaborador ao invés de excluir
  async deactivate(id: string): Promise<Collaborator> {
    const collaborator = await this.collaboratorsRepository.findOne({
      where: { id },
    });

    if (!collaborator) {
      throw new NotFoundException('Colaborador não encontrado.');
    }

    collaborator.ativo = false;
    return this.collaboratorsRepository.save(collaborator);
  }

  //Reativa um colaborador desativado
  async activate(id: string): Promise<Collaborator> {
    const collaborator = await this.collaboratorsRepository.findOne({
      where: { id },
    });

    if (!collaborator) {
      throw new NotFoundException('Colaborador não encontrado.');
    }

    collaborator.ativo = true;
    return this.collaboratorsRepository.save(collaborator);
  }

  //importação de CSV
  async importCsv(
    file: Express.Multer.File,
  ): Promise<{ success: number; errors: string[] }> {
    // Converte o arquivo físico da memória para uma string de texto legível
    const csvText = file.buffer.toString('utf-8');

    // Divide o texto em linhas, ignorando quebras de linha vazias no final do arquivo
    const lines = csvText.split('\n').filter((line) => line.trim() !== '');

    let successCount = 0;
    const errors: string[] = [];

    // O loop começa em 1 (i = 1) para pular o cabeçalho do CSV (Nome, CPF, Matrícula, Turno)
    for (let i = 1; i < lines.length; i++) {
      // Divide cada linha por vírgula
      const [nome, cpf, matricula, turno] = lines[i].split(',');

      if (!nome || !cpf || !matricula || !turno) {
        errors.push(
          `Linha ${i + 1}: Dados incompletos. O formato deve ser Nome,CPF,Matricula,Turno.`,
        );
        continue; // Pula para a próxima linha sem parar o processo
      }

      try {
        // Reutiliza o SEU método create, passando os dados limpos
        await this.create({
          nome: nome.trim(),
          cpf: cpf.trim(),
          matricula: matricula.trim(),
          turno: turno.trim(),
          ativo: true,
        });
        successCount++;
      } catch (error) {
        // Verifica se a falha é um objeto de erro real para extrair a mensagem com segurança
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Erro desconhecido ao processar colaborador';

        // Coloca o erro no relatório
        errors.push(`Linha ${i + 1} (${cpf.trim()}): ${errorMessage}`);
      }
    }

    // Retorna um relatório gerencial completo da operação
    return { success: successCount, errors };
  }
}
