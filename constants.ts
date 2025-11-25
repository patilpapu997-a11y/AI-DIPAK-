import { Plan } from './types';

export const APP_NAME = "DIPAK DIGITAL AI";
export const ADMIN_EMAIL = "admin@dipakdigital.ai"; // Default admin for demo
export const UPI_ID = "papuchauhan@fam";

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    credits: 50,
    price: 79,
    description: 'Perfect for starters'
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 150,
    price: 199,
    description: 'Best value for creators'
  },
  {
    id: 'premium',
    name: 'Premium',
    credits: 500,
    price: 499,
    description: 'For power users and businesses'
  }
];

export const IMAGE_COST = 2; // Credits per image
export const INITIAL_CREDITS = 25;

// Local Storage Keys
export const STORAGE_KEYS = {
  USERS: 'st_users',
  CURRENT_USER: 'st_current_user',
  PAYMENTS: 'st_payments',
  IMAGES: 'st_images',
  THEME: 'st_theme'
};