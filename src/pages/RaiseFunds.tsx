import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CircleDollarSign, Users, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  goalAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid amount",
  }),
  description: z.string().min(50, "Description must be at least 50 characters"),
  deadline: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date > new Date();
  }, {
    message: "Please enter a future date",
  }),
});

const RaiseFunds = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('start');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: '',
      goalAmount: '',
      description: '',
      deadline: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Fundraiser created!",
      description: "Your fundraiser has been submitted for review.",
    });
    
    // Redirect to a success page or dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-10 px-4 md:px-8 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-10">
            <h1 className="text-3xl font-bold mb-2">Raise Funds</h1>
            <p className="text-muted-foreground mb-6">
              Create a fundraiser to receive financial support for your cause
            </p>

            <Tabs defaultValue="start" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="start">Getting Started</TabsTrigger>
                <TabsTrigger value="create">Create Fundraiser</TabsTrigger>
                <TabsTrigger value="tips">Tips & Guidelines</TabsTrigger>
              </TabsList>
              
              <TabsContent value="start">
                <div className="space-y-6">
                  <div className="text-center p-6 md:p-10 bg-card rounded-xl">
                    <CircleDollarSign className="h-16 w-16 mx-auto text-primary mb-4" />
                    <h2 className="text-2xl font-medium mb-4">How Fundraising Works</h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                      Our secure platform allows you to raise funds while maintaining privacy. All fundraisers
                      are reviewed for legitimacy, and donors can give anonymously.
                    </p>
                    <Button onClick={() => setActiveTab('create')}>
                      Start Your Fundraiser
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Create</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Set up your fundraiser with a compelling story and funding goal</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Share</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Share your fundraiser with the community and on your trusted networks</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Receive</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Receive funds directly to your secure account with low platform fees</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="create">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fundraiser Title</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., Support for Child Education Program" {...field} />
                            </FormControl>
                            <FormDescription>
                              Create a clear, specific title that explains your cause
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="medical">Medical & Health</SelectItem>
                                  <SelectItem value="education">Education</SelectItem>
                                  <SelectItem value="emergency">Emergency Relief</SelectItem>
                                  <SelectItem value="community">Community Projects</SelectItem>
                                  <SelectItem value="legal">Legal Aid</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="goalAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Goal Amount (₹)</FormLabel>
                              <FormControl>
                                <Input placeholder="1000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Explain your cause, how the funds will be used, and why it matters" 
                                className="min-h-32"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Be detailed and transparent about your fundraising goals
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deadline</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-end">
                      <Button type="submit">Submit Fundraiser</Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="tips">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fundraising Best Practices</CardTitle>
                      <CardDescription>
                        Follow these guidelines to maximize your chances of success
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-medium">Tell Your Story Authentically</h3>
                        <p className="text-muted-foreground">
                          Share genuine details about your situation and needs. Authenticity builds trust.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Set a Realistic Goal</h3>
                        <p className="text-muted-foreground">
                          Calculate your actual needs carefully and set an achievable funding target.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Maintain Privacy</h3>
                        <p className="text-muted-foreground">
                          Be mindful about what personal details you share. Our platform allows for anonymity.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Provide Updates</h3>
                        <p className="text-muted-foreground">
                          Keep supporters informed about your progress and how funds are being used.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Transparency & Trust</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">
                        Our platform takes a small 5% fee to cover transaction costs and platform maintenance.
                        We verify all fundraisers to ensure legitimacy and protect our community.
                      </p>
                      <p>
                        Funds are held securely and released according to our terms and conditions.
                        See our <Button variant="link" className="p-0 h-auto">Privacy Policy</Button> for details.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RaiseFunds;
