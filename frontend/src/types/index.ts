export interface UserDto {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  department: string;
  registrationNumber: string;
  year: number;
  gender: string;
  roles: string[];
}

export interface JwtAuthResponse {
  token: string;
  user: UserDto;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  department: string;
  registrationNumber: string;
  year: number;
  gender: string;
}

export interface EventDto {
  id: number;
  name: string;
  description: string;
  organizingClub: string;
  dateTime: string;
  venue: string;
  posterUrl: string;
  maxAttendees: number;
  registrationPrice: number;
  categoryName: string;
  registeredAttendeesCount: number;
}

export interface EventRequest {
  name: string;
  description: string;
  organizingClub: string;
  dateTime: string;
  venue: string;
  posterUrl: string;
  maxAttendees: number;
  registrationPrice: number;
  categoryId: number;
}

export interface CategoryDto {
  id: number;
  name: string;
  description: string;
}

export interface CategoryRequest {
  name: string;
  description: string;
}

export interface UploadResponse {
  url: string;
}

export interface OrderResponse {
  orderId: string;
}

export interface PaymentVerificationRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount?: number;
  currency?: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
}
