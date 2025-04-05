import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Separator } from "../components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";
import { Phone, Clock, User, ChevronDown, ChevronUp, DownloadCloud, Calendar, Mail, Headset } from "lucide-react";
import { CallHistory as CallHistoryType } from "../../../shared/schema";
import { formatDistanceToNow } from "date-fns";

// Enhanced call history data type
type EnhancedCallHistory = CallHistoryType & {
  campaignName?: string;
  duration?: string;
  transcript?: string;
  isOpen?: boolean;
};

const CallHistory = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Fetch call history data
  const { data: callHistory, isLoading } = useQuery<EnhancedCallHistory[]>({
    queryKey: ['/api/call-history'],
  });

  // Mocked summary data - In a real app, this would be calculated from the call history data
  const summaryData = {
    totalCalls: 1702,
    averageDuration: "2m 35s",
    completionRate: "78%"
  };

  // Placeholder data for demo purposes - until we can get real data from the API
  const demoCallHistory: EnhancedCallHistory[] = [
    { 
      id: 1, 
      campaignId: 1, 
      contactName: "John Smith", 
      contactEmail: "john.smith@example.com",
      contactPhone: "+1 555-123-4567",
      status: "Completed", 
      callDate: new Date(2023, 7, 12, 13, 32), 
      callSummary: "Customer is interested in the property but has concerns about the pricing. Follow-up scheduled for next week.",
      recordingUrl: null,
      transcriptUrl: null,
      campaignName: "Construction Campaign",
      duration: "2m 45s", 
      transcript: "Agent: Hello, I'm calling from Construction Realty about your interest in our new development.\nJohn: Yes, I've been looking at your website.\nAgent: Great! Would you like to schedule a visit?\nJohn: I'm concerned about the pricing. Can you tell me more?\nAgent: Of course, our units start at $350,000 with financing options available.\nJohn: I'd like to think about it. Can we follow up next week?\nAgent: Absolutely! I'll call you again on Tuesday. Thank you for your time."
    },
    { 
      id: 2, 
      campaignId: 2, 
      contactName: "Jane Doe", 
      contactEmail: "jane.doe@example.com",
      contactPhone: "+1 555-987-6543",
      status: "Completed", 
      callDate: new Date(2023, 7, 12, 14, 5), 
      callSummary: "Customer scheduled a site visit for Saturday at 2pm.",
      recordingUrl: null,
      transcriptUrl: null,
      campaignName: "Urban Nest Site Visit Drive",
      duration: "1m 15s", 
      transcript: "Agent: Hello, I'm calling from Urban Nest about your property inquiry.\nJane: Yes, I'm interested in seeing the model unit.\nAgent: We'd be happy to arrange that. When would you like to visit?\nJane: How about this Saturday?\nAgent: Perfect, I can schedule you for Saturday at 2pm.\nJane: That works for me.\nAgent: Great! We'll see you then."
    },
    { 
      id: 3, 
      campaignId: 1, 
      contactName: "Michael Brown", 
      contactEmail: "michael.brown@example.com",
      contactPhone: "+1 555-456-7890",
      status: "No Answer", 
      callDate: new Date(2023, 7, 12, 14, 30), 
      callSummary: "No answer after 3 attempts. Left voicemail with callback information.",
      recordingUrl: null,
      transcriptUrl: null,
      campaignName: "Construction Campaign",
      duration: "3m 10s", 
      transcript: "Call attempt 1: No answer\nCall attempt 2: No answer\nCall attempt 3: No answer\nVoicemail: Hello Michael, this is Construction Realty calling about your property inquiry. Please call us back at 555-123-0000 at your convenience. Thank you."
    },
    { 
      id: 4, 
      campaignId: 3, 
      contactName: "Sarah Wilson", 
      contactEmail: "sarah.wilson@example.com",
      contactPhone: "+1 555-789-0123",
      status: "Completed", 
      callDate: new Date(2023, 7, 12, 15, 15), 
      callSummary: "Customer is very interested and requested additional information about financing options.",
      recordingUrl: null,
      transcriptUrl: null,
      campaignName: "The Pinnacle Residency Tour",
      duration: "4m 22s", 
      transcript: "Agent: Hello Sarah, I'm calling from Pinnacle Residences regarding your inquiry.\nSarah: Hi there, yes, I'm very interested in your properties.\nAgent: That's wonderful! Would you like to discuss specific units?\nSarah: Yes, but I'm also curious about the financing options.\nAgent: We offer several financing plans. I can email you detailed information.\nSarah: That would be perfect.\nAgent: Great! I'll send that right over to your email. Is there anything else I can help with?\nSarah: That's all for now, thank you.\nAgent: Thank you for your interest. You'll receive the email shortly."
    },
    { 
      id: 5, 
      campaignId: 1, 
      contactName: "David Johnson", 
      contactEmail: "david.johnson@example.com",
      contactPhone: "+1 555-234-5678",
      status: "Declined", 
      callDate: new Date(2023, 7, 12, 16, 0), 
      callSummary: "Customer is not interested at this time. Requested to be removed from call list.",
      recordingUrl: null,
      transcriptUrl: null,
      campaignName: "Construction Campaign",
      duration: "0m 45s", 
      transcript: "Agent: Hello, I'm calling from Construction Realty about our new development.\nDavid: I'm not interested in buying property at this time.\nAgent: I understand. Would you like me to call back at a later date?\nDavid: No, please remove me from your call list.\nAgent: Of course, I'll take care of that right away. Thank you for your time."
    },
  ];

  const dataToDisplay = (callHistory && callHistory.length > 0) ? callHistory : demoCallHistory;

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleExport = (id: number) => {
    // In a real application, this would download the call data
    console.log(`Exporting call data for ID: ${id}`);
    alert("Call data export initiated. The file will download shortly.");
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      "Hot Leads": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Lead Interested": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
      "Not Connected": "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
      "Not Interested": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Follow Up": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "Pending": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    };

    return (
      <Badge className={`rounded-md font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </Badge>
    );
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";

    const dateObj = date instanceof Date ? date : new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString().substring(2);
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  const getTimeSince = (date: Date | string | null) => {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    return formatDistanceToNow(dateObj, { addSuffix: true });
  };

  return (
    <div>
      <PageHeader title="Call History" showSearch />

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-zinc-200 dark:bg-zinc-800 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{summaryData.totalCalls}</div>
                <Phone className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-200 dark:bg-zinc-800 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{summaryData.averageDuration}</div>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-200 dark:bg-zinc-800 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{summaryData.completionRate}</div>
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-200 dark:bg-zinc-800 border-none shadow-sm">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Recent Calls</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              // Loading skeleton
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {dataToDisplay.map((call) => (
                  <Collapsible 
                    key={call.id} 
                    open={expandedId === call.id}
                    onOpenChange={() => toggleExpand(call.id)}
                    className="border rounded-md overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{call.contactName}</div>
                          <div className="text-sm text-muted-foreground">{call.campaignName}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(call.status)}
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {expandedId === call.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <Separator />
                      <div className="p-4 bg-muted/30">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm font-medium mb-1 flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" /> Date/Time
                            </div>
                            <div className="text-sm">
                              {formatDate(call.callDate)} ({getTimeSince(call.callDate)})
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" /> Duration
                            </div>
                            <div className="text-sm">{call.duration || "N/A"}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1 flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" /> Email
                            </div>
                            <div className="text-sm">{call.contactEmail}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1 flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5" /> Phone
                            </div>
                            <div className="text-sm">{call.contactPhone}</div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-sm font-medium mb-1">Call Summary</div>
                          <div className="text-sm bg-background p-3 rounded-md border">
                            {call.callSummary || "No summary available"}
                          </div>
                        </div>

                        {call.transcript && (
                          <div className="mb-4">
                            <div className="text-sm font-medium mb-1 flex items-center gap-1">
                              <Headset className="h-3.5 w-3.5" /> Transcript
                            </div>
                            <div className="text-sm bg-background p-3 rounded-md border whitespace-pre-line">
                              {call.transcript}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => handleExport(call.id)}
                          >
                            <DownloadCloud className="h-4 w-4" /> Export
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CallHistory;