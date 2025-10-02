import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
// Assuming DTOs for Address are created at a lower level
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { Address } from './entities/address.entity';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: "Get the current user's profile" })
  @ApiResponse({
    status: 200,
    description: 'Returns the authenticated user profile.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(@Request() req): User {
    // The user object is attached to the request by JwtAuthGuard
    // We can return it directly. For sensitive data, a DTO mapping is recommended.
    return req.user;
  }

  @Patch('profile')
  @ApiOperation({ summary: "Update the current user's profile" })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const userId = req.user.id;
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @Get('addresses')
  @ApiOperation({ summary: "Get the current user's saved addresses" })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of saved addresses.',
    type: [Address],
  })
  getAddresses(@Request() req): Promise<Address[]> {
    const userId = req.user.id;
    return this.usersService.getAddresses(userId);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Add a new address for the current user' })
  @ApiResponse({
    status: 201,
    description: 'Address added successfully.',
    type: Address,
  })
  addAddress(
    @Request() req,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    const userId = req.user.id;
    return this.usersService.addAddress(userId, createAddressDto);
  }

  @Patch('addresses/:id')
  @ApiOperation({ summary: 'Update an existing address' })
  @ApiResponse({
    status: 200,
    description: 'Address updated successfully.',
    type: Address,
  })
  updateAddress(
    @Request() req,
    @Param('id') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const userId = req.user.id;
    return this.usersService.updateAddress(userId, addressId, updateAddressDto);
  }

  @Delete('addresses/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a saved address' })
  @ApiResponse({ status: 204, description: 'Address deleted successfully.' })
  deleteAddress(
    @Request() req,
    @Param('id') addressId: string,
  ): Promise<void> {
    const userId = req.user.id;
    return this.usersService.deleteAddress(userId, addressId);
  }

  @Post('request-erasure')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: "Request data erasure (anonymization) for the current user's account",
  })
  @ApiResponse({
    status: 202,
    description: 'Data erasure request accepted and is being processed.',
  })
  async requestDataErasure(@Request() req): Promise<{ message: string }> {
    const userId = req.user.id;
    await this.usersService.requestDataErasure(userId);
    return {
      message:
        'Your account deletion request has been received and will be processed.',
    };
  }
}