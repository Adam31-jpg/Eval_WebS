import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<UserEntity>);
    create(user: UserEntity): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findOne(id: number): Promise<UserEntity>;
    update(id: number, updateData: Partial<UserEntity>): Promise<UserEntity>;
    remove(id: number): Promise<void>;
}
