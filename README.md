# nest-client-generator
Generate client api directly from [nest](https://nestjs.com/) controller.

### Install
npm i nest-client-generator

### Use
create generator file:
```typescript
import { generateClientApi } from 'nest-client-generator';
generateClientApi({ clientPath, decorators, httpServiceTemplate, serverPath });
```
add to scripts:
```"gen-client": "ts-node ./generator && prettier --write \"./client/src/api/**/*.ts\"",```

run
``` npm run gen-client```

### Example (angular)
server controller :
```typescript
import { Controller, Post, Get, Body, Req, UseInterceptors } from '@nestjs/common';
import { LoginRequest, User, signinRequest } from 'shared';
import { UserService } from 'services/user.service';
import { LoginInterceptor, GetUserAuthenticatedInterceptor } from '../middlewares/login.middleware';
import { ReqUser } from 'decorators/user.decorator';

@Controller('rest/auth')
export class AuthController {
    constructor(private readonly authService: UserService) {}

    @Post('login')
    @UseInterceptors(LoginInterceptor)
    async login(@Body() user: LoginRequest): Promise<User> {
        return this.authService.validateUser(user.email, user.password);
    }

    @Post('signin')
    async signin(@Body() user: signinRequest): Promise<any> {
        return this.authService.changePassword(user);
    }

    @UseInterceptors(GetUserAuthenticatedInterceptor)
    @Get('getUserAuthenticated')
    async getUserAuthenticated(@ReqUser() user: User): Promise<User> {
        return user;
    }
}

```
client generated file:
```typescript
import { Injectable } from '@angular/core';
import { LoginRequest, signinRequest, User } from 'shared';
import { APIService } from './http.service';

@Injectable()
export class AuthController {
    async login(user: LoginRequest): Promise<User> {
        return new Promise(resolve => {
            this.api.post('rest/auth/login', user).subscribe((data: any) => resolve(new User(data)));
        });
    }

    async signin(user: signinRequest): Promise<any> {
        return new Promise(resolve => {
            this.api.post('rest/auth/signin', user).subscribe((data: any) => resolve(data));
        });
    }

    async getUserAuthenticated(): Promise<User> {
        return new Promise(resolve => {
            this.api.get('rest/auth/getUserAuthenticated').subscribe((data: any) => resolve(new User(data)));
        });
    }

    constructor(private readonly api: APIService) {}
}

```

To using the same path for your models, add it to tsconfig:
```
        "baseUrl": "./src",
        "paths": {
            "shared": ["../../shared"],
            "shared/*": ["../../shared/*"]
        }
```
[working example](https://github.com/yantrab/nest-angular/blob/master/generator/index.ts) 
