import { getRepository, Like, MoreThan, Repository } from "typeorm";
import { Receita } from "../../entities/receita";
import { ICreateReceitaDTO, IReceitaRepository } from "../IReceitaRepository";


class ReceitaRepository implements IReceitaRepository {
    private repository: Repository<Receita>;

    private static INSTANCE: ReceitaRepository;

    constructor(){
        this.repository = getRepository(Receita);
    }

    public static getInstance(): ReceitaRepository {
        if(!ReceitaRepository.INSTANCE){
            ReceitaRepository.INSTANCE = new ReceitaRepository();
        }
        return ReceitaRepository.INSTANCE;
    }

    async create({ valor, descricao, categoria }: ICreateReceitaDTO): Promise<void> {
        const receita = this.repository.create({
            descricao,
            valor,
            categoria
        });

        await this.repository.save(receita);
       
    }

    async findByDescricao(descricao: string): Promise <Receita | undefined> {
        const receita = await this.repository.findOne({ descricao });
    
        return receita;

    }

    async findById(id: string): Promise<Receita | undefined> {
        const receita = await this.repository.findOne(id);

        return receita;
    }
    
    async list(): Promise<Receita[]> {
        //const receitas = await this.repository.find();
        //return receitas;
        return this.repository.createQueryBuilder("receita")
        .select("receita.descricao, receita.valor, receita.data")
        .getRawMany();
    }

    async listByMes(ano: string, mes: string): Promise<Receita[]> {
        
        const newMes = parseInt (mes);
        const newAno = parseInt (ano);
        
        return this.repository.createQueryBuilder("receita")
        .where("EXTRACT(MONTH FROM data) = :mes AND EXTRACT(YEAR FROM data) = :ano" ,{mes:`${newMes}`, ano:`${newAno}`})
        .getMany();
     }

    async searchByDescricao(param: string): Promise<Receita[]> {
        //return this.repository.query('SELECT descricão, valor, date FROM receita WHERE ')
        return this.repository.createQueryBuilder("receita")
        .select("receita.descricao, receita.valor, receita.data")
        .where("receita.descricao ILIKE :param", {param: `%${param}%`})
        .getRawMany();

    }

    async deleteId( id : string): Promise<void>{       
        await this.repository.delete(id);
    }

    async update(id: string, valor:number, descricao: string, categoria: string ): Promise<void> {
        
       await this.repository.createQueryBuilder("receita")
        .update(Receita)
        .set({valor: valor, descricao: descricao, categoria: categoria})
        .where("id= :id", {id: id})
        .execute();
    }

    async detail(id: string): Promise<Receita | undefined> {
       
       return this.repository.createQueryBuilder("receita")
        .select("receita.descricao, receita.valor, receita.data")
        .where("id= :id", {id:id})
        .getRawOne();
    }

}

export { ReceitaRepository }

