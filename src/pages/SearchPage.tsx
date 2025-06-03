
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ridesAPI } from '../services/api';
import { Ride } from '../types';
import RideCard from '../components/RideCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: ''
  });
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchParams.source || !searchParams.destination || !searchParams.date) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to search for rides.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await ridesAPI.searchRides(searchParams);
      setRides(response.data);
      
      if (response.data.length === 0) {
        toast({
          title: "No rides found",
          description: "Try adjusting your search criteria or date.",
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search failed",
        description: "Unable to search for rides. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = (rideId: string) => {
    navigate(`/book/${rideId}`, { state: { ride: rides.find(r => r.id === rideId) } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Ride
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search for available rides and connect with fellow travelers going your way.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Rides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
              <div>
                <Label htmlFor="source">From</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="source"
                    name="source"
                    type="text"
                    value={searchParams.source}
                    onChange={handleInputChange}
                    placeholder="New York"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="destination">To</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="destination"
                    name="destination"
                    type="text"
                    value={searchParams.destination}
                    onChange={handleInputChange}
                    placeholder="Boston"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={searchParams.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Searching...
                    </div>
                  ) : (
                    'Search Rides'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {loading && (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" className="mx-auto" />
            <p className="mt-4 text-gray-600">Searching for available rides...</p>
          </div>
        )}

        {hasSearched && !loading && rides.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No rides found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
          </div>
        )}

        {rides.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Rides ({rides.length})
              </h2>
              <p className="text-gray-600">
                From {searchParams.source} to {searchParams.destination}
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  onBookRide={handleBookRide}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
