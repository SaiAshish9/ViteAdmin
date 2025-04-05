import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Campaign } from "../../../shared/schema";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Switch } from "../components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { useToast } from "../hooks/use-toast";
import { format } from "date-fns";

export default function CampaignConfigure() {
  const [location, setLocation] = useLocation();
  const [campaignTitle, setCampaignTitle] = useState("Construction Campaign");
  
  // Extract campaign ID from URL if provided for editing
  const searchParams = new URLSearchParams(window.location.search);
  const campaignId = searchParams.get('id') ? parseInt(searchParams.get('id') as string) : undefined;
  
  // Load campaign data if editing an existing campaign
  const { data: campaignData } = useQuery<Campaign>({
    queryKey: ['/api/campaigns', campaignId],
    queryFn: async () => {
      if (!campaignId) return null;
      const response = await fetch(`/api/campaigns/${campaignId}`);
      if (!response.ok) throw new Error('Failed to load campaign');
      return response.json();
    },
    enabled: !!campaignId
  });
  
  // Update state with campaign data when loaded
  useEffect(() => {
    if (campaignData) {
      setCampaignTitle(campaignData.name || "Construction Campaign");
    }
  }, [campaignData]);
  const { toast } = useToast();
  
  // Configuration state
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // One week from now
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [maxCallsPerDay, setMaxCallsPerDay] = useState(50);
  const [maxRetries, setMaxRetries] = useState(2);
  const [enableCallRecording, setEnableCallRecording] = useState(true);
  const [enableTranscripts, setEnableTranscripts] = useState(true);
  const [enableAnalytics, setEnableAnalytics] = useState(true);
  const [callPriority, setCallPriority] = useState("normal");
  
  const handleLaunchCampaign = async () => {
    try {
      // In a real app, this would make an API call to update or create the campaign
      const endpoint = campaignId ? `/api/campaigns/${campaignId}` : '/api/campaigns';
      const method = campaignId ? 'PATCH' : 'POST';
      
      // This is just a mock implementation for the demo
      toast({
        title: campaignId ? "Campaign Updated" : "Campaign Launched",
        description: campaignId 
          ? "Your campaign has been updated successfully!" 
          : "Your campaign has been launched successfully!",
      });
      
      setLocation("/campaigns");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your campaign. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveAsDraft = async () => {
    try {
      // In a real app, this would save the campaign as draft through an API call
      toast({
        title: campaignId ? "Draft Updated" : "Draft Saved",
        description: "Your campaign has been saved as a draft.",
      });
      
      setLocation("/campaigns");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your draft. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation(campaignId ? `/campaign-audience?id=${campaignId}` : "/campaign-audience")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          {/* Inline editable title */}
          <div className="flex items-center gap-1">
            <h1 className="text-xl font-bold">{campaignTitle}</h1>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                const newTitle = prompt("Enter new campaign name:", campaignTitle);
                if (newTitle) setCampaignTitle(newTitle);
              }}
            >
              <span className="sr-only">Edit</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex overflow-x-auto border-b">
        <div className="flex-1 min-w-[160px] text-center py-3 text-muted-foreground">
          <span className="inline-flex items-center">
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="whitespace-nowrap">Craft your Message</span>
          </span>
        </div>
        <div className="flex-1 min-w-[160px] text-center py-3 text-muted-foreground">
          <span className="inline-flex items-center">
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="whitespace-nowrap">Add your audience</span>
          </span>
        </div>
        <div className="flex-1 min-w-[160px] text-center py-3 border-b-2 border-primary">
          <span className="inline-flex items-center">
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="whitespace-nowrap">Configure & Launch</span>
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-y-auto bg-zinc-200 dark:bg-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Campaign Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Schedule</CardTitle>
              <CardDescription>
                Set when your campaign will run
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {endDate ? (
                          format(endDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Select
                    value={startTime}
                    onValueChange={setStartTime}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Select
                    value={endTime}
                    onValueChange={setEndTime}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                      <SelectItem value="19:00">7:00 PM</SelectItem>
                      <SelectItem value="20:00">8:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-calls">Max Calls Per Day</Label>
                  <Input
                    id="max-calls"
                    type="number"
                    min="1"
                    max="500"
                    value={maxCallsPerDay}
                    onChange={(e) => setMaxCallsPerDay(parseInt(e.target.value))}
                  />
                </div>
                
                {/* Max Retries removed as requested */}
              </div>
            </CardContent>
          </Card>
          
          {/* Call Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Call Settings</CardTitle>
              <CardDescription>
                Configure how calls are handled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Call Recording removed as requested */}
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="transcripts" className="flex-1">
                    Call Transcripts
                    <span className="block text-sm text-muted-foreground">
                      Generate text transcripts of calls
                    </span>
                  </Label>
                  <Switch
                    id="transcripts"
                    checked={enableTranscripts}
                    onCheckedChange={setEnableTranscripts}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="analytics" className="flex-1">
                    Call Analytics
                    <span className="block text-sm text-muted-foreground">
                      Generate insights from calls
                    </span>
                  </Label>
                  <Switch
                    id="analytics"
                    checked={enableAnalytics}
                    onCheckedChange={setEnableAnalytics}
                  />
                </div>
                
                {/* Call Priority removed as requested */}
              </div>
            </CardContent>
          </Card>
          
          {/* Campaign Summary */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Campaign Summary</CardTitle>
              <CardDescription>
                Review your campaign before launching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Campaign Name</h3>
                  <p>{campaignTitle}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                  <p>
                    {startDate && endDate
                      ? `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Calling Hours</h3>
                  <p>{`${startTime} - ${endTime}`}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Audience Size</h3>
                  <p>35 contacts</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Voice Type</h3>
                  <p>Indian Male Voice</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="text-yellow-500">
                    {campaignId ? "Ready to update" : "Ready to launch"}
                  </p>
                </div>
              </div>
            </CardContent>

          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between p-4 border-t">
        <Button
          variant="outline"
          onClick={() => setLocation(campaignId ? `/campaign-audience?id=${campaignId}` : "/campaign-audience")}
          className="w-full sm:w-auto"
        >
          Back
        </Button>
        <Button 
          onClick={handleLaunchCampaign}
          className="w-full sm:w-auto"
        >
          {campaignId ? "Update Campaign" : "Launch Campaign"}
        </Button>
      </div>
    </div>
  );
}