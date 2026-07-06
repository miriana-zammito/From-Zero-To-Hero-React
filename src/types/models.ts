// === Entità principali della LipariBank Dashboard ===

export interface Account {
  id: string;
  name: string;
  type: "PRIVATE" | "BUSINESS";
  balance: number;
  iban: string;
}

export interface Movement {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  category: string;
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
