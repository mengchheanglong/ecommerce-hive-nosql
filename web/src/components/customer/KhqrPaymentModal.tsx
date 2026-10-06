"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/shared/Modal";
import { useCurrency } from "@/context/CurrencyContext";
import { ShieldCheck, CheckCircle2, Clock, Sparkles } from "lucide-react";

interface KhqrPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountUSD: number;
  onPaymentSuccess: () => void;
}

export function KhqrPaymentModal({
  isOpen,
  onClose,
  amountUSD,
  onPaymentSuccess,
}: KhqrPaymentModalProps) {
  const { formatPrice, exchangeRate } = useCurrency();
  const [countdown, setCountdown] = useState(180);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && countdown > 0 && !isProcessing) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, countdown, isProcessing]);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1200);
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = (countdown % 60).toString().padStart(2, "0");
  const amountKHR = Math.round(amountUSD * exchangeRate);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bakong KHQR Instant Payment" maxWidth="max-w-md">
      <div className="space-y-4">
        {/* KHQR Card */}
        <div className="bg-[#e02020] rounded-2xl p-4 text-white shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black tracking-widest uppercase">KHQR</span>
              <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold">
                NBC Bakong
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs font-mono font-bold bg-white/20 px-2.5 py-0.5 rounded-lg">
              <Clock className="w-3.5 h-3.5" />
              <span>{minutes}:{seconds}</span>
            </div>
          </div>

          {/* QR Graphic */}
          <div className="bg-white rounded-xl p-4 flex flex-col items-center justify-center space-y-3 text-slate-900 shadow-inner">
            <div className="w-48 h-48 bg-slate-900 rounded-xl p-2.5 flex items-center justify-center relative shadow-md">
              <div className="w-full h-full bg-white rounded-lg p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-9 h-9 bg-slate-900 rounded-sm flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-xs flex items-center justify-center">
                      <div className="w-2 h-2 bg-slate-900" />
                    </div>
                  </div>
                  <div className="w-9 h-9 bg-slate-900 rounded-sm flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-xs flex items-center justify-center">
                      <div className="w-2 h-2 bg-slate-900" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center py-2">
                  <div className="w-8 h-8 rounded-full bg-[#e02020] text-white flex items-center justify-center text-xs font-black shadow-sm ring-2 ring-white">
                    ៛
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="w-9 h-9 bg-slate-900 rounded-sm flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-xs flex items-center justify-center">
                      <div className="w-2 h-2 bg-slate-900" />
                    </div>
                  </div>
                  <div className="w-9 h-9 grid grid-cols-2 gap-1 p-1">
                    <div className="bg-slate-900 rounded-2xs" />
                    <div className="bg-slate-900 rounded-2xs" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-0.5">
              <p className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">
                KHMERCART MARKETPLACE
              </p>
              <p className="text-xl font-black text-slate-900 font-mono">
                {formatPrice(amountUSD)}
              </p>
              <p className="text-[11px] text-slate-500">
                ៛{amountKHR.toLocaleString()} KHR
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Scan with ABA Mobile, Wing Bank, ACLEDA, or any Bakong-enabled banking app.
        </p>

        <button
          onClick={handleSimulatePayment}
          disabled={isProcessing}
          className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying Bakong Settlement...</span>
            </span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Simulate Bank App Scan & Payment</span>
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}
