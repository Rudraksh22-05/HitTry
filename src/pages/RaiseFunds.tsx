<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> friend/main
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
<<<<<<< HEAD
=======
import { Separator } from '@/components/ui/separator';
>>>>>>> friend/main
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
<<<<<<< HEAD
import { CircleDollarSign, Users, ArrowLeft, Info, Wallet } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { crowdfundingContractService } from '@/lib/blockchain/crowdfundingContract';
import { ethers } from 'ethers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Constants for conversion
const ETH_TO_USD = 2700; // Example rate, should be fetched from an API
const USD_TO_INR = 83; // Example rate, should be fetched from an API
const GWEI_TO_ETH = 1e-9;
const WEI_TO_ETH = 1e-18;

// Helper functions for currency conversion
const convertToEth = (amount: number): number => {
  return amount * GWEI_TO_ETH;
};

const convertToUSD = (ethAmount: number): number => {
  return ethAmount * ETH_TO_USD;
};

const convertToINR = (usdAmount: number): number => {
  return usdAmount * USD_TO_INR;
};

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount);
};
=======
import { CircleDollarSign, Users, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
>>>>>>> friend/main

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
<<<<<<< HEAD
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [convertedAmounts, setConvertedAmounts] = useState({
    eth: '0',
    usd: '0',
    inr: '0',
    gwei: '0'
  });
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
=======
>>>>>>> friend/main

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

<<<<<<< HEAD
  // Check if MetaMask is installed
  const checkIfWalletIsInstalled = () => {
    const { ethereum } = window as any;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const { ethereum } = window as any;
      
      if (!ethereum) {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask to use blockchain features.",
          variant: "destructive",
        });
        return;
      }

      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      
      setWalletAddress(accounts[0]);
      setChainId(chainId);

      // Listen for account changes
      ethereum.on('accountsChanged', (newAccounts: string[]) => {
        setWalletAddress(newAccounts[0] || null);
      });

      // Listen for chain changes
      ethereum.on('chainChanged', (newChainId: string) => {
        setChainId(newChainId);
      });

      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask!",
      });
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setWalletAddress(null);
    setChainId(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Check if we're on the correct network (Sepolia)
  const isCorrectNetwork = () => {
    return chainId === '0xaa36a7'; // Sepolia chainId
  };

  // Switch network function
  const switchToSepolia = async () => {
    try {
      const { ethereum } = window as any;
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
      });
    } catch (error: any) {
      console.error('Error switching network:', error);
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch to Sepolia network",
        variant: "destructive",
      });
    }
  };

  // Watch for changes in goalAmount
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'goalAmount') {
        const amount = parseFloat(value.goalAmount || '0');
        if (!isNaN(amount)) {
          // Convert from GWEI to other currencies
          const ethAmount = convertToEth(amount);
          const usdAmount = convertToUSD(ethAmount);
          const inrAmount = convertToINR(usdAmount);
          
          setConvertedAmounts({
            eth: ethAmount.toFixed(6),
            usd: usdAmount.toFixed(2),
            inr: inrAmount.toFixed(2),
            gwei: amount.toString()
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a fundraiser.",
        variant: "destructive",
      });
      return;
    }

    if (!isCorrectNetwork()) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Sepolia network to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const deadlineDate = new Date(values.deadline);
      const today = new Date();
      const durationInDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Validate deadline: must be at least 1 day in the future
      if (isNaN(deadlineDate.getTime()) || deadlineDate <= today || durationInDays < 1) {
        toast({
          title: "Invalid Deadline",
          description: "Please select a deadline at least 1 day in the future.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Convert GWEI to WEI for the contract
      const gweiAmount = parseFloat(values.goalAmount);
      if (isNaN(gweiAmount) || gweiAmount <= 0) {
        toast({
          title: "Invalid Goal Amount",
          description: "Goal amount must be greater than zero.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      const weiAmount = ethers.parseUnits(gweiAmount.toString(), 'gwei');

      await crowdfundingContractService.initializeContract();
      await crowdfundingContractService.createCampaign(
        values.title,
        values.description,
        Number(weiAmount.toString()),
        durationInDays
      );
      
      toast({
        title: "Fundraiser Created!",
        description: "Your fundraiser has been created on the blockchain.",
      });
      
      setTimeout(() => {
        navigate('/CrowdFunding');
      }, 2000);
    } catch (error: any) {
      console.error('Error creating fundraiser:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create fundraiser. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
=======
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
>>>>>>> friend/main
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
<<<<<<< HEAD
            <h1 className="text-3xl font-bold mb-2">Create Blockchain Fundraiser</h1>
            <p className="text-muted-foreground mb-6">
              Create a transparent and secure fundraiser on the blockchain
            </p>

            <Tabs defaultValue="start" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8 bg-muted/20 rounded-xl p-1 flex justify-between gap-2">
                <TabsTrigger value="start" className="flex-1">Getting Started</TabsTrigger>
                <TabsTrigger value="create" className="flex-1">Create Fundraiser</TabsTrigger>
                <TabsTrigger value="view" className="flex-1" onClick={() => navigate('/CrowdFunding')}>View Fundraisers</TabsTrigger>
                <TabsTrigger value="tips" className="flex-1">Tips & Guidelines</TabsTrigger>
=======
            <h1 className="text-3xl font-bold mb-2">Raise Funds</h1>
            <p className="text-muted-foreground mb-6">
              Create a fundraiser to receive financial support for your cause
            </p>

            <Tabs defaultValue="start" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="start">Getting Started</TabsTrigger>
                <TabsTrigger value="create">Create Fundraiser</TabsTrigger>
                <TabsTrigger value="tips">Tips & Guidelines</TabsTrigger>
>>>>>>> friend/main
              </TabsList>
              
              <TabsContent value="start">
                <div className="space-y-6">
                  <div className="text-center p-6 md:p-10 bg-card rounded-xl">
                    <CircleDollarSign className="h-16 w-16 mx-auto text-primary mb-4" />
<<<<<<< HEAD
                    <h2 className="text-2xl font-medium mb-4">How Blockchain Fundraising Works</h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                      Create a transparent and immutable fundraising campaign on the blockchain. 
                      All transactions are recorded and visible to everyone, ensuring complete transparency.
                    </p>
                    {!walletAddress ? (
                      <Button onClick={connectWallet} disabled={isConnecting}>
                        <Wallet className="mr-2 h-4 w-4" />
                        {isConnecting ? 'Connecting...' : 'Connect Wallet to Start'}
                      </Button>
                    ) : (
                      <Button onClick={() => setActiveTab('create')}>
                        Start Your Fundraiser
                      </Button>
                    )}
=======
                    <h2 className="text-2xl font-medium mb-4">How Fundraising Works</h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                      Our secure platform allows you to raise funds while maintaining privacy. All fundraisers
                      are reviewed for legitimacy, and donors can give anonymously.
                    </p>
                    <Button onClick={() => setActiveTab('create')}>
                      Start Your Fundraiser
                    </Button>
>>>>>>> friend/main
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
<<<<<<< HEAD
                        <p>Receive funds directly to your wallet through smart contracts</p>
=======
                        <p>Receive funds directly to your secure account with low platform fees</p>
>>>>>>> friend/main
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="create">
<<<<<<< HEAD
                {!checkIfWalletIsInstalled() ? (
                  <Alert>
                    <AlertTitle>MetaMask Required</AlertTitle>
                    <AlertDescription>
                      <p className="mb-2">Please install MetaMask to create a fundraiser.</p>
                      <Button
                        variant="outline"
                        onClick={() => window.open('https://metamask.io', '_blank')}
                      >
                        Install MetaMask
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : !walletAddress ? (
                  <Alert>
                    <AlertTitle>Connect Wallet</AlertTitle>
                    <AlertDescription>
                      <p className="mb-2">Please connect your wallet to create a fundraiser.</p>
                      <Button
                        variant="outline"
                        onClick={connectWallet}
                        disabled={isConnecting}
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : !isCorrectNetwork() ? (
                  <Alert>
                    <AlertTitle>Wrong Network</AlertTitle>
                    <AlertDescription>
                      <p className="mb-2">Please switch to Sepolia network to continue.</p>
                      <Button
                        variant="outline"
                        onClick={switchToSepolia}
                      >
                        Switch to Sepolia
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                      <div>
                        <p className="font-medium">Connected Wallet</p>
                        <p className="text-sm text-muted-foreground">{formatAddress(walletAddress)}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={disconnectWallet}
                      >
                        Disconnect
                      </Button>
                    </div>

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
                                    <SelectGroup>
                                      <SelectLabel>Healthcare & Medical</SelectLabel>
                                      <SelectItem value="medical-treatment">Medical Treatment</SelectItem>
                                      <SelectItem value="medical-equipment">Medical Equipment</SelectItem>
                                      <SelectItem value="surgery">Surgery</SelectItem>
                                      <SelectItem value="therapy">Therapy & Rehabilitation</SelectItem>
                                      <SelectItem value="mental-health">Mental Health</SelectItem>
                                      <SelectItem value="dental">Dental Care</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                      <SelectLabel>Education</SelectLabel>
                                      <SelectItem value="education-fees">Tuition Fees</SelectItem>
                                      <SelectItem value="education-supplies">School Supplies</SelectItem>
                                      <SelectItem value="scholarship">Scholarship Fund</SelectItem>
                                      <SelectItem value="research">Research Project</SelectItem>
                                      <SelectItem value="skill-development">Skill Development</SelectItem>
                                      <SelectItem value="education-tech">Educational Technology</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                      <SelectLabel>Emergency & Relief</SelectLabel>
                                      <SelectItem value="natural-disaster">Natural Disaster</SelectItem>
                                      <SelectItem value="accident">Accident Recovery</SelectItem>
                                      <SelectItem value="crisis-relief">Crisis Relief</SelectItem>
                                      <SelectItem value="emergency-aid">Emergency Aid</SelectItem>
                                      <SelectItem value="fire-damage">Fire Damage</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                      <SelectLabel>Community Development</SelectLabel>
                                      <SelectItem value="community-center">Community Center</SelectItem>
                                      <SelectItem value="public-space">Public Space Improvement</SelectItem>
                                      <SelectItem value="local-business">Local Business Support</SelectItem>
                                      <SelectItem value="food-bank">Food Bank</SelectItem>
                                      <SelectItem value="homeless-shelter">Homeless Shelter</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                      <SelectLabel>Environment & Wildlife</SelectLabel>
                                      <SelectItem value="conservation">Conservation Project</SelectItem>
                                      <SelectItem value="animal-rescue">Animal Rescue</SelectItem>
                                      <SelectItem value="clean-energy">Clean Energy Initiative</SelectItem>
                                      <SelectItem value="tree-planting">Tree Planting</SelectItem>
                                      <SelectItem value="ocean-cleanup">Ocean Cleanup</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                      <SelectLabel>Technology & Innovation</SelectLabel>
                                      <SelectItem value="tech-startup">Tech Startup</SelectItem>
                                      <SelectItem value="open-source">Open Source Project</SelectItem>
                                      <SelectItem value="innovation">Innovation Project</SelectItem>
                                      <SelectItem value="robotics">Robotics</SelectItem>
                                      <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                      <SelectLabel>Arts & Culture</SelectLabel>
                                      <SelectItem value="performing-arts">Performing Arts</SelectItem>
                                      <SelectItem value="visual-arts">Visual Arts</SelectItem>
                                      <SelectItem value="music">Music</SelectItem>
                                      <SelectItem value="film">Film & Video</SelectItem>
                                      <SelectItem value="cultural-event">Cultural Event</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                      <SelectLabel>Sports & Athletics</SelectLabel>
                                      <SelectItem value="sports-team">Sports Team</SelectItem>
                                      <SelectItem value="sports-equipment">Sports Equipment</SelectItem>
                                      <SelectItem value="competition">Competition Funding</SelectItem>
                                      <SelectItem value="training">Athletic Training</SelectItem>
                                      <SelectItem value="sports-facility">Sports Facility</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                      <SelectLabel>Business & Entrepreneurship</SelectLabel>
                                      <SelectItem value="startup">Startup Funding</SelectItem>
                                      <SelectItem value="small-business">Small Business</SelectItem>
                                      <SelectItem value="social-enterprise">Social Enterprise</SelectItem>
                                      <SelectItem value="business-expansion">Business Expansion</SelectItem>
                                      <SelectItem value="market-launch">Market Launch</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                      <SelectLabel>Nonprofit & Charity</SelectLabel>
                                      <SelectItem value="ngo">NGO Project</SelectItem>
                                      <SelectItem value="charity-event">Charity Event</SelectItem>
                                      <SelectItem value="volunteer">Volunteer Program</SelectItem>
                                      <SelectItem value="awareness">Awareness Campaign</SelectItem>
                                      <SelectItem value="social-cause">Social Cause</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                      <SelectLabel>Legal Aid</SelectLabel>
                                      <SelectItem value="legal-fees">Legal Fees</SelectItem>
                                      <SelectItem value="human-rights">Human Rights</SelectItem>
                                      <SelectItem value="advocacy">Legal Advocacy</SelectItem>
                                      <SelectItem value="justice">Access to Justice</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                      <SelectLabel>Other</SelectLabel>
                                      <SelectItem value="personal">Personal Cause</SelectItem>
                                      <SelectItem value="memorial">Memorial Fund</SelectItem>
                                      <SelectItem value="travel">Travel & Adventure</SelectItem>
                                      <SelectItem value="creative">Creative Project</SelectItem>
                                      <SelectItem value="other">Other Cause</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Choose the category that best fits your fundraising cause
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="goalAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  Goal Amount (INR)
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-[300px] space-y-2">
                                        <p>Current conversions:</p>
                                        <p>ETH: {formatCurrency(parseFloat(convertedAmounts.eth), 'ETH')}</p>
                                        <p>USD: {formatCurrency(parseFloat(convertedAmounts.usd), 'USD')}</p>
                                        <p>INR: {formatCurrency(parseFloat(convertedAmounts.inr), 'INR')}</p>
                                        <p>GWEI: {convertedAmounts.gwei}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number"
                                    step="1"
                                    min="1"
                                    placeholder="1000 (e.g., ₹1000)"
                                    value={field.value}
                                    onChange={e => {
                                      field.onChange(e);
                                      const inrAmount = parseFloat(e.target.value || '0');
                                      if (!isNaN(inrAmount)) {
                                        const usdAmount = inrAmount / USD_TO_INR;
                                        const ethAmount = usdAmount / ETH_TO_USD;
                                        const gweiAmount = ethAmount / GWEI_TO_ETH;
                                        setConvertedAmounts({
                                          eth: ethAmount.toFixed(6),
                                          usd: usdAmount.toFixed(2),
                                          inr: inrAmount.toFixed(2),
                                          gwei: Math.round(gweiAmount).toString()
                                        });
                                      } else {
                                        setConvertedAmounts({ eth: '0', usd: '0', inr: '0', gwei: '0' });
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormDescription>
                                  {`${formatCurrency(parseFloat(convertedAmounts.inr), 'INR')} ≈ ${formatCurrency(parseFloat(convertedAmounts.usd), 'USD')} ≈ ${formatCurrency(parseFloat(convertedAmounts.eth), 'ETH')} ≈ ${convertedAmounts.gwei} GWEI`}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Explain your cause, how the funds will be used, and why it matters" 
                                    className="min-h-[150px]"
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
                                  <Input 
  type="date"
  min={new Date().toISOString().split('T')[0]}
  value={field.value || ""}
  onChange={field.onChange}
/>
                                </FormControl>
                                <FormDescription>
                                  Set a realistic timeline for your fundraising campaign
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Creating...' : 'Create Fundraiser'}
                        </Button>
                      </form>
                    </Form>
                  </div>
                )}
=======
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
>>>>>>> friend/main
              </TabsContent>
              
              <TabsContent value="tips">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
<<<<<<< HEAD
                      <CardTitle>Tips for a Successful Fundraiser</CardTitle>
                      <CardDescription>Follow these guidelines to maximize your fundraising potential</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Tell Your Story</h3>
                        <p className="text-muted-foreground">Share a compelling narrative that connects with potential donors</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Set a Realistic Goal</h3>
                        <p className="text-muted-foreground">Choose an amount that matches your needs and timeline</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Share Updates</h3>
                        <p className="text-muted-foreground">Keep donors informed about your progress and impact</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Engage Your Network</h3>
                        <p className="text-muted-foreground">Reach out to your community and social networks</p>
                      </div>
                    </CardContent>
                  </Card>
=======
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
>>>>>>> friend/main
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
<<<<<<< HEAD

=======
      
>>>>>>> friend/main
      <Footer />
    </div>
  );
};

export default RaiseFunds;
