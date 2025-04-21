import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MapPin, AlertCircle, Compass, Phone, Search, Building, Shield, Info, Heart, ArrowLeft, Clock } from 'lucide-react';

// Mock data for support centers - in a real app, this would come from an API
const mockSupportCenters = [
  {
    id: 1,
    name: "Safe Haven Center",
    address: "123 Main Street, Cityville",
    phone: "+91 9876543210",
    distance: 0.8,
    services: ["Counseling", "Medical", "Legal Aid"],
    status: "Open"
  },
  {
    id: 2,
    name: "Community Support Hub",
    address: "456 Park Avenue, Townsburg",
    phone: "+91 9876543211",
    distance: 1.5,
    services: ["Shelter", "Food", "Mental Health"],
    status: "Open"
  },
  {
    id: 3,
    name: "Crisis Management Center",
    address: "789 Broadway, Villagetown",
    phone: "+91 9876543212",
    distance: 3.2,
    services: ["Emergency Care", "Temporary Housing", "Protection"],
    status: "Open"
  },
  {
    id: 4,
    name: "Women's Support Network",
    address: "321 Oak Road, Hamletville",
    phone: "+91 9876543213",
    distance: 4.7,
    services: ["Women's Services", "Counseling", "Legal Support"],
    status: "Closing soon"
  },
  {
    id: 5,
    name: "Youth Crisis Center",
    address: "654 Pine Street, Boroughville",
    phone: "+91 9876543214",
    distance: 6.1,
    services: ["Youth Services", "Mental Health", "Education"],
    status: "Open"
  }
];

// Mock data for emergency responders
const mockResponders = [
  {
    id: 1,
    name: "Local Police Department",
    phone: "100",
    distance: 1.2,
    response_time: "5-10 minutes"
  },
  {
    id: 2,
    name: "City Hospital Ambulance",
    phone: "108",
    distance: 2.5,
    response_time: "8-12 minutes"
  },
  {
    id: 3,
    name: "Women's Safety Patrol",
    phone: "1091",
    distance: 3.0,
    response_time: "10-15 minutes"
  },
  {
    id: 4,
    name: "Fire & Rescue Services",
    phone: "101",
    distance: 4.3,
    response_time: "12-18 minutes"
  }
];

const GeoAssistance = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCenters, setFilteredCenters] = useState(mockSupportCenters);
  const [activeRadius, setActiveRadius] = useState<number>(5);

  // Function to detect user's location
  const detectLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setIsLocating(false);
          
          toast({
            title: "Location detected",
            description: "We've found centers near you based on your current location.",
          });
          
          // In a real app, we would filter centers based on actual geo-distance
          // For this mock, we'll just use the pre-set distances
          filterCentersByRadius(activeRadius);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to access your location. Please check browser permissions.");
          setIsLocating(false);
          
          toast({
            title: "Location error",
            description: "We couldn't detect your location. Please check your permissions.",
            variant: "destructive",
          });
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLocating(false);
      
      toast({
        title: "Not supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

  // Function to filter centers by search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      filterCentersByRadius(activeRadius);
    } else {
      const filtered = mockSupportCenters.filter(center => 
        center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase())) ||
        center.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCenters(filtered);
    }
  }, [searchQuery, activeRadius]);

  // Function to filter centers by radius
  const filterCentersByRadius = (radius: number) => {
    setActiveRadius(radius);
    const filtered = mockSupportCenters.filter(center => center.distance <= radius);
    setFilteredCenters(filtered);
  };

  // Function to call a support center
  const callCenter = (phone: string, name: string) => {
    toast({
      title: "Connecting...",
      description: `Initiating secure call to ${name}`,
    });
    
    // In a real app, this would initiate a call
    console.log(`Calling ${name} at ${phone}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-10 px-4 md:px-8 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <MapPin className="mr-2 h-6 w-6 text-primary" />
                  Geo-Fenced Assistance
                </h1>
                <p className="text-muted-foreground">
                  Find local resources and emergency responders near your location
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Button 
                  variant="default" 
                  onClick={detectLocation}
                  disabled={isLocating}
                  className="flex items-center"
                >
                  <Compass className="mr-2 h-4 w-4" />
                  {isLocating ? "Detecting..." : "Detect My Location"}
                </Button>
              </div>
            </div>
            
            {locationError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Location Error</AlertTitle>
                <AlertDescription>{locationError}</AlertDescription>
              </Alert>
            )}
            
            {location && (
              <Alert className="mb-6 bg-primary/10 text-primary border-primary">
                <Info className="h-4 w-4" />
                <AlertTitle>Location Detected</AlertTitle>
                <AlertDescription>
                  Using your current location to find nearby assistance.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for centers, services or areas..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 items-center">
                <Label htmlFor="radius" className="whitespace-nowrap">Radius:</Label>
                <div className="flex gap-2">
                  {[2, 5, 10, 20].map((radius) => (
                    <Button
                      key={radius}
                      variant={activeRadius === radius ? "default" : "outline"}
                      size="sm"
                      onClick={() => filterCentersByRadius(radius)}
                    >
                      {radius} km
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="centers">
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="centers">Support Centers</TabsTrigger>
                <TabsTrigger value="responders">Emergency Responders</TabsTrigger>
              </TabsList>
              
              <TabsContent value="centers">
                <div className="space-y-4">
                  {filteredCenters.length > 0 ? (
                    filteredCenters.map((center) => (
                      <Card key={center.id} className="overflow-hidden">
                        <CardHeader className="bg-card p-4 pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl flex items-center">
                                <Building className="mr-2 h-5 w-5 text-primary" />
                                {center.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {center.address}
                              </CardDescription>
                            </div>
                            <Badge variant={center.status === "Open" ? "default" : "outline"}>
                              {center.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-4 pt-2">
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <p className="text-sm mb-2 flex items-center">
                                <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                                {center.distance} km away
                              </p>
                              
                              <div className="flex flex-wrap gap-2 my-2">
                                {center.services.map((service, idx) => (
                                  <Badge key={idx} variant="secondary">
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-4 sm:mt-0">
                              <Button 
                                onClick={() => callCenter(center.phone, center.name)}
                                className="w-full sm:w-auto"
                              >
                                <Phone className="mr-2 h-4 w-4" />
                                Call Center
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center p-12">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">No centers found</h3>
                      <p className="text-muted-foreground">
                        Try expanding your search radius or changing your search terms
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="responders">
                <div className="space-y-4">
                  {mockResponders.map((responder) => (
                    <Card key={responder.id} className="overflow-hidden">
                      <CardHeader className="bg-card p-4 pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl flex items-center">
                              <Shield className="mr-2 h-5 w-5 text-primary" />
                              {responder.name}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Emergency Contact: {responder.phone}
                            </CardDescription>
                          </div>
                          <Badge variant="destructive">Emergency</Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-4 pt-2">
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div>
                            <p className="text-sm mb-2 flex items-center">
                              <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                              {responder.distance} km away
                            </p>
                            
                            <p className="text-sm flex items-center">
                              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                              Response time: {responder.response_time}
                            </p>
                          </div>
                          
                          <div className="mt-4 sm:mt-0">
                            <Button 
                              variant="destructive"
                              onClick={() => callCenter(responder.phone, responder.name)}
                              className="w-full sm:w-auto"
                            >
                              <Phone className="mr-2 h-4 w-4" />
                              Emergency Call
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <Separator className="my-8" />
            
            <div className="bg-muted/50 rounded-lg p-4 md:p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Heart className="mr-2 h-5 w-5 text-primary" />
                How Geo-Fenced Assistance Works
              </h2>
              
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="font-medium">Private & Secure</h3>
                  <p className="text-muted-foreground text-sm">
                    Your location is only used temporarily to find nearby resources and is never stored.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Verified Services</h3>
                  <p className="text-muted-foreground text-sm">
                    All centers and responders are pre-screened and verified for quality and safety.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Real-Time Availability</h3>
                  <p className="text-muted-foreground text-sm">
                    Center status and responder availability are updated in real-time for accuracy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GeoAssistance;
