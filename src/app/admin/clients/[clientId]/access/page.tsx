"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Link2, Copy, RefreshCw, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function AccessPage() {
  const params = useParams();
  const clientId = params.clientId as string;

  const [link, setLink] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<{ created_at: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRotateConfirm, setShowRotateConfirm] = useState(false);

  const fetchTokenStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/tokens/${clientId}`);
      const data = await res.json();
      setTokenInfo(data.data?.activeToken || null);
    } catch {
      // No active token
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchTokenStatus();
  }, [fetchTokenStatus]);

  async function generateToken(rotate = false) {
    setGenerating(true);
    try {
      const res = await fetch(`/api/admin/tokens/${clientId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rotate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setLink(data.data.link);
      setTokenInfo({ created_at: new Date().toISOString() });
      setShowRotateConfirm(false);
      toast.success(rotate ? "Token rotated!" : "Access link generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate token");
    } finally {
      setGenerating(false);
    }
  }

  function copyLink() {
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900">Client Access Link</h1>
      <p className="mt-1 text-sm text-surface-500">
        Generate a secure link for your client to view their media portal.
      </p>

      <div className="mt-6 max-w-xl space-y-6">
        {/* Current Token Status */}
        <div className="card">
          <div className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${
                tokenInfo ? "bg-green-400" : "bg-surface-300"
              }`}
            />
            <p className="text-sm font-medium text-surface-900">
              {tokenInfo ? "Active link exists" : "No active link"}
            </p>
            {tokenInfo && (
              <span className="text-xs text-surface-400">
                · Created{" "}
                {new Date(tokenInfo.created_at).toLocaleDateString()}
              </span>
            )}
          </div>

          {!tokenInfo && (
            <button
              onClick={() => generateToken(false)}
              disabled={generating}
              className="btn-primary mt-4"
            >
              <Link2 className="mr-2 h-4 w-4" />
              {generating ? "Generating..." : "Generate Access Link"}
            </button>
          )}
        </div>

        {/* Generated Link Display */}
        {link && (
          <div className="card bg-green-50 border-green-200">
            <p className="text-sm font-medium text-green-800 mb-2">
              Access link generated! Copy it and send to your client:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={link}
                className="input-field flex-1 bg-white text-xs font-mono"
              />
              <button onClick={copyLink} className="btn-secondary shrink-0">
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-green-600">
              This is the only time the full link will be shown. Save it now.
            </p>
          </div>
        )}

        {/* Rotate Token */}
        {tokenInfo && (
          <div className="card border-amber-200 bg-amber-50">
            <h3 className="text-sm font-medium text-amber-800">
              Rotate Access Token
            </h3>
            <p className="mt-1 text-xs text-amber-600">
              This will invalidate the current link and generate a new one.
              Your client will need the new link to access their portal.
            </p>

            {!showRotateConfirm ? (
              <button
                onClick={() => setShowRotateConfirm(true)}
                className="btn-secondary mt-3 text-amber-700 border-amber-300 hover:bg-amber-100"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Rotate Token
              </button>
            ) : (
              <div className="mt-3 flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span className="text-xs text-amber-700">Are you sure?</span>
                <button
                  onClick={() => generateToken(true)}
                  disabled={generating}
                  className="btn-danger text-xs"
                >
                  {generating ? "Rotating..." : "Yes, Rotate"}
                </button>
                <button
                  onClick={() => setShowRotateConfirm(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
