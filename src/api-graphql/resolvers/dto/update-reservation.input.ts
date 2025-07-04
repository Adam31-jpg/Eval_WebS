import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateReservationInput {
    @Field(() => Int, { nullable: true }) userId?: number;
    @Field(() => Int, { nullable: true }) roomId?: number;
    @Field({ nullable: true }) startTime?: string;
    @Field({ nullable: true }) endTime?: string;
}