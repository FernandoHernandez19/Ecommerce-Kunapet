import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ServerWakingNotice from '../components/ServerWakingNotice';
import useServerStatusStore, { SLOW_AFTER_MS, trackRequest } from './useServerStatusStore';

describe('aviso de servidor dormido', () => {
  it('aparece tras 5 s sin respuesta y desaparece al responder', () => {
    vi.useFakeTimers();
    render(<ServerWakingNotice />);
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toBeEmptyDOMElement();

    const done = trackRequest();
    act(() => vi.advanceTimersByTime(SLOW_AFTER_MS - 1));
    expect(region).toBeEmptyDOMElement();
    act(() => vi.advanceTimersByTime(2));
    expect(region).toHaveTextContent('El servidor gratuito se está despertando; puede tardar hasta un minuto.');

    act(() => done());
    expect(region).toBeEmptyDOMElement();
    expect(useServerStatusStore.getState().isWaking).toBe(false);
  });

  it('una respuesta rápida nunca muestra el aviso', () => {
    vi.useFakeTimers();
    const done = trackRequest();
    done();
    act(() => vi.advanceTimersByTime(SLOW_AFTER_MS * 2));
    expect(useServerStatusStore.getState().isWaking).toBe(false);
  });
});
