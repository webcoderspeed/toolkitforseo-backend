import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { X_TRACE_ID } from '../constants';

@Injectable()
export class TraceIdGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const traceId = request.headers[X_TRACE_ID];

    if (!traceId) {
      throw new BadRequestException('X-Trace-ID header is required');
    }

    return true;
  }
}
