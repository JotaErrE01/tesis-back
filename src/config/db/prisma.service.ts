import { Injectable, OnModuleInit, Logger, OnModuleDestroy, INestApplication } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

const INGNORED_FIELDS = ['creation_date', 'modification_date', 'creation_user', 'modification_user', 'observation'];

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

//? NOTA: todos los servicios inyectados son singleton por defecto
// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit {
//   private logger = new Logger();

//   constructor() {
//     super();

//     this.$extends({
//       query: {
//         async $allOperations({ args, query, model, operation }) {
//           const before = Date.now();
//           const result = await query(args);
//           const after = Date.now();

//           console.log(`Query ${model}.${operation} took ${after - before}ms`);

//           return result;
//         },
//       },
//     });
//   }

//   onModuleInit() {
//     // this.$connect();
//     this.logger.log('Database is connected 💽');

//     // prisma middleware for dates
//     // this.$use(async (params, next) => {
//     //   const before = Date.now();
//     //   const result = await next(params);
//     //   const after = Date.now();

//     //   console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

//     //   return result;
//     // });
//     // this.$extends({
//     //   query: {
//     //     async $allOperations({ args, query, model, operation }) {
//     //       const before = Date.now();
//     //       const result = await query(args);
//     //       const after = Date.now();

//     //       console.log(`Query ${model}.${operation} took ${after - before}ms`);

//     //       return result;
//     //     },
//     //   },
//     // });
//   }

//   // async enableShutdownHooks(app: INestApplication) {
//   //   this.$on('beforeExit', async () => {
//   //     await app.close();
//   //   });
//   // }

//   async onModuleDestroy() {
//     await this.$disconnect();
//   }
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
    // query: {
    //   $allModels: {
    //     findFirst({ args, query }) {
    //       args.where = {
    //         ...args.where,
    //         isDeleted: false
    //       };

    //       return query(args);
    //     },
    //     findMany({ args, query }) {
    //       args.where = {
    //         ...args.where,
    //         isDeleted: false
    //       };

    //       return query(args);
    //     },
    //     findFirstOrThrow({ args, query }) {
    //       args.where = {
    //         ...args.where,
    //         isDeleted: false
    //       };

    //       return query(args);
    //     },
    //     findUnique({ args, query }) {
    //       args.where = {
    //         ...args.where,
    //         isDeleted: false
    //       };

    //       return query(args);
    //     },
    //     findUniqueOrThrow({ args, query }) {
    //       args.where = {
    //         ...args.where,
    //         isDeleted: false
    //       };

    //       return query(args);
    //     },
    //     async $allOperations({ operation, model, args, query }) {
    //       const start = performance.now();
    //       const result = await query(args);
    //       const end = performance.now();
    //       const time = end - start;
    //       logger.debug(`${model}.${operation} took ${time}ms`);
    //       return result;
    //     },
    //   }
    // },

    // custom method for prisma
    model: {
      // $allModels: {
      //   async softDelete<T>(
      //     this: T,
      //     { where }: { where: Prisma.Args<T, 'findFirst'>['where'] }
      //   ): Promise<boolean> {
      //     // Get the current model at runtime
      //     const context = Prisma.getExtensionContext(this);
      //     const result = await (context as any).update({
      //       where,
      //       data: { isDeleted: true }
      //     });

      //     return result;
      //   },
      // },
    },

    query: {
      $allModels: {
        $allOperations: async ({ args, query }) => {
          // const start = performance.now();
          const result = await query(args);
          return serializeData(result);
        }
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