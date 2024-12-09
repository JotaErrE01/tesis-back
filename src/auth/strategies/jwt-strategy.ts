import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/config/db/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly user: PrismaService['user_ce'];

  constructor(
    configService: ConfigService,
    prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
    this.user = prisma.user_ce;
  }

  async validate(payload: { id: number }) {
    const user = await this.user.findUnique({
      where: { id: payload.id }, include: { user_role: true, pais_ce: true }
    });

    if (!user) throw new UnauthorizedException('Token No Valid');

    if (user.disabled) throw new UnauthorizedException('User No Active');

    return user; // lo que devolvemos aquí se guarda en el request.user
  }
}