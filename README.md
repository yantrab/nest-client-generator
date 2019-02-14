# nest-client-generator
a Compiler to compile nest controller to client api.

## Installation 
```sh
npm i nest-client-generator
```

## Usage
Add script:
```
 "gen-client": "node  ./node_modules/nest-client-generator/lib/index.js"
```
and then run
```sh
npm run gen-client
```

## Result

The folowing controller:

```typescript
import { Controller, Post, Get, Body,Req } from '@nestjs/common';
import { LoginRequest, User } from 'shared'

@Controller('auth')
export class AuthController {
    @Post('login')
    async login(@Body() user: LoginRequest): Promise<User> {
        console.log(user)
        const result = new User();
        result.fName = 'yaniv1'
        result.lName = 'trabelsi'
        return result
    }

    @Get('isAuthenticatd')
    async isAuthenticatd(@Req() req) {
        return { isAuthenticatd: !!req.user };
    }
}
```

Became to :

```typescript
import { LoginRequest, User } from 'shared'
import { plainToClass } from "class-transformer";
import { get, post } from "./http.service";

export class AuthController {
    
    async login(user: LoginRequest): Promise<User> {
        return new Promise((resolve) => post('rest/auth/login',user).then((data:any) => resolve(plainToClass(User,<User>data))))
    }
    
    async isAuthenticatd(): Promise<{ isAuthenticatd: boolean; }> {
        return new Promise((resolve) => get('rest/auth/isAuthenticatd').then((data:any) => resolve(data)))
    }
}
```
