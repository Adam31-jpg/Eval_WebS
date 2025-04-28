import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Observable } from 'rxjs';

// Interfaces correspondant aux messages du proto
interface User {
    id: string;
    keycloak_id: string;
    email: string;
    created_at: string;
}

interface Empty { }

interface UserById {
    id: string;
}

interface UpdateUserRequest {
    id: string;
    user: User;
}

interface Users {
    users: User[];
}

// Interface du service correspondant aux méthodes rpc
interface UserService {
    Create(data: User): Observable<User>;
    FindAll(empty: Empty): Observable<Users>;
    FindOne(data: UserById): Observable<User>;
    Update(data: UpdateUserRequest): Observable<User>;
    Remove(data: UserById): Observable<Empty>;
}

@Injectable()
export class UserClient implements OnModuleInit {
    private userService: UserService;

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'user',
            protoPath: join(__dirname, './user.proto'),
            url: 'localhost:50054', // Ajustez le port selon votre configuration
        },
    })
    private client: ClientGrpc;

    onModuleInit() {
        this.userService = this.client.getService<UserService>('UserService');
    }

    createUser(user: User): Observable<User> {
        return this.userService.Create(user);
    }

    findAllUsers(): Observable<Users> {
        return this.userService.FindAll({});
    }

    findOneUser(id: string): Observable<User> {
        return this.userService.FindOne({ id });
    }

    updateUser(id: string, user: User): Observable<User> {
        return this.userService.Update({ id, user });
    }

    removeUser(id: string): Observable<Empty> {
        return this.userService.Remove({ id });
    }
}