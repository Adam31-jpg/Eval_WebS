import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRoomInput {
  @Field() name: string;
  @Field() capacity: number;
  @Field() location: string;
}
