export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  role: UserRole;
  createdAt: number;
}

export interface ImageGeneration {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  createdAt: number;
  model: string;
  size: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export enum PaymentMethod {
  RAZORPAY = 'RAZORPAY',
  UPI_MANUAL = 'UPI_MANUAL'
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  credits: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string; // UPI Ref or Razorpay Payment ID
  proofUrl?: string; // For manual UPI
  createdAt: number;
}

export interface Plan {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
}
