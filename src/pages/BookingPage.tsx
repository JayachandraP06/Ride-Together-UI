
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Ride } from '../types';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { MapPin, Users, Star, Clock, Car } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const BookingPage = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const ride: Ride = location.state?.ride;

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ride not found</h2>
          <Button onClick={() => navigate('/search')}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const totalPrice = seatsToBook * ride.price;

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await bookingsAPI.createBooking({
        rideId: ride.id,
        seatsBooked: seatsToBook
      });
      
      toast({
        title: "Booking confirmed!",
        description: `You've successfully booked ${seatsToBook} seat(s) for $${totalPrice}.`,
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Booking failed:', error);
      toast({
        title: "Booking failed",
        description: "Unable to complete your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/search')}
            className="mb-4"
          >
            ← Back to Search
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Book Your Ride</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ride Details */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Ride Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Driver Info */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-teal-600 text-white text-lg">
                      {ride.driverName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{ride.driverName}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{ride.driverRating} rating</span>
                    </div>
                  </div>
                </div>

                {/* Route Info */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-4 h-4 bg-green-500 rounded-full mt-1"></div>
                    <div>
                      <div className="font-semibold text-gray-900">{ride.source}</div>
                      <div className="text-sm text-gray-600">{ride.departureTime}</div>
                    </div>
                  </div>
                  <div className="ml-2 w-0.5 h-8 bg-gray-300"></div>
                  <div className="flex items-start space-x-4">
                    <div className="w-4 h-4 bg-red-500 rounded-full mt-1"></div>
                    <div>
                      <div className="font-semibold text-gray-900">{ride.destination}</div>
                      <div className="text-sm text-gray-600">{ride.arrivalTime}</div>
                    </div>
                  </div>
                </div>

                {/* Trip Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">2h 30m</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{ride.availableSeats} seats left</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{ride.vehicleInfo.make} {ride.vehicleInfo.model}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {ride.vehicleInfo.color}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card className="shadow-lg border-0 sticky top-8">
              <CardHeader>
                <CardTitle>Book Your Seats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="seats">Number of seats</Label>
                  <Select value={seatsToBook.toString()} onValueChange={(value) => setSeatsToBook(parseInt(value))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: Math.min(ride.availableSeats, 4) }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1} seat{i > 0 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Price per seat:</span>
                    <span className="font-semibold">${ride.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-semibold">{seatsToBook}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-blue-600">${totalPrice}</span>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={loading || !user}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Booking...
                    </div>
                  ) : !user ? (
                    'Login to Book'
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>

                {!user && (
                  <p className="text-sm text-gray-600 text-center">
                    <Button variant="link" onClick={() => navigate('/login')} className="p-0 h-auto">
                      Sign in
                    </Button>
                    {' '}to complete your booking
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
