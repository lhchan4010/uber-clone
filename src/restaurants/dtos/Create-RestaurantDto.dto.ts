import { InputType, OmitType } from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurants.entities';

@InputType()
export class CreateRestaurantDto extends OmitType(
  Restaurant,
  ['id'],
  InputType,
) {}
