import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/dto/jwt-payload.interface';
import { User } from './entities/user.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@ApiTags('User Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: "Get the current user's profile" })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved the user's profile.",
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(@CurrentUser() user: JwtPayload): Promise<User> {
    return this.usersService.findUserById(user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: "Update the current user's profile" })
  @ApiResponse({
    status: 200,
    description: "Successfully updated the user's profile.",
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return this.usersService.updateProfile(user.userId, updateProfileDto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Request data erasure for the current user' })
  @ApiResponse({
    status: 204,
    description: 'Data erasure process has been initiated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Cannot delete account with active orders.',
  })
  requestDataErasure(@CurrentUser() user: JwtPayload): Promise<void> {
    // REQ-1-023: Implement a 'right to erasure' function.
    // REQ-1-024: A clear message is displayed (handled by frontend).
    // CUS-043: Customer Requests Data Erasure.
    return this.usersService.requestDataErasure(user.userId);
  }

  @Get('me/addresses')
  @ApiOperation({ summary: "Get the current user's saved addresses" })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved addresses.',
    type: [Address],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getAddresses(@CurrentUser() user: JwtPayload): Promise<Address[]> {
    return this.usersService.findAllAddressesByUserId(user.userId);
  }

  @Post('me/addresses')
  @ApiOperation({ summary: 'Add a new address for the current user' })
  @ApiResponse({
    status: 201,
    description: 'Successfully added the new address.',
    type: Address,
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  addAddress(
    @CurrentUser() user: JwtPayload,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    return this.usersService.addAddress(user.userId, createAddressDto);
  }

  @Patch('me/addresses/:addressId')
  @ApiOperation({ summary: 'Update an existing address for the current user' })
  @ApiParam({ name: 'addressId', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the address.',
    type: Address,
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  updateAddress(
    @CurrentUser() user: JwtPayload,
    @Param('addressId', new ParseUUIDPipe()) addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return this.usersService.updateAddress(
      user.userId,
      addressId,
      updateAddressDto,
    );
  }

  @Delete('me/addresses/:addressId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an address for the current user' })
  @ApiParam({ name: 'addressId', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'Successfully deleted the address.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Address not found.' })
  deleteAddress(
    @CurrentUser() user: JwtPayload,
    @Param('addressId', new ParseUUIDPipe()) addressId: string,
  ): Promise<void> {
    return this.usersService.deleteAddress(user.userId, addressId);
  }
}