import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

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

