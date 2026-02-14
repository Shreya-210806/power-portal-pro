import { useState, useEffect, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, CheckCircle2 } from "lucide-react";

interface CaptchaCheckboxProps {
  onVerified: (verified: boolean) => void;
}

const CaptchaCheckbox = ({ onVerified }: CaptchaCheckboxProps) => {
  const [checked, setChecked] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleCheck = useCallback(() => {
    if (verified) return;
    setChecked(true);
    setVerifying(true);
    // Simulate verification delay
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      onVerified(true);
    }, 1200);
  }, [verified, onVerified]);

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
      {verified ? (
        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
      ) : verifying ? (
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        <Checkbox
          checked={checked}
          onCheckedChange={() => handleCheck()}
          className="shrink-0"
        />
      )}
      <span className="text-sm font-medium">
        {verified ? "Verified — you're human!" : verifying ? "Verifying..." : "I'm not a robot"}
      </span>
      <Shield className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
    </div>
  );
};

export default CaptchaCheckbox;
