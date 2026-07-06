// === Entità principali della LipariBank Dashboard ===

export interface Account {
  id: string;
  iban: string;
  label: string;
  balance: number;
  currency: string;
  type: "current" | "savings";
  accountType: "PRIVATE" | "BUSINESS";
  status: "active" | "inactive";
  openedAt: string;
}

export interface Movement {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  direction: "credit" | "debit";
  description: string;
  category: string;
  status: "completed" | "pending";
  executedAt: string;
  createdAt: string;
}

export interface Investment {
  id: string;
  accountId: string;
  name: string;
  type: "BOND" | "ETF" | "STOCK" | "FUND";
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
