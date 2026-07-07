// === Entità principali della LipariBank Dashboard ===
// I tipi rispecchiano la struttura del db.json (json-server)

export interface Account {
  id: string;
  iban: string;
  name: string;
  balance: number;
  type: "PRIVATE" | "BUSINESS";
}

export interface Movement {
  id: string;
  accountId: string;
  amount: number;
  date: string;
  description: string;
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

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
