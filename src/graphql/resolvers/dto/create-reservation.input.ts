import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateReservationInput {
  @Field(() => Int) userId: number;    // ← CHANGÉ en number avec Int
  @Field(() => Int) roomId: number;    // ← CHANGÉ en number avec Int
  @Field() startTime: string;
  @Field() endTime: string;
}