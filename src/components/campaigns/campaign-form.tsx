import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertCampaignSchema } from "../../../../shared/schema";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Switch } from "../ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { ArrowLeft, ChevronRight, Pencil, Play, X } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { Avatar } from "../ui/avatar";
import type { Campaign } from "../../../../shared/schema";

// Extend the schema with validation
const formSchema = insertCampaignSchema.extend({
  name: z.string().min(1, "Campaign name is required"),
  script: z.string().min(1, "Voice script is required"),
  objective: z.string().optional(),
  guidelines: z.string().optional(),
  callFlow: z.string().optional(),
  maxCallCount: z.number().min(1, "Maximum call count must be at least 1"),
  status: z.boolean(),
});

interface CampaignFormProps {
  isOpen: boolean;
  onClose: () => void;
  campaignToEdit?: Campaign;
}

const CampaignForm = ({ isOpen, onClose, campaignToEdit }: CampaignFormProps) => {
  const { toast } = useToast();
  const isEditing = !!campaignToEdit;
  const [activeStep, setActiveStep] = useState<'script' | 'audience' | 'launch'>('script');
  const [showConversation, setShowConversation] = useState(false);

  // Default values for the form
  const defaultValues = isEditing 
    ? {
        name: campaignToEdit.name,
        script: campaignToEdit.script,
        objective: campaignToEdit.objective || "",
        guidelines: campaignToEdit.guidelines || "",
        callFlow: campaignToEdit.callFlow || "",
        voiceType: campaignToEdit.voiceType,
        maxCallCount: campaignToEdit.maxCallCount,
        status: Boolean(campaignToEdit.status),
        createdBy: campaignToEdit.createdBy || 1,
      }
    : {
        name: "",
        script: "",
        objective: "You are an AI sales representative calling on behalf of a premium project. Your goal is to engage the customer, gauge their interest, and persuade them to visit the site.",
        guidelines: "• Greet the customer by name and introduce yourself\n• Maintain a friendly and professional tone\n• Keep responses concise and avoid speaking more than two sentences at a time\n• Always end with a question or prompt to encourage customer response",
        callFlow: "Call Flow & Sample Prompts:\n1. Introduction:\n• \"Hello, am I speaking with [Customer Name]?\"",
        voiceType: "Default Voice (Male)",
        maxCallCount: 100,
        status: false,
        createdBy: 1, // Hardcoded for demo
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { formState } = form;
  const isSubmitting = formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (isEditing) {
        await apiRequest("PATCH", `/api/campaigns/${campaignToEdit.id}`, data);
        toast({
          title: "Campaign updated",
          description: "Your campaign has been updated successfully",
        });
      } else {
        await apiRequest("POST", "/api/campaigns", data);
        toast({
          title: "Campaign created",
          description: "Your new campaign has been created successfully",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      onClose();
      form.reset(defaultValues);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} campaign`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90%] h-[90vh] p-0">
        <DialogTitle className="sr-only">{isEditing ? "Edit Campaign" : "Create New Campaign"}</DialogTitle>
        <DialogDescription className="sr-only">Configure your voice campaign settings</DialogDescription>
        
        {/* Header Navigation Bar */}
        <header className="flex items-center border-b border-border p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={onClose}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          {isEditing ? (
            <div className="flex items-center gap-2">
              {form.getValues("name") ? (
                <>
                  <h2 className="text-xl font-semibold">{form.getValues("name")}</h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-1" 
                    onClick={() => {
                      // Implement inline editing here
                      const newName = prompt("Enter new campaign name:", form.getValues("name"));
                      if (newName) form.setValue("name", newName);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <h2 className="text-xl font-semibold">New Campaign</h2>
              )}
            </div>
          ) : (
            <h2 className="text-xl font-semibold">New Campaign</h2>
          )}
        </header>
        
        {/* Campaign Editor Steps */}
        <div className="flex items-center justify-between border-b border-border px-8 py-4">
          <div className="flex items-center gap-6">
            <div 
              className={`flex items-center gap-2 ${activeStep === 'script' ? 'text-primary' : 'text-muted-foreground'} cursor-pointer`}
              onClick={() => setActiveStep('script')}
            >
              <div className={`h-6 w-6 rounded-full ${activeStep === 'script' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'} flex items-center justify-center text-xs`}>1</div>
              <span>Craft your Message</span>
            </div>
            
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            
            <div 
              className={`flex items-center gap-2 ${activeStep === 'audience' ? 'text-primary' : 'text-muted-foreground'} cursor-pointer`}
              onClick={() => setActiveStep('audience')}
            >
              <div className={`h-6 w-6 rounded-full ${activeStep === 'audience' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'} flex items-center justify-center text-xs`}>2</div>
              <span>Add your audience</span>
            </div>
            
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            
            <div 
              className={`flex items-center gap-2 ${activeStep === 'launch' ? 'text-primary' : 'text-muted-foreground'} cursor-pointer`}
              onClick={() => setActiveStep('launch')}
            >
              <div className={`h-6 w-6 rounded-full ${activeStep === 'launch' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'} flex items-center justify-center text-xs`}>3</div>
              <span>Configure & Launch</span>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 h-[calc(90vh-120px)] overflow-hidden">
            {activeStep === 'script' && (
              <>
                {/* Left Column - Campaign Instructions */}
                <div className="p-6 overflow-y-auto">
                  <h3 className="text-lg font-medium mb-4">Campaign Instructions</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar className="h-8 w-8">
                      <span className="text-xs">AI</span>
                    </Avatar>
                    <FormField
                      control={form.control}
                      name="voiceType"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select a voice" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Indian Male Voice">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-5 w-5">
                                    <span className="text-xs">AI</span>
                                  </Avatar>
                                  Indian Male Voice
                                </div>
                              </SelectItem>
                              <SelectItem value="Default Voice (Male)">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-5 w-5">
                                    <span className="text-xs">AI</span>
                                  </Avatar>
                                  Default Voice (Male)
                                </div>
                              </SelectItem>
                              <SelectItem value="Default Voice (Female)">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-5 w-5">
                                    <span className="text-xs">AI</span>
                                  </Avatar>
                                  Default Voice (Female)
                                </div>
                              </SelectItem>
                              <SelectItem value="Custom Voice 1">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-5 w-5">
                                    <span className="text-xs">AI</span>
                                  </Avatar>
                                  Custom Voice 1
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="objective"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Objective:</FormLabel>
                          <FormControl>
                            <Textarea 
                              className="min-h-[150px] resize-none overflow-y-visible"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="guidelines"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agent Prompt & Guidelines:</FormLabel>
                          <FormControl>
                            <Textarea 
                              className="min-h-[250px] resize-none overflow-y-visible"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="callFlow"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Call Flow & Sample Prompts:</FormLabel>
                          <FormControl>
                            <Textarea 
                              className="min-h-[150px] resize-none overflow-y-visible"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="hidden">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="script"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="maxCallCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Test Conversation */}
                <div className="p-6 border-l border-border overflow-y-auto bg-muted/30">
                  <h3 className="text-lg font-medium mb-4">Test the Conversation</h3>
                  
                  <div className="bg-card rounded-lg min-h-[550px] flex items-center justify-center">
                    <div className="text-center">
                      <Button size="lg" className="mb-4" onClick={() => setShowConversation(true)}>
                        <Play className="mr-2 h-4 w-4" /> Start Call
                      </Button>
                      <p className="text-muted-foreground">Test your voice agent with a simulated conversation</p>
                    </div>
                  </div>
                  
                  {showConversation && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                      <div className="bg-card rounded-lg w-[500px] h-[600px] p-4 flex flex-col shadow-lg border border-border">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <span className="text-xs">AI</span>
                            </Avatar>
                            <span>Voice Agent</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setShowConversation(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                          {/* AI Message */}
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8 mt-1">
                              <span className="text-xs">AI</span>
                            </Avatar>
                            <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                              <p className="text-sm">Hello, am I speaking with Riya?</p>
                            </div>
                          </div>
                          
                          {/* User Message */}
                          <div className="flex items-start justify-end gap-3">
                            <div className="bg-primary/10 p-3 rounded-lg max-w-[80%]">
                              <p className="text-sm">Yes, who are you?</p>
                            </div>
                            <Avatar className="h-8 w-8 mt-1 bg-primary/20">
                              <span className="text-xs">👤</span>
                            </Avatar>
                          </div>
                          
                          {/* AI Message */}
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8 mt-1">
                              <span className="text-xs">AI</span>
                            </Avatar>
                            <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                              <p className="text-sm">Hi Riya, I'm Amit from Aparna Sarovar. We're inviting select buyers to visit our premium luxury apartment project in Nallagandla. Do you have a minute to discuss?</p>
                            </div>
                          </div>
                          
                          {/* User Message */}
                          <div className="flex items-start justify-end gap-3">
                            <div className="bg-primary/10 p-3 rounded-lg max-w-[80%]">
                              <p className="text-sm">I'm a bit busy. Can you tell me quickly?</p>
                            </div>
                            <Avatar className="h-8 w-8 mt-1 bg-primary/20">
                              <span className="text-xs">👤</span>
                            </Avatar>
                          </div>
                          
                          {/* AI Message */}
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8 mt-1">
                              <span className="text-xs">AI</span>
                            </Avatar>
                            <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                              <p className="text-sm">Of course! Aparna Sarovar offers premium residences with world-class amenities in a prime location. The best way to experience it is with a site visit. Would you be open to stopping by this week?</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Input Area */}
                        <div className="flex items-center gap-2 mt-auto border-t border-border pt-4">
                          <input 
                            type="text" 
                            className="flex-1 bg-background border border-input rounded-md px-3 h-10 text-sm"
                            placeholder="Type your response..."
                          />
                          <Button size="icon" variant="ghost">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {activeStep === 'audience' && (
              <>
                {/* Audience Selection */}
                <div className="p-6 overflow-y-auto">
                  <h3 className="text-lg font-medium mb-4">Select Your Audience</h3>
                  
                  <div className="space-y-4">
                    <div className="mb-6">
                      <p className="text-muted-foreground mb-4">
                        Choose who will receive calls from this campaign. You can upload a list or select from your existing contacts.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                          <h4 className="font-medium mb-2">Upload Contact List</h4>
                          <p className="text-sm text-muted-foreground">Import contacts from a CSV or Excel file</p>
                        </div>
                        
                        <div className="border border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                          <h4 className="font-medium mb-2">Select from Contacts</h4>
                          <p className="text-sm text-muted-foreground">Choose from your existing contact database</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-6">
                      <h4 className="font-medium mb-4">Campaign Limits</h4>
                      
                      <FormField
                        control={form.control}
                        name="maxCallCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Number of Calls</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Input 
                                  type="number" 
                                  className="max-w-[200px]"
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                                />
                                <span className="ml-3 text-muted-foreground text-sm">calls in this campaign</span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Preview */}
                <div className="p-6 border-l border-border overflow-y-auto bg-muted/30">
                  <h3 className="text-lg font-medium mb-4">Audience Preview</h3>
                  
                  <div className="bg-card rounded-lg min-h-[550px] p-4">
                    <div className="text-center mb-8 py-6">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                        <span className="text-xl font-semibold">0</span>
                      </div>
                      <p className="text-muted-foreground">No contacts selected yet</p>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <h4 className="font-medium mb-2">Contact Fields Available:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Name</li>
                        <li>Phone Number</li>
                        <li>Email</li>
                        <li>City</li>
                        <li>Last Contact Date</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {activeStep === 'launch' && (
              <>
                {/* Launch Configuration */}
                <div className="p-6 overflow-y-auto">
                  <h3 className="text-lg font-medium mb-4">Launch Configuration</h3>
                  
                  <div className="space-y-6">
                    <div className="border border-border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Campaign Summary</h4>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="text-muted-foreground">Voice Type:</div>
                        <div>{form.getValues("voiceType")}</div>
                        
                        <div className="text-muted-foreground">Total Calls:</div>
                        <div>{form.getValues("maxCallCount")}</div>
                        
                        <div className="text-muted-foreground">Campaign Name:</div>
                        <div>
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter a name for this campaign"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Schedule</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-border rounded-lg p-3 cursor-pointer hover:border-primary">
                          <div className="font-medium">Run Immediately</div>
                          <div className="text-sm text-muted-foreground mt-1">Start campaign as soon as it's launched</div>
                        </div>
                        
                        <div className="border border-border rounded-lg p-3 cursor-pointer">
                          <div className="font-medium">Schedule for Later</div>
                          <div className="text-sm text-muted-foreground mt-1">Set a specific date and time</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Call Handling</h4>
                      
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <div className="font-medium">Do Not Disturb Compliance</div>
                          <div className="text-sm text-muted-foreground">Follow DND registry regulations</div>
                        </div>
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Switch
                                  checked={field.value === true}
                                  onCheckedChange={(checked) => field.onChange(checked)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Campaign Preview */}
                <div className="p-6 border-l border-border overflow-y-auto bg-muted/30">
                  <h3 className="text-lg font-medium mb-4">Campaign Preview</h3>
                  
                  <div className="bg-card rounded-lg p-6">
                    <div className="mb-6 space-y-4">
                      <h4 className="font-medium">{form.getValues("name") || "Untitled Campaign"}</h4>
                      
                      <div className="text-sm space-y-2">
                        <div><span className="text-muted-foreground">Voice:</span> {form.getValues("voiceType")}</div>
                        <div><span className="text-muted-foreground">Total Calls:</span> {form.getValues("maxCallCount")}</div>
                        <div><span className="text-muted-foreground">Status:</span> Draft</div>
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-4 mb-6">
                      <h5 className="font-medium mb-2">Objective:</h5>
                      <p className="text-sm text-muted-foreground">{form.getValues("objective")}</p>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button className="w-full max-w-xs" size="lg" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                        {isEditing ? "Update" : "Launch"} Campaign
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </form>
        </Form>
        
        {/* Footer Actions */}
        <div className="border-t border-border p-4 flex justify-between">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              disabled={activeStep === 'script'}
              onClick={() => {
                if (activeStep === 'audience') setActiveStep('script');
                if (activeStep === 'launch') setActiveStep('audience');
              }}
            >
              Back
            </Button>
            {activeStep === 'launch' ? (
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isEditing ? "Update" : "Launch"} Campaign
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  if (activeStep === 'script') setActiveStep('audience');
                  if (activeStep === 'audience') setActiveStep('launch');
                }}
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignForm;
