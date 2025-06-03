
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Ride } from '../types';
import { Clock, Users, Star, MapPin } from 'lucide-react';

interface RideCardProps {
  ride: Ride;
  onBookRide: (rideId: string) => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onBookRide }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`} />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
                {ride.driverName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{ride.driverName}</h3>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{ride.driverRating}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">${ride.price}</div>
            <div className="text-sm text-gray-500">per seat</div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium text-gray-900">{ride.source}</div>
              <div className="text-sm text-gray-500">{ride.departureTime}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-red-600" />
            <div>
              <div className="font-medium text-gray-900">{ride.destination}</div>
              <div className="text-sm text-gray-500">{ride.arrivalTime}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {ride.availableSeats} of {ride.totalSeats} seats left
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">2h 30m</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {ride.vehicleInfo.make} {ride.vehicleInfo.model}
          </Badge>
        </div>

        <Button 
          onClick={() => onBookRide(ride.id)}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
          disabled={ride.availableSeats === 0}
        >
          {ride.availableSeats === 0 ? 'Fully Booked' : 'Book This Ride'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RideCard;
