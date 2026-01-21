
export type Role = 'DESIGNER' | 'PAYER';

export interface UserProfile {
  name: string;
  email: string;
  role: Role;
  password?: string; // Added password field
}

export interface SecurityLog {
  id: string;
  attemptedEmail: string;
  timestamp: number;
  date: string;
  status: 'WRONG_PASSWORD' | 'UNAUTHORIZED_EMAIL';
}

export interface DesignCharge {
  id: string;
  date: string;
  type: string;
  description: string;
  amount: number;
  addedBy: string;
  timestamp: number;
}

export interface PaymentRecord {
  id: string;
  date: string;
  method: string;
  amount: number;
  note: string;
  addedBy: string;
  timestamp: number;
}

export interface PriceTemplate {
  id: string;
  name: string;
  amount: number;
}

export interface AppState {
  charges: DesignCharge[];
  payments: PaymentRecord[];
  templates: PriceTemplate[];
  securityLogs: SecurityLog[];
  user: UserProfile | null;
}
