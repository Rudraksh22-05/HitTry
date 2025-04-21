
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTitle } from "@/hooks/use-title";
import { ExternalLink, BookOpen, Scale, Landmark, FileText, Heart } from 'lucide-react';

const Resources = () => {
  useTitle("Resources | Silent Guardians");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <Container>
          <Heading 
            title="Support Resources" 
            description="Access a curated collection of resources to aid in safety, recovery, and empowerment."
            className="mb-8"
          />
          
          <Tabs defaultValue="legal" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="legal">Legal Resources</TabsTrigger>
              <TabsTrigger value="mental-health">Mental Health</TabsTrigger>
              <TabsTrigger value="financial">Financial Help</TabsTrigger>
              <TabsTrigger value="safety">Safety Planning</TabsTrigger>
            </TabsList>
            
            {/* Legal Resources */}
            <TabsContent value="legal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    <span>Legal Aid Organizations</span>
                  </CardTitle>
                  <CardDescription>Free or low-cost legal assistance for survivors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">National Legal Aid & Defender Association</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Connects individuals with legal aid services near them, with many programs offering specialized services for survivors of violence.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>Visit Website</span>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">WomensLaw.org</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Provides state-specific legal information on domestic violence, restraining orders, and custody.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>Visit Website</span>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Victim Rights Law Center</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Provides free legal services to victims of sexual assault, with a focus on non-criminal legal issues.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>Visit Website</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    <span>Legal Guides & Documents</span>
                  </CardTitle>
                  <CardDescription>Legal information and forms for various situations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Protection Order Guide</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Step-by-step guide to obtaining a protection or restraining order in your state.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Download PDF</span>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Workplace Rights Guide</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Information about workplace protections for survivors of domestic violence or harassment.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Download PDF</span>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Housing Rights Resources</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Information about housing protections and accommodations for survivors.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Download PDF</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Mental Health Resources */}
            <TabsContent value="mental-health" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    <span>Therapy & Counseling Resources</span>
                  </CardTitle>
                  <CardDescription>Support services for emotional healing and recovery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">RAINN (Rape, Abuse & Incest National Network)</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Operates the National Sexual Assault Hotline and connects survivors with local counseling services.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>Visit Website</span>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Psychology Today Therapist Finder</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Search for therapists who specialize in trauma, PTSD, and abuse recovery.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>Visit Website</span>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Open Path Psychotherapy Collective</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Offers affordable therapy sessions for individuals and families in need.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>Visit Website</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Self-Help Resources</span>
                  </CardTitle>
                  <CardDescription>Guides and tools for self-healing and coping</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Trauma Recovery Workbook</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      A structured guide to help process trauma and build coping skills.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Download PDF</span>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Grounding Techniques for Anxiety & PTSD</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Practical methods to manage anxiety, flashbacks, and intrusive thoughts.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Download PDF</span>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Recommended Reading List</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Books recommended by therapists for healing from trauma and abuse.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      <span>View List</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Financial Resources */}
            <TabsContent value="financial" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Assistance Programs</CardTitle>
                  <CardDescription>Support for economic stability and independence</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Crime Victims Compensation</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Information on state programs that provide financial reimbursement for costs related to violent crimes.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>Learn More</span>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Emergency Financial Assistance</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Directory of organizations providing emergency funds for housing, utilities, and essential needs.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>View Directory</span>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Financial Empowerment Guide</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Tools and resources for rebuilding financial independence after leaving an abusive situation.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Download Guide</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Safety Planning */}
            <TabsContent value="safety" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Safety Planning Resources</CardTitle>
                  <CardDescription>Tools for creating personalized safety plans</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Comprehensive Safety Plan Template</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Customizable template for creating a detailed safety plan for various situations.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Download Template</span>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Technology Safety Guide</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Information on protecting your digital privacy and preventing technology-facilitated abuse.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Download Guide</span>
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Children's Safety Planning</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Resources for creating safety plans that include children's needs and well-being.
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Download Guide</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Resources;
