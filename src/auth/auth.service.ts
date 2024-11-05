import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/config/db/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Envs } from 'src/config/env.config';
import { compareSync, hash } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './guards';

@Injectable()
export class AuthService {
  private readonly user: PrismaService['user_ce'];

  constructor(
    private readonly configService: ConfigService<Envs>,
    private readonly jwtService: JwtService,
    prisma: PrismaService,
  ) {
    this.user = prisma.user_ce;
  }

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.user.findUnique({ where: { email: createUserDto.email } });
    if (user) throw new BadRequestException('Usuario ya existe');

    createUserDto.password = await hash(createUserDto.password, this.configService.get('PASSWORD_SALT'));

    return await this.user.create({
      data: {
        email: createUserDto.email,
        password: createUserDto.password,
        name: createUserDto.name,
        lastName: createUserDto.lastName,
        phone: createUserDto.phone,
        address: createUserDto.address,
        creation_date: new Date(),
        creation_user: 'system',
        pais_ce: { connect: { id_pais: createUserDto.paisId, } },
        canton_ce: { connect: { id: createUserDto.cantonId, } },
        user_role: { create: { role_ce: { connect: { id_role: createUserDto.roleId } } } }
      },
    });
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.findByEmail(loginUserDto.email);
    const password = compareSync(loginUserDto.password, user.password);
    if (!password) throw new UnauthorizedException('Credenciales incorrectas');
    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: Number(user.id) })
    };
  }

  async checkToken(user: UserToken) {
    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: Number(user.id) })
    };
  }

  private getJwtToken(payload: { id: number }) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async findAll() {
    const users = await this.user.findMany({
      include: {
        user_role: {
          select: {
            roleId: true,
          }
        }
      }
    });

    return users;
  }

  findOne(id: number) {

  }

  private async findById(id: number) {
    const user = await this.user.findUnique({
      where: { id },
      include: {
        user_role: {
          include: { role_ce: true }
        }
      }
    });

    if (!user) throw new NotFoundException('No se encontro el usuario');

    return user;
  }

  private async findByEmail(email: string) {
    const user = await this.user.findUnique({
      where: { email: email },
      include: {
        user_role: {
          include: { role_ce: true }
        }
      }
    });

    if (!user) throw new NotFoundException('No se encontro el usuario');

    return user;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
