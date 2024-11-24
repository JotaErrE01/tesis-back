import { Injectable, OnModuleInit, Logger, OnModuleDestroy, INestApplication } from '@nestjs/common';
import { Prisma, PrismaClient, Status } from '@prisma/client';

const INGNORED_FIELDS = ['modification_date', 'creation_user', 'modification_user', 'observation'];

export const serializeData = <T>(data: any): T => {
  return JSON.parse(JSON.stringify(
    data,
    (key, value) => {
      if (typeof value === 'bigint') {
        return Number(value);
      } else if (INGNORED_FIELDS.includes(key)) {
        return undefined;
      }
      return value;
    }
  ));
};

// function applyStatusFilterToIncludes(include) {
//   const filteredInclude = { ...include };

//   for (const key in filteredInclude) {
//     if (typeof filteredInclude[key] === 'object') {
//       filteredInclude[key] = {
//         ...filteredInclude[key],
//         where: {
//           ...(filteredInclude[key].where || {}),
//           status: Status.Activo
//         }
//       };
//     }
//   }

//   return filteredInclude;
// }



// for create your custrom prisma client in nestjs
function extendPrismaClient() {
  const logger = new Logger('Prisma');
  const prisma = new PrismaClient();

  return prisma.$extends({
    client: {
      async onModuleInit() {
        // Uncomment this to establish a connection on startup, this is generally not necessary
        // https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management#connect
        await Prisma.getExtensionContext(this).$connect();
        logger.log('Database in connected 🚀');
      },

      async enableShutdownHooks(app: INestApplication) {
        Prisma.getExtensionContext(prisma).$on(<never>'beforeExit', async () => {
          await app.close();
        });
      }
    },

    // custom method for prisma
    model: {
      $allModels: {
        async softDelete<T>(
          this: T,
          { where }: { where: Prisma.Args<T, 'findFirst'>['where'] }
        ): Promise<boolean> {
          // Get the current model at runtime
          const context = Prisma.getExtensionContext(this);
          const result = await (context as any).update({
            where,
            data: { status: Status.Eliminado }
          });

          return result;
        },
      },
    },

    query: {
      $allModels: {
        $allOperations: async ({ args, query }) => {
          // Aplica el filtro a las relaciones incluidas.
          const result = await query(args);

          return serializeData(result);
        },
        findFirst({ args, query }) {
          args.where = {
            ...args.where,
            status: Status.Activo
          };

          return query(args);
        },
        findMany({ args, query }) {
          args.where = {
            ...args.where,
            status: Status.Activo
          };

          return query(args);
        },
        findFirstOrThrow({ args, query }) {
          args.where = {
            ...args.where,
            status: Status.Activo
          };

          return query(args);
        },
        findUnique({ args, query }) {
          args.where = {
            ...args.where,
            status: Status.Activo
          };

          return query(args);
        },
        findUniqueOrThrow({ args, query }) {
          args.where = {
            ...args.where,
            status: Status.Activo
          };

          return query(args);
        },
        // async $allOperations({ operation, model, args, query }) {
        //   const start = performance.now();
        //   const result = await query(args);
        //   const end = performance.now();
        //   const time = end - start;
        //   logger.debug(`${model}.${operation} took ${time}ms`);
        //   return result;
        // },
      }
    }
  });
}

// https://github.com/prisma/prisma/issues/18628
const ExtendedPrismaClient = class {
  constructor() {
    return extendPrismaClient();
  }
} as new () => ReturnType<typeof extendPrismaClient>;

@Injectable()
export class PrismaService extends ExtendedPrismaClient implements OnModuleInit, OnModuleDestroy {
  // onModuleInit() {
  //   // throw new Error('Method not implemented.');
  //   this.logger.log('Database in connected 🚀');
  // }
  // private logger = new Logger();

  // // constructor() {
  // //   super();
  // //   this.onModuleInit()
  // // }

  // onModuleInit() {
  //   this.logger.log('Database in connected 🚀');
  // }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// @Global()
// @Module({
//   exports: [PrismaService],
//   providers: [PrismaService]
// })
// export class PrismaModule {}