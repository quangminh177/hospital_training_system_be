import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddTrainees {
  @IsNotEmpty()
  @IsNumber()
  traineeId: number;
}
