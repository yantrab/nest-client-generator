export interface Config{
    clientPath:string;
    serverPath:string;
    decorators:{Get:string, Post:string, [key: string]: string;};
    httpServiceTemplate:string;
}