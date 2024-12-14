import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from './decorators';
import { GetUser } from './decorators/get-user.decorator';
import { UserToken } from './guards';
import { Role } from './enums/roles.enum';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RegisterUserDto } from './dto/register-auth.dto';
import { UserType } from '@prisma/client';
import { ParseUpperCasePipe } from 'src/common/pipes/parse-upper-case.pipe';
import { FilterUserDto } from './dto/filter-user.dto';

@Controller(['auth', 'users'])
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // @Post('register')
  // register(@Body() createUserDto: CreateUserDto) {
  //   return this.authService.registerUser(createUserDto);
  // }

  @Post('create')
  @Auth(Role.Admin)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post(['signup', 'register'])
  signup(@Body() createUserDto: RegisterUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check')
  @Auth()
  refresh(@GetUser() user: UserToken) {
    return this.authService.checkToken(user);
  }

  @Get('getByType/:type')
  getByType(
    // @GetUser() user: UserToken,
    @Param('type', ParseUpperCasePipe) type: UserType,
    @Query() filterUserDto: FilterUserDto
  ) {
    return this.authService.findUsersByType(type, 1, filterUserDto);
  }

  @Get()
  @Auth(Role.Admin)
  findAll(@GetUser() user: UserToken) {
    return this.authService.findAll(user);
  }

  @Post('update-password')
  @Auth()
  updatePassword(@GetUser() user, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(user, updatePasswordDto);
  }

  @Patch(':id')
  @Auth(Role.Admin)
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  @Auth(Role.Admin)
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
