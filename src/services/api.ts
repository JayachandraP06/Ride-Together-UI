import axios from 'axios';
import { RegisterData, SearchParams, Booking } from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://api.ridetogether.demo', // Mock API base URL
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock API responses for demo purposes
const mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    await mockDelay();
    // Mock successful login
    return {
      data: {
        user: {
          id: '1',
          name: 'John Doe',
          email: credentials.email,
          phone: '+1234567890',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        token: 'mock-jwt-token-12345'
      }
    };
  },

  register: async (userData: RegisterData) => {
    await mockDelay();
    return {
      data: {
        user: {
          id: Math.random().toString(36).substr(2, 9),
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9)
      }
    };
  }
};

export const ridesAPI = {
  searchRides: async (params: SearchParams) => {
    await mockDelay();
    // Mock rides data
    return {
      data: [
        {
          id: '1',
          driverId: '2',
          driverName: 'Sarah Wilson',
          driverRating: 4.8,
          source: params.source,
          destination: params.destination,
          departureTime: '08:00 AM',
          arrivalTime: '10:30 AM',
          availableSeats: 3,
          totalSeats: 4,
          price: 25,
          vehicleInfo: {
            make: 'Toyota',
            model: 'Camry',
            color: 'Silver',
            licensePlate: 'ABC-123'
          }
        },
        {
          id: '2',
          driverId: '3',
          driverName: 'Mike Johnson',
          driverRating: 4.9,
          source: params.source,
          destination: params.destination,
          departureTime: '09:15 AM',
          arrivalTime: '11:45 AM',
          availableSeats: 2,
          totalSeats: 4,
          price: 30,
          vehicleInfo: {
            make: 'Honda',
            model: 'Civic',
            color: 'Blue',
            licensePlate: 'XYZ-789'
          }
        }
      ]
    };
  }
};

export const bookingsAPI = {
  createBooking: async (bookingData: { rideId: string; seatsBooked: number }) => {
    await mockDelay();
    return {
      data: {
        id: Math.random().toString(36).substr(2, 9),
        ...bookingData,
        userId: '1',
        totalPrice: bookingData.seatsBooked * 25,
        status: 'confirmed' as const,
        bookingDate: new Date().toISOString()
      }
    };
  },

  getUserBookings: async (userId: string): Promise<{ data: Booking[] }> => {
    await mockDelay();
    return {
      data: [
        {
          id: '1',
          rideId: '1',
          userId: userId,
          seatsBooked: 2,
          totalPrice: 50,
          status: 'confirmed' as const,
          bookingDate: '2024-06-02T10:00:00Z',
          ride: {
            id: '1',
            driverId: '2',
            driverName: 'Sarah Wilson',
            driverRating: 4.8,
            source: 'New York',
            destination: 'Boston',
            departureTime: '08:00 AM',
            arrivalTime: '10:30 AM',
            availableSeats: 1,
            totalSeats: 4,
            price: 25,
            vehicleInfo: {
              make: 'Toyota',
              model: 'Camry',
              color: 'Silver',
              licensePlate: 'ABC-123'
            }
          }
        }
      ]
    };
  }
};
