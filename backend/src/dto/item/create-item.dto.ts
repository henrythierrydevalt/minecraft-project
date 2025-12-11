import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  durability?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  enchantmentLevel?: number;
}

