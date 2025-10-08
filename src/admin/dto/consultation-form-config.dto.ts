import { IsString, IsArray, IsBoolean, IsOptional, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FormFieldDto {
  @ApiProperty({ description: 'Field name/key' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Field label' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: 'Field type' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Field placeholder' })
  @IsString()
  @IsOptional()
  placeholder?: string;

  @ApiProperty({ description: 'Whether field is required' })
  @IsBoolean()
  required: boolean;

  @ApiProperty({ description: 'Field position/order' })
  @IsOptional()
  position?: number;
}

export class ServiceOptionDto {
  @ApiProperty({ description: 'Service value' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: 'Service label' })
  @IsString()
  @IsNotEmpty()
  label: string;
}

export class UpdateConsultationFormConfigDto {
  @ApiProperty({ description: 'Form title' })
  @IsString()
  @IsOptional()
  formTitle?: string;

  @ApiProperty({ description: 'Form subtitle' })
  @IsString()
  @IsOptional()
  formSubtitle?: string;

  @ApiProperty({ description: 'Form fields configuration', type: [FormFieldDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  @IsOptional()
  fields?: FormFieldDto[];

  @ApiProperty({ description: 'Available services', type: [ServiceOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceOptionDto)
  @IsOptional()
  services?: ServiceOptionDto[];

  @ApiProperty({ description: 'Submit button text' })
  @IsString()
  @IsOptional()
  submitText?: string;

  @ApiProperty({ description: 'Success message' })
  @IsString()
  @IsOptional()
  successMessage?: string;

  @ApiProperty({ description: 'Whether form config is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
