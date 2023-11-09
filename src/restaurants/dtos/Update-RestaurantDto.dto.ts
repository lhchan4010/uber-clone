import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRestaurantDto } from './Create-RestaurantDto.dto';

@InputType()
class UpdateRestaurantInputType extends PartialType(CreateRestaurantDto) {}

@InputType()
export class UpdateRestaurantDto {
  @Field(() => Number)
  id: number;
  @Field(() => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType;
}
