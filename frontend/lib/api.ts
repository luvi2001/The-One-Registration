import { Camper, CreateCamperInput } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = 'Something went wrong. Please try again.';
    try {
      const body = await res.json();
      if (Array.isArray(body?.message)) {
        message = body.message.join(', ');
      } else if (typeof body?.message === 'string') {
        message = body.message;
      }
    } catch {
      // ignore body parse errors, fall back to default message
    }
    throw new Error(message);
  }
  return res.json();
}

export async function registerCamper(input: CreateCamperInput): Promise<Camper> {
  const res = await fetch(`${API_URL}/campers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handle<Camper>(res);
}

export async function fetchCampers(params: {
  area?: string;
  search?: string;
  age?: number;
  gender?: string;
}): Promise<Camper[]> {
  const qs = new URLSearchParams();
  if (params.area) qs.set('area', params.area);
  if (params.search) qs.set('search', params.search);
  if (typeof params.age === 'number') qs.set('age', String(params.age));
  if (params.gender) qs.set('gender', params.gender);
  const res = await fetch(`${API_URL}/campers?${qs.toString()}`, {
    cache: 'no-store',
  });
  return handle<Camper[]>(res);
}

export interface CamperStats {
  total: number;
  byArea: { area: string; count: number }[];
  byAge: { age: number; count: number }[];
  byGender: { gender: string; count: number }[];
}

export async function fetchStats(): Promise<CamperStats> {
  const res = await fetch(`${API_URL}/campers/stats`, { cache: 'no-store' });
  return handle<CamperStats>(res);
}

export async function deleteCamper(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/campers/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error('Could not delete this registration.');
  }
}

export async function updateCamperStatus(
  id: string,
  updates: { busArrived?: boolean; campArrived?: boolean },
): Promise<Camper> {
  const res = await fetch(`${API_URL}/campers/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handle<Camper>(res);
}
