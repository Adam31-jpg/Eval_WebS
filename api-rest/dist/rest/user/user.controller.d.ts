import { UserEntity } from '../../entities/user.entity';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(user: UserEntity): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findOne(id: string): Promise<UserEntity>;
    update(id: string, user: UserEntity): Promise<UserEntity>;
    remove(id: string): Promise<void>;
    grpcCreate(user: any): Promise<UserEntity>;
    grpcFindAll(): Promise<{
        users: UserEntity[];
    }>;
    grpcFindOne(data: {
        id: string;
    }): Promise<UserEntity>;
    grpcUpdate(data: {
        id: string;
        user: UserEntity;
    }): Promise<UserEntity>;
    grpcRemove(data: {
        id: string;
    }): Promise<{}>;
}
