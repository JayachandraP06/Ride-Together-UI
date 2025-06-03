
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  driverRating: number;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  vehicleInfo: {
    make: string;
    model: string;
    color: string;
    licensePlate: string;
  };
}

export interface Booking {
  id: string;
  rideId: string;
  userId: string;
  seatsBooked: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingDate: string;
  ride: Ride;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface SearchParams {
  source: string;
  destination: string;
  date: string;
}
