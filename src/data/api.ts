import type { ServiceLog } from '@/types';
import { services } from './services';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchServices(
  options: { fail?: boolean } = {}
): Promise<ServiceLog[]> {
  await wait(800);
  if (options.fail) throw new Error('Could not load services');
  return services;
}
