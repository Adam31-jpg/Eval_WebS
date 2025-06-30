import { StatusEnum } from '../../../entities/status.enum';
export declare class CreateReservationInput {
    start_time: string;
    end_time: string;
    status: StatusEnum;
    location: string;
}
