import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class CreateReservationInput {
  @Field(() => Int) userId: number;
  @Field(() => Int) roomId: number;
  @Field() startTime: string;
  @Field() endTime: string;
}