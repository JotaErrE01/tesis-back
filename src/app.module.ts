import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env.config';
import { CantonModule } from './canton/canton.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { PrismaModule } from './config/db/prisma.module';
import { CommentModule } from './comment/comment.module';
import { ProductModule } from './product/product.module';
import { UnitOfMesureModule } from './unit-of-mesure/unit-of-mesure.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { PredefinedProductModule } from './predefined-product/predefined-product.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   load: [() => envSchema.parse(process.env)]=
    // }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [() => envSchema.safeParse(process.env)],
      // isGlobal: true,
      validate: (config) => {
        const parsed = envSchema.safeParse(config);
        if (!parsed.success) {
          throw new Error(`Validation error: ${parsed.error.message}`);
        }
        return parsed.data;
      },
    }),

    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService<Envs>) => ({
    //     type: 'postgres',
    //     username: configService.get('DB_USERNAME'),
    //     password: configService.get('DB_PASSWORD'),
    //     database: configService.get('DB_NAME'),
    //     port: configService.get('DB_PORT'),
    //     autoLoadEntities: true,
    //     entities: [UserRole]
    //     // synchronize: true
    //   }),
    //   inject: [ConfigService],
    // }),
    PrismaModule,

    CantonModule,

    AuthModule,

    RoleModule,

    CommentModule,

    ProductModule,

    UnitOfMesureModule,

    ProductCategoryModule,

    PredefinedProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }