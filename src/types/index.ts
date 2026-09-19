export type EventCategory = 'Concert' | 'EDM' | 'Acoustic';
export type EventStatus = 'active' | 'sold_out' | 'cancelled';
export type BookingStatus = 'confirmed' | 'redeemed' | 'cancelled';
export type PaymentMethod = 'card' | 'lankaqr';
export type InquiryStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';

export interface VibeEvent {
  id: string;
  title: string;
  category: EventCategory;
  venue: string;
  location: string;
  event_date: string;
  banner_url: string;
  lineup: string[];
  description: string;
  tickets_remaining: number;
  starting_price: number;
  status: EventStatus;
  created_at: string;
}

export interface TicketTier {
  id: string;
  event_id: string;
  name: string;
  price: number;
  available: number;
  perks: string[];
}

export interface Booking {
  id: string;
  event_id: string;
  tier_id: string;
  customer_name: string;
  email: string;
  mobile: string;
  payment_method: PaymentMethod;
  quantity: number;
  subtotal: number;
  discount: number;
  total_amount: number;
  promo_code: string | null;
  booking_ref: string;
  status: BookingStatus;
  created_at: string;
}

export interface OrganizerInquiry {
  id: string;
  organizer_name: string;
  email: string;
  phone: string;
  event_concept: string;
  expected_attendees: number;
  notes: string | null;
  status: InquiryStatus;
  created_at: string;
}

export interface BookingWithDetails extends Booking {
  event?: Pick<VibeEvent, 'title' | 'venue' | 'event_date' | 'banner_url'>;
  tier?: Pick<TicketTier, 'name' | 'price'>;
}

export interface User {
  name: string;
  email: string;
  phone: string;
}
