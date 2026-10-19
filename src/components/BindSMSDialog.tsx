import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, Alert } from "@mui/material";
import { useLoginWithSms } from "@privy-io/react-auth";

interface BindSMSDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function BindSMSDialog({ open, onClose }: BindSMSDialogProps) {
  const { sendCode, loginWithCode } = useLoginWithSms();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const canResend = useMemo(() => countdown <= 0, [countdown]);

  useEffect(() => {
    if (!open) return;
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [countdown, open]);

  useEffect(() => {
    if (!open) {
      setPhoneNumber("");
      setCode("");
      setIsSending(false);
      setIsVerifying(false);
      setCountdown(0);
      setError(null);
    }
  }, [open]);

  const handleSendCode = async () => {
    setError(null);
    setIsSending(true);
    try {
      await sendCode({ phoneNumber });
      setCountdown(60);
    } catch (e: any) {
      setError(e?.message || "发送验证码失败");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    setError(null);
    setIsVerifying(true);
    try {
      await loginWithCode({ code });
      onClose();
    } catch (e: any) {
      setError(e?.message || "验证失败，请重试");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>绑定手机号</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="手机号" placeholder="请输入手机号" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} fullWidth />
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField label="验证码" placeholder="6位验证码" value={code} onChange={(e) => setCode(e.target.value)} fullWidth />
            <Button onClick={handleSendCode} disabled={!phoneNumber || isSending || !canResend} variant="outlined">
              {isSending ? "发送中" : canResend ? "发送" : `${countdown}s`}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleVerify} disabled={!phoneNumber || !code || isVerifying} variant="contained">
          {isVerifying ? "验证中" : "确认绑定"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
