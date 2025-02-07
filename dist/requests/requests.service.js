"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../config/db/prisma.service");
let RequestsService = class RequestsService {
    constructor(prismaService) {
        this.user_requests = prismaService.user_requests;
    }
    async create(user, createRequestDto) {
        return this.user_requests.create({
            data: {
                title: createRequestDto.title,
                description: createRequestDto.description,
                image: createRequestDto.image,
                user_id: user.id,
                creation_date: new Date(),
            },
        });
    }
    findAll() {
        return `This action returns all requests`;
    }
    findOne(id) {
        return `This action returns a #${id} request`;
    }
    update(id, updateRequestDto) {
        return `This action updates a #${id} request`;
    }
    remove(id) {
        return `This action removes a #${id} request`;
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map