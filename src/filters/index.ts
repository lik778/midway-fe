import { ApiExceptionFilter } from './api-exception.filter';
import { HttpExceptionFilter } from './http-exception.filter';
import { SiteExceptionFilter } from './site-exception.filter';

export const exceptionFilters = [
    new ApiExceptionFilter(),
    new SiteExceptionFilter(),
    new HttpExceptionFilter(),
]

