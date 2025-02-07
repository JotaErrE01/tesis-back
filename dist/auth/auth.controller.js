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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const create_auth_dto_1 = require("./dto/create-auth.dto");
const update_auth_dto_1 = require("./dto/update-auth.dto");
const login_user_dto_1 = require("./dto/login-user.dto");
const decorators_1 = require("./decorators");
const get_user_decorator_1 = require("./decorators/get-user.decorator");
const roles_enum_1 = require("./enums/roles.enum");
const update_password_dto_1 = require("./dto/update-password.dto");
const register_auth_dto_1 = require("./dto/register-auth.dto");
const client_1 = require("@prisma/client");
const parse_upper_case_pipe_1 = require("../common/pipes/parse-upper-case.pipe");
const filter_user_dto_1 = require("./dto/filter-user.dto");
const update_payment_methods_dto_1 = require("./dto/update-payment-methods.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    createUser(createUserDto) {
        return this.authService.createUser(createUserDto);
    }
    signup(createUserDto) {
        return this.authService.registerUser(createUserDto);
    }
    login(loginUserDto) {
        return this.authService.login(loginUserDto);
    }
    refresh(user) {
        return this.authService.checkToken(user);
    }
    getByType(type, filterUserDto) {
        return this.authService.findUsersByType(type, 1, filterUserDto);
    }
    findAll(user) {
        return this.authService.findAll(user);
    }
    updatePassword(user, updatePasswordDto) {
        return this.authService.updatePassword(user, updatePasswordDto);
    }
    updatePaymentMethods(user, updatePaymentMethodsDto) {
        return this.authService.updatePaymentMethods(user, updatePaymentMethodsDto);
    }
    async updateSellerDescription(user, description) {
        return this.authService.updateSellerDescription(Number(user.id), description);
    }
    update(id, updateAuthDto) {
        return this.authService.update(+id, updateAuthDto);
    }
    remove(id) {
        return this.authService.remove(+id);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('create'),
    (0, decorators_1.Auth)(roles_enum_1.Role.Admin),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_auth_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)(['signup', 'register']),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_auth_dto_1.RegisterUserDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('check'),
    (0, decorators_1.Auth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('getByType/:type'),
    __param(0, (0, common_1.Param)('type', parse_upper_case_pipe_1.ParseUpperCasePipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_user_dto_1.FilterUserDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getByType", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Auth)(roles_enum_1.Role.Admin),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('update-password'),
    (0, decorators_1.Auth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_password_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Post)('update-payment-methods'),
    (0, decorators_1.Auth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_payment_methods_dto_1.UpdatePaymentMethodsDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updatePaymentMethods", null);
__decorate([
    (0, common_1.Post)('seller/update-description'),
    (0, decorators_1.Auth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateSellerDescription", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.Auth)(roles_enum_1.Role.Admin),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_auth_dto_1.UpdateAuthDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Auth)(roles_enum_1.Role.Admin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "remove", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)(['auth', 'users']),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map