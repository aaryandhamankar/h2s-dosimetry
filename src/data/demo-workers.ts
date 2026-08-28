import { User, UserRole } from '@/types';

export const DEMO_WORKERS: User[] = [
  { id: 'worker-001', username: 'rajesh.kumar', role: UserRole.WORKER, displayName: 'Rajesh Kumar', department: 'Operations', site: 'MRPL Refinery', workerCode: 'W-001', status: 'ACTIVE' },
  { id: 'worker-002', username: 'amit.patil', role: UserRole.WORKER, displayName: 'Amit Patil', department: 'Maintenance', site: 'MRPL Refinery', workerCode: 'W-002', status: 'ACTIVE' },
  { id: 'worker-003', username: 'sanjay.rao', role: UserRole.WORKER, displayName: 'Sanjay Rao', department: 'Operations', site: 'MRPL Refinery', workerCode: 'W-003', status: 'ACTIVE' },
  { id: 'worker-004', username: 'priya.sharma', role: UserRole.WORKER, displayName: 'Priya Sharma', department: 'Safety', site: 'MRPL Refinery', workerCode: 'W-004', status: 'ACTIVE' },
  { id: 'worker-005', username: 'vikram.singh', role: UserRole.WORKER, displayName: 'Vikram Singh', department: 'Maintenance', site: 'MRPL Refinery', workerCode: 'W-005', status: 'ACTIVE' },
];

export const HSE_USER: User = { id: 'hse-001', username: 'hse.officer', role: UserRole.HSE, displayName: 'HSE Officer', department: 'HSE', site: 'MRPL Refinery', workerCode: 'HSE-001', status: 'ACTIVE' };
