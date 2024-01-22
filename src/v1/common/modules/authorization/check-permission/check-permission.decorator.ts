import { Reflector } from '@nestjs/core';

export const CheckPermission = Reflector.createDecorator<string>();
