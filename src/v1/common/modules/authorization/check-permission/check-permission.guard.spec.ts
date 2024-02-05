import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, HttpException } from '@nestjs/common';

import { CheckPermissionGuard } from './check-permission.guard';
import { CheckPermissionService } from './check-permission.service';
import { ForbiddenError } from '../../../errors';

describe('CheckPermissionGuard', () => {
  let checkPermissionGuard: CheckPermissionGuard;
  let checkPermissionReflector: DeepMocked<Reflector>;
  let checkPermissionService: DeepMocked<CheckPermissionService>;

  beforeEach(() => {
    checkPermissionService = createMock<CheckPermissionService>();
    checkPermissionReflector = createMock<Reflector>();
    checkPermissionGuard = new CheckPermissionGuard(
      checkPermissionService,
      checkPermissionReflector,
    );
  });

  it('should grant permission', () => {
    checkPermissionService.hasPermission.mockResolvedValue(true);

    const context = createMock<ExecutionContext>();
    context.switchToHttp().getRequest.mockReturnValue({
      headers: {
        'x-personid': '1',
      },
    });

    checkPermissionReflector.get.mockReturnValue('i.should.work');

    expect(checkPermissionGuard.canActivate(context)).toBeTruthy();
    expect(checkPermissionService.hasPermission).toHaveBeenCalledTimes(1);
  });

  it('should not grant permission if service throws', () => {
    checkPermissionService.hasPermission.mockRejectedValue(
      new ForbiddenError('forbidden'),
    );

    const context = createMock<ExecutionContext>();
    context.switchToHttp().getRequest.mockReturnValue({
      headers: {
        'x-personid': '1',
      },
    });

    checkPermissionReflector.get.mockReturnValue('i.should.work');

    expect(checkPermissionGuard.canActivate(context)).rejects.toThrow(
      HttpException,
    );
    expect(checkPermissionService.hasPermission).toHaveBeenCalledTimes(1);
  });

  it('should not grant permission due to invalid header value (empty)', async () => {
    const context = createMock<ExecutionContext>();
    context.switchToHttp().getRequest.mockReturnValue({
      headers: {
        'x-personid': '',
      },
    });

    checkPermissionReflector.get.mockReturnValue('i.should.work');

    const canActivateFunc = async () => {
      return checkPermissionGuard.canActivate(context);
    };

    await expect(canActivateFunc()).rejects.toThrow(HttpException);
    expect(checkPermissionService.hasPermission).toHaveBeenCalledTimes(0);
  });

  it('should not grant permission due to invalid header value (not a number)', async () => {
    const context = createMock<ExecutionContext>();
    context.switchToHttp().getRequest.mockReturnValue({
      headers: {
        'x-personid': '554de8',
      },
    });

    checkPermissionReflector.get.mockReturnValue('i.should.work');

    const canActivateFunc = async () => {
      return checkPermissionGuard.canActivate(context);
    };

    await expect(canActivateFunc()).rejects.toThrow(HttpException);
    expect(checkPermissionService.hasPermission).toHaveBeenCalledTimes(0);
  });

  it('should not grant permission due to header missing', async () => {
    const context = createMock<ExecutionContext>();
    context.switchToHttp().getRequest.mockReturnValue({});

    checkPermissionReflector.get.mockReturnValue('i.should.work');

    const canActivateFunc = async () => {
      return checkPermissionGuard.canActivate(context);
    };

    await expect(canActivateFunc()).rejects.toThrow(HttpException);
    expect(checkPermissionService.hasPermission).toHaveBeenCalledTimes(0);
  });

  it('should grant permission due to missing permission to check from reflector', async () => {
    const context = createMock<ExecutionContext>();

    checkPermissionReflector.get.mockReturnValue(undefined);

    const canActivateFunc = async () => {
      return checkPermissionGuard.canActivate(context);
    };

    await expect(canActivateFunc()).resolves.toBeTruthy();
    expect(checkPermissionService.hasPermission).toHaveBeenCalledTimes(0);
  });
});
