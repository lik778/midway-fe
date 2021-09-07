import { ApiExceptionFilter } from './api-exception.filter';
import { HttpExceptionFilter } from './http-exception.filter';
import { SiteExceptionFilter } from './site-exception.filter';
import { SystemExceptionFilter } from './system-exception.filter';

export const exceptionFilters = [
    new SystemExceptionFilter(),
    new ApiExceptionFilter(),
    new SiteExceptionFilter(),
    new HttpExceptionFilter(),
]