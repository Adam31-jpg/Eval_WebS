import { OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';
interface User {
    id: string;
    keycloak_id: string;
    email: string;
    created_at: string;
}
interface Empty {
}
interface Users {
    users: User[];
}
export declare class UserClient implements OnModuleInit {
    private userService;
    private client;
    onModuleInit(): void;
    createUser(user: User): Observable<User>;
    findAllUsers(): Observable<Users>;
    findOneUser(id: string): Observable<User>;
    updateUser(id: string, user: User): Observable<User>;
    removeUser(id: string): Observable<Empty>;
}
export {};
