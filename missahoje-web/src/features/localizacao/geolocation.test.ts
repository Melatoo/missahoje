import { describe, expect, it, vi } from 'vitest';
import { isGeolocationAvailable, watchPermission } from './geolocation';

function scope(overrides: { isSecureContext?: boolean; geolocation?: object }) {
  return {
    isSecureContext: overrides.isSecureContext,
    navigator: { geolocation: overrides.geolocation },
  } as unknown as typeof globalThis;
}

function fakePermissions(initial: PermissionState) {
  const target = new EventTarget();
  const status = Object.assign(target, { state: initial });
  const permissions = { query: vi.fn(async () => status) } as unknown as Permissions;
  const change = (state: PermissionState) => {
    status.state = state;
    target.dispatchEvent(new Event('change'));
  };
  return { permissions, change };
}

describe('disponibilidade da geolocalização', () => {
  it('funciona em contexto seguro com a API presente', () => {
    expect(isGeolocationAvailable(scope({ isSecureContext: true, geolocation: {} }))).toBe(true);
  });

  it('não funciona em HTTP, mesmo com a API presente', () => {
    expect(isGeolocationAvailable(scope({ isSecureContext: false, geolocation: {} }))).toBe(false);
  });

  it('não funciona em navegador sem a API', () => {
    expect(isGeolocationAvailable(scope({ isSecureContext: true }))).toBe(false);
  });
});

describe('estado da permissão', () => {
  it('descobre o estado sem pedir a posição e acompanha as mudanças', async () => {
    const { permissions, change } = fakePermissions('denied');
    const listener = vi.fn();

    watchPermission(listener, permissions);
    await vi.waitFor(() => expect(listener).toHaveBeenCalledWith('denied'));
    change('granted');

    expect(permissions.query).toHaveBeenCalledWith({ name: 'geolocation' });
    expect(listener).toHaveBeenLastCalledWith('granted');
  });

  it('para de acompanhar depois de cancelado', async () => {
    const { permissions, change } = fakePermissions('prompt');
    const listener = vi.fn();

    const stop = watchPermission(listener, permissions);
    await vi.waitFor(() => expect(listener).toHaveBeenCalledTimes(1));
    stop();
    change('granted');

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('navegador sem a Permissions API não avisa nada', () => {
    const listener = vi.fn();

    watchPermission(listener, undefined);

    expect(listener).not.toHaveBeenCalled();
  });
});
