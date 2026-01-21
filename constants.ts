
import { UserProfile } from './types';

/**
 * 🛠️ CONFIGURATION SECTION
 * Authorized Gmail addresses and PASSWORDS for Sanjaya and Ravi.
 */
export const AUTHORIZED_USERS: Record<string, UserProfile> = {
  
  // 1️⃣ SANJAYA - Designer
  // Password for development: Sanjaya@2025
  'hamadema2023@gmail.com': {
    name: 'Sanjaya',
    email: 'hamadema2023@gmail.com',
    role: 'DESIGNER',
    password: 'Sanjaya@2025'
  },

  // 2️⃣ RAVI - Job Giver (Payer)
  // Password for development: Ravi@2025
  'adobe7181@gmail.com': {
    name: 'Ravi',
    email: 'adobe7181@gmail.com',
    role: 'PAYER',
    password: 'Ravi@2025'
  }
};

export const PAYMENT_METHODS = [
  'Bank Transfer',
  'Cash',
  'UPI',
  'Check',
  'Other'
];
