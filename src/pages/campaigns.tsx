import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import PageHeader from "../components/layout/page-header";
import CampaignTable from "../components/campaigns/campaign-table";
import CampaignForm from "../components/campaigns/campaign-form";
import { Button } from "../components/ui/button";
import type { Campaign } from "../../../shared/schema";

const Campaigns = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | undefined>(undefined);
  const [_, setLocation] = useLocation();

  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const handleEditCampaign = (campaign: Campaign) => {
    // Redirect to campaign-create with the campaign ID to edit
    setLocation(`/campaign-create?id=${campaign.id}`);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCampaignToEdit(undefined);
  };

  return (
    <div>
      <PageHeader title="Voice Campaigns" showSearch />
      
      {/* Campaign Setup Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 relative overflow-hidden">
        {/* Content */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold mb-2">Setup your</h2>
          <h3 className="text-2xl sm:text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">Voice Campaign</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 lg:mb-8 px-2 sm:px-4">
            Setup voice campaigns that enable AI to speak on your behalf increasing your productivity by four folds.
          </p>
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => {
              setLocation("/campaign-create");
            }}
          >
            Create New Campaign
          </Button>
        </div>
      </section>
      
      {/* Campaign Listing Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 lg:pb-12">
        <CampaignTable 
          campaigns={campaigns || []} 
          isLoading={isLoading}
          onEditCampaign={handleEditCampaign}
        />
      </section>

      {/* Campaign Form Dialog */}
      <CampaignForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        campaignToEdit={campaignToEdit}
      />
    </div>
  );
};

export default Campaigns;
