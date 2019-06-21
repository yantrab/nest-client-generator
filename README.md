# nest-client-generator
Generate client api directly from nest controller.

### Install
npm i nest-client-generator

### Use
create generator file:
```typescript
import { startGenerateClientApi } from 'nest-client-generator';
startGenerateClientApi({ clientPath, decorators, httpServiceTemplate, serverPath });
```
add to scripts:
```"gen-client": "ts-node ./generator && prettier --write \"./client/src/api/**/*.ts\"",```

run
``` npm run gen-client```

### Exmple
server controller :
```typescript
import { Controller, Get } from '@nestjs/common';
import { TadorService } from './tador.service';
import { ReqUser } from '../decorators/user.decorator';
import { User } from 'shared/models';
import { Panel } from 'shared/models/tador/tador.model';

@Controller('admin')
export class AdminController {
    constructor(private service: TadorService) {}

    @Get('initialData')
    async initialData(@ReqUser() user: User): Promise<Panel[]> {
        return this.service.panelRepo.findMany({ userId: user.id });
    }
}
```
client generated file:
```typescript
import { Injectable } from '@angular/core';
import { Panel } from 'shared/models/tador/tador.model';
import { APIService } from './http.service';

@Injectable()
export class AdminController {
    async initialData(): Promise<Panel[]> {
        return new Promise(resolve => {
            this.api.get('admin/initialData').subscribe((data: any) => resolve(data.map(d => new Panel(d))));
        });
    }

    constructor(private readonly api: APIService) {}
}
```
