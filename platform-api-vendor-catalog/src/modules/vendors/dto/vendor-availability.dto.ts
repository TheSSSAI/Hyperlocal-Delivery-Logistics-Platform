import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class VendorAvailabilityDto {
  @ApiProperty({
    description: "The master switch for the vendor's availability. `true` for online, `false` for offline.",
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isOnline: boolean;
}