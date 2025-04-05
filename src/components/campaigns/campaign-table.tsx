import { useState } from "react";
import { format } from "date-fns";
import { Edit, Copy, Trash2 } from "lucide-react";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { apiRequest, queryClient } from "../../lib/queryClient";
import type { Campaign } from "../../../../shared/schema";

interface CampaignTableProps {
  campaigns: Campaign[];
  isLoading: boolean;
  onEditCampaign: (campaign: Campaign) => void;
}

const CampaignTable = ({ campaigns, isLoading, onEditCampaign }: CampaignTableProps) => {
  const { toast } = useToast();
  const [pendingStatusChanges, setPendingStatusChanges] = useState<Set<number>>(new Set());
  const [pendingActions, setPendingActions] = useState<Set<number>>(new Set());

  // Handle toggle status
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    setPendingStatusChanges((prev) => new Set(prev).add(id));
    
    try {
      await apiRequest("POST", `/api/campaigns/${id}/toggle`, null);
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Status updated",
        description: `Campaign has been ${currentStatus ? "deactivated" : "activated"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign status",
        variant: "destructive",
      });
    } finally {
      setPendingStatusChanges((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Handle duplicate campaign
  const handleDuplicate = async (id: number) => {
    setPendingActions((prev) => new Set(prev).add(id));
    
    try {
      await apiRequest("POST", `/api/campaigns/${id}/duplicate`, null);
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign duplicated",
        description: "A copy of the campaign has been created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate campaign",
        variant: "destructive",
      });
    } finally {
      setPendingActions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Handle delete campaign
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this campaign?")) {
      return;
    }
    
    setPendingActions((prev) => new Set(prev).add(id));
    
    try {
      await apiRequest("DELETE", `/api/campaigns/${id}`, null);
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign deleted",
        description: "The campaign has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    } finally {
      setPendingActions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading campaigns...</div>;
  }

  if (campaigns.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No campaigns found</div>;
  }

  return (
    <div className="bg-muted rounded-xl overflow-hidden border border-border">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-border text-sm font-medium text-muted-foreground">
        <div className="col-span-1">Status</div>
        <div className="col-span-4">Name</div>
        <div className="col-span-2">Number Of Calls</div>
        <div className="col-span-3">Published Time</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      
      {/* Table Body */}
      <div className="divide-y divide-border">
        {campaigns.map((campaign) => (
          <div 
            key={campaign.id} 
            className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 md:gap-4 px-4 sm:px-5 md:px-6 py-3 md:py-4 items-start sm:items-center hover:bg-accent/5 transition-colors"
          >
            <div className="flex items-center justify-between w-full md:w-auto md:col-span-1">
              <span className="md:hidden font-medium">Status</span>
              <Switch
                disabled={pendingStatusChanges.has(campaign.id)}
                // onCheckedChange={() => handleToggleStatus(campaign.id, campaign.status)}
              />
            </div>
            <div className="flex items-center justify-between w-full md:w-auto md:col-span-4">
              <span className="md:hidden font-medium">Name</span>
              <span className="font-medium">{campaign.name}</span>
            </div>
            <div className="flex items-center justify-between w-full md:w-auto md:col-span-2">
              <span className="md:hidden font-medium">Number of Calls</span>
              <span>{campaign.maxCallCount}</span>
            </div>
            <div className="flex items-center justify-between w-full md:w-auto md:col-span-3">
              <span className="md:hidden font-medium">Published Time</span>
              <span className="text-muted-foreground">
                {/* {format(new Date(campaign.publishedAt), "MM/dd/yy - HH:mma")} */}
              </span>
            </div>
            <div className="flex md:col-span-2 justify-end space-x-2 w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEditCampaign(campaign)}
                disabled={pendingActions.has(campaign.id)}
              >
                <Edit className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDuplicate(campaign.id)}
                disabled={pendingActions.has(campaign.id)}
              >
                <Copy className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(campaign.id)}
                disabled={pendingActions.has(campaign.id)}
                className="hover:text-destructive"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignTable;
