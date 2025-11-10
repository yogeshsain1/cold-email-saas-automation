"use client"

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const campaignId = searchParams.get('campaign');
  const email = searchParams.get('email');

  useEffect(() => {
    async function handleUnsubscribe() {
      if (!campaignId || !email) {
        setStatus('error');
        setMessage('Invalid unsubscribe link');
        return;
      }

      try {
        const response = await fetch('/api/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ campaignId, email }),
        });

        if (response.ok) {
          setStatus('success');
          setMessage('You have been successfully unsubscribed');
        } else {
          setStatus('error');
          setMessage('Failed to unsubscribe. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred. Please try again later.');
      }
    }

    handleUnsubscribe();
  }, [campaignId, email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8 shadow-2xl text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold mb-2">Processing...</h1>
              <p className="text-muted-foreground">
                Please wait while we unsubscribe you
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-2">Successfully Unsubscribed</h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              <p className="text-sm text-muted-foreground mb-6">
                You will no longer receive emails from this campaign. We're sorry to see you go!
              </p>
              <Button asChild className="w-full">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Homepage
                </Link>
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4"
              >
                <Mail className="w-8 h-8 text-red-600 dark:text-red-400" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-2">Unsubscribe Failed</h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              <p className="text-sm text-muted-foreground mb-6">
                If you continue to have issues, please contact our support team.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Homepage
                </Link>
              </Button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          This action is permanent and cannot be undone.
        </p>
      </motion.div>
    </div>
  );
}
