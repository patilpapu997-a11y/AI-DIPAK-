import { User, UserRole, Payment, ImageGeneration, PaymentStatus, PaymentMethod } from '../types';
import { STORAGE_KEYS, INITIAL_CREDITS, ADMIN_EMAIL } from '../constants';
import { v4 as uuidv4 } from 'uuid'; // We'll simulate UUIDs with a simple random string generator since we don't have uuid lib

const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// --- User Management ---

export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
  return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const registerUser = (email: string, password: string, name: string): User => {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }

  const newUser: User = {
    id: generateId(),
    email,
    name,
    credits: INITIAL_CREDITS,
    role: email === ADMIN_EMAIL ? UserRole.ADMIN : UserRole.USER,
    createdAt: Date.now()
  };

  // Mock password storage (in reality, hash this!)
  // For this mock, we just store the user object. 
  // We'll store a separate 'auth' object mapping email to password if needed, but for simplicity:
  (newUser as any).password = password; // Hidden field implementation simulation

  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const loginUser = (email: string, password: string): User => {
  const users = getUsers();
  const user = users.find(u => u.email === email && (u as any).password === password);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  return user;
};

export const updateUserCredits = (userId: string, amount: number, operation: 'add' | 'subtract') => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');

  if (operation === 'add') {
    users[userIndex].credits += amount;
  } else {
    if (users[userIndex].credits < amount) throw new Error('Insufficient credits');
    users[userIndex].credits -= amount;
  }

  saveUsers(users);
  
  // Update current session if it matches
  const currentUserStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (currentUserStr) {
    const currentUser = JSON.parse(currentUserStr);
    if (currentUser.id === userId) {
      currentUser.credits = users[userIndex].credits;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    }
  }
  
  return users[userIndex];
};

// --- Payment Management ---

export const getPayments = (): Payment[] => {
  const paymentsJson = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
  return paymentsJson ? JSON.parse(paymentsJson) : [];
};

const savePayments = (payments: Payment[]) => {
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
};

export const createPayment = (userId: string, amount: number, credits: number, method: PaymentMethod, transactionId?: string): Payment => {
  const payments = getPayments();
  const newPayment: Payment = {
    id: generateId(),
    userId,
    amount,
    credits,
    method,
    status: method === PaymentMethod.RAZORPAY ? PaymentStatus.SUCCESS : PaymentStatus.PENDING,
    transactionId: transactionId || '',
    createdAt: Date.now()
  };

  payments.push(newPayment);
  savePayments(payments);

  if (newPayment.status === PaymentStatus.SUCCESS) {
    updateUserCredits(userId, credits, 'add');
  }

  return newPayment;
};

export const approvePayment = (paymentId: string) => {
  const payments = getPayments();
  const paymentIndex = payments.findIndex(p => p.id === paymentId);
  if (paymentIndex === -1) throw new Error('Payment not found');

  const payment = payments[paymentIndex];
  if (payment.status === PaymentStatus.SUCCESS) return; // Already success

  payment.status = PaymentStatus.SUCCESS;
  payments[paymentIndex] = payment;
  savePayments(payments);

  updateUserCredits(payment.userId, payment.credits, 'add');
};

// --- Image Management ---

export const getImages = (): ImageGeneration[] => {
  const imagesJson = localStorage.getItem(STORAGE_KEYS.IMAGES);
  return imagesJson ? JSON.parse(imagesJson) : [];
};

export const saveImage = (userId: string, prompt: string, imageUrl: string, model: string, size: string): ImageGeneration => {
  const images = getImages();
  const newImage: ImageGeneration = {
    id: generateId(),
    userId,
    prompt,
    imageUrl,
    createdAt: Date.now(),
    model,
    size
  };
  
  images.unshift(newImage); // Add to top
  localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));
  return newImage;
};

export const getUserImages = (userId: string): ImageGeneration[] => {
  return getImages().filter(img => img.userId === userId);
};

export const getAnalytics = () => {
    const users = getUsers();
    const payments = getPayments();
    const images = getImages();

    const totalUsers = users.length;
    const totalImages = images.length;
    const totalRevenue = payments
        .filter(p => p.status === PaymentStatus.SUCCESS)
        .reduce((acc, curr) => acc + curr.amount, 0);
    const creditsConsumed = totalImages * 2; // Assuming 2 credits per image constant

    return {
        totalUsers,
        totalImages,
        totalRevenue,
        creditsConsumed
    };
};