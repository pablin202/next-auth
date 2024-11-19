"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { activateTwoFactorAuth, deactivateTwoFactorAuth, getTwoFactorAuth } from "./actions";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode.react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type Props = {
  twoFactorEnabled: boolean;
}

export function TwoFactorAuthForm({ twoFactorEnabled }: Props) {

  const { toast } = useToast();
  const [enabled, setEnabled] = React.useState(twoFactorEnabled);
  const [step, setStep] = React.useState(1);
  const [code, setCode] = React.useState("");
  const [otp, setOtp] = React.useState("");

  const handleEnableClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const response = await getTwoFactorAuth();

    if (response.error) {
      toast({
        variant: "destructive",
        title: response.message,
      });
      return;
    }

    setCode(response.twoFactorSecret ?? '');
    setStep(2);
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Activate two-factor authentication
    const response = await activateTwoFactorAuth(otp);

    if (response?.error) {
      toast({
        variant: "destructive",
        title: response.message,
      });
      return;
    }

    toast({
      className: "bg-green-500 text-white",
      variant: "default",
      title: "Two-Factor Authentication enabled",
    });

    setEnabled(true);
    setStep(1);
  }

  const handleDisableClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    // Deactivate two-factor authentication
    const response = await deactivateTwoFactorAuth();

    if (response?.error) {
      toast({
        variant: "destructive",
        title: response.message,
      });
      return;
    }

    setEnabled(false);
    setStep(1);

    toast({
      className: "bg-green-500 text-white",
      variant: "default",
      title: "Two-Factor Authentication disabled",
    });

  }

  return <div>
    {!enabled && <div>
      {step === 1 &&
        <Button onClick={handleEnableClick}>Enable Two-Factor Authentication</Button>
      }
      {step === 2 && <div >
        <p className="text-xs text-muted-foreground my-2 py-2">
          Scan the QR code below with your Google Authenticator app
        </p>
        <QRCode size={200} value={code} />
        <Button onClick={() => setStep(3)} className="w-full my-2">I have scanned the QR code</Button>
        <Button onClick={() => setStep(1)} className="w-full my-2" variant="outline">Cancel</Button>
      </div>
      }
      {step === 3 && <form className="flex flex-col gap-2" onSubmit={onSubmit}>
        <p className="text-xs text-muted-foreground my-2 py-2">
          Enter the code from your Google Authenticator app
        </p>
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button type="submit" disabled={otp.length !== 6}
          className="w-full my-2">Submit and activate
        </Button>
        <Button onClick={() => setStep(2)}
          className="w-full my-2"
          variant="outline">Cancel
        </Button>
      </form>}
    </div>
    }

    {enabled && <Button variant="destructive" onClick={handleDisableClick}>Disable Two-Factor Authentication</Button>}
  </div>
}
