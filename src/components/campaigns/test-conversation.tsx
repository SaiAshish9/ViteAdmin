
import React from 'react';
import { Button } from "../ui/button";

interface TestConversationProps {
  onStartCall: () => void;
  isCallActive: boolean;
}

const TestConversation: React.FC<TestConversationProps> = ({
  onStartCall,
  isCallActive,
}) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-muted/30 rounded-lg">
      <Button
        size="lg"
        className="mb-2"
        onClick={onStartCall}
      >
        Start Call
      </Button>
      <p className="text-sm text-muted-foreground">
        Click to test your voice agent with the current configuration
      </p>
    </div>
  );
};

export default TestConversation;
