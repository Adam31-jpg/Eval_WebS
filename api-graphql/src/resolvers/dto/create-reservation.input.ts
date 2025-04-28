import { InputType, Field } from '@nestjs/graphql';
import { StatusEnum } from '../../entities/status.enum';

@InputType()
export class CreateReservationInput {
  @Field() start_time: string;
  @Field() end_time: string;
  @Field() status: StatusEnum;
  @Field() location: string;
}
