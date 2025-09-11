
export interface FormData {
  name: string;
  email: string;
  phone: string;
  confirmed: boolean;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}
