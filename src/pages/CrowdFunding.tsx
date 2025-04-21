import React, { useEffect, useState } from 'react';
import { crowdfundingContractService } from '@/lib/blockchain/crowdfundingContract';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface Campaign {
  creator: string;
  title: string;
  description: string;
  goal: string;
  pledged: string;
  deadline: string;
  completed: boolean;
}

const CrowdFunding: React.FC = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [pledging, setPledging] = useState<{ [id: number]: boolean }>({});
  const [form, setForm] = useState({
    title: '',
    description: '',
    goal: '',
    duration: '',
  });
  const [pledge, setPledge] = useState<{ [id: number]: string }>({});

  // Fetch all campaigns
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      await crowdfundingContractService.initializeContract();
      const count = await crowdfundingContractService.campaignCount();
      const fetched: Campaign[] = [];
      for (let i = 0; i < count; i++) {
        const c = await crowdfundingContractService.getCampaign(i);
        fetched.push({
          creator: c[0],
          title: c[1],
          description: c[2],
          goal: c[3].toString(),
          pledged: c[4].toString(),
          deadline: new Date(Number(c[5]) * 1000).toLocaleString(),
          completed: c[6],
        });
      }
      setCampaigns(fetched);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to fetch campaigns', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line
  }, []);

  // Create campaign
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await crowdfundingContractService.createCampaign(
        form.title,
        form.description,
        Number(form.goal),
        Number(form.duration)
      );
      toast({ title: 'Campaign Created', description: 'Your campaign was created!' });
      setForm({ title: '', description: '', goal: '', duration: '' });
      fetchCampaigns();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to create campaign', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  // Pledge to campaign
  const handlePledge = async (id: number) => {
    if (!pledge[id] || isNaN(Number(pledge[id]))) return;
    setPledging((p) => ({ ...p, [id]: true }));
    try {
      await crowdfundingContractService.pledge(id, pledge[id]);
      toast({ title: 'Pledged!', description: 'Thank you for your support.' });
      setPledge((p) => ({ ...p, [id]: '' }));
      fetchCampaigns();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to pledge', variant: 'destructive' });
    } finally {
      setPledging((p) => ({ ...p, [id]: false }));
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-bold">Active Campaigns</h2>
  <Button variant="outline" size="sm" onClick={() => window.location.href = '/raise-funds'}>
    Go to Fundraiser
  </Button>
</div>
      {loading ? (
        <div>Loading campaigns...</div>
      ) : campaigns.filter((c) => !c.completed).length === 0 ? (
        <div>No active campaigns found.</div>
      ) : (
        campaigns.filter((c) => !c.completed).map((c, i) => {
          // Conversion constants
          const ETH_TO_USD = 2700; // Example rate, should match your main app
          const USD_TO_INR = 83;   // Example rate, should match your main app
          const INR_TO_ETH = (inr: number) => {
            const usd = inr / USD_TO_INR;
            return usd / ETH_TO_USD;
          };
          const inrValue = pledge[i] ? parseFloat(pledge[i]) : 0;
          const ethValue = !isNaN(inrValue) && inrValue > 0 ? INR_TO_ETH(inrValue) : 0;
          return (
            <Card key={i} className="mb-6">
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
                <CardDescription>By: {c.creator}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-2">{c.description}</div>
                <div className="flex flex-wrap gap-4 text-sm mb-2">
                  <span>Goal: {c.goal}</span>
                  <span>Pledged: {c.pledged}</span>
                  <span>Deadline: {c.deadline}</span>
                  <span>Status: Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Amount in INR"
                    type="number"
                    value={pledge[i] || ''}
                    onChange={(e) => setPledge((p) => ({ ...p, [i]: e.target.value }))}
                    className="w-32"
                    disabled={pledging[i]}
                  />
                  <span className="text-xs text-muted-foreground">{ethValue > 0 ? `≈ ${ethValue.toFixed(6)} ETH` : ''}</span>
                  <Button
                    onClick={async () => {
                      // Prevent pledging to expired campaigns
                      if (new Date(c.deadline).getTime() <= Date.now()) {
                        toast({ title: 'Error', description: 'This campaign has ended. You cannot pledge.', variant: 'destructive' });
                        return;
                      }
                      // Convert INR to ETH before sending
                      if (!pledge[i] || isNaN(Number(pledge[i]))) return;
                      const eth = INR_TO_ETH(Number(pledge[i]));
                      // 1 wei = 0.000000000000000001 ETH
                      if (eth < 0.000000000000000001) {
                        toast({ title: 'Error', description: 'Amount too low. Please pledge a higher INR value.', variant: 'destructive' });
                        return;
                      }
                      setPledging((p) => ({ ...p, [i]: true }));
                      try {
                        const ethStr = eth.toFixed(18);
                        console.log('Pledging ETH:', ethStr);
                        await crowdfundingContractService.pledge(i, ethStr);
                        toast({ title: 'Pledged!', description: 'Thank you for your support.' });
                        setPledge((p) => ({ ...p, [i]: '' }));
                        fetchCampaigns();
                      } catch (err) {
                        console.error('Pledge Error:', err);
                        toast({ title: 'Error', description: 'Failed to pledge', variant: 'destructive' });
                      } finally {
                        setPledging((p) => ({ ...p, [i]: false }));
                      }
                    }}
                    disabled={pledging[i] || !pledge[i] || isNaN(Number(pledge[i])) || new Date(c.deadline).getTime() <= Date.now()}
                  >
                    {pledging[i] ? 'Pledging...' : 'Pledge'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default CrowdFunding;
