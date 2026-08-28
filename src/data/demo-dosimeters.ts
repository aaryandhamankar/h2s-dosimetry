import { Dosimeter, DosimeterStatus } from '@/types';

const today = new Date();
today.setHours(6, 0, 0, 0);
const activation = today.toISOString();
const expiry = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString();

export const DEMO_DOSIMETERS: Dosimeter[] = [
  { id: 'dos-001', dosimeterCode: 'DOS-001', batchId: 'BATCH-2026-A', chemistryId: 'CHEM-002', status: DosimeterStatus.ACTIVE, activationTime: activation, expiryTime: expiry, assignedWorkerId: 'worker-001' },
  { id: 'dos-002', dosimeterCode: 'DOS-002', batchId: 'BATCH-2026-A', chemistryId: 'CHEM-002', status: DosimeterStatus.ACTIVE, activationTime: activation, expiryTime: expiry, assignedWorkerId: 'worker-002' },
  { id: 'dos-003', dosimeterCode: 'DOS-003', batchId: 'BATCH-2026-A', chemistryId: 'CHEM-002', status: DosimeterStatus.ACTIVE, activationTime: activation, expiryTime: expiry, assignedWorkerId: 'worker-003' },
  { id: 'dos-004', dosimeterCode: 'DOS-004', batchId: 'BATCH-2026-A', chemistryId: 'CHEM-002', status: DosimeterStatus.ACTIVE, activationTime: activation, expiryTime: expiry, assignedWorkerId: 'worker-004' },
  { id: 'dos-005', dosimeterCode: 'DOS-005', batchId: 'BATCH-2026-A', chemistryId: 'CHEM-002', status: DosimeterStatus.ACTIVE, activationTime: activation, expiryTime: expiry, assignedWorkerId: 'worker-005' },
];
