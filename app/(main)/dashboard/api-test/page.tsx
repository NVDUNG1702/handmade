"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import * as authExtended from "@/lib/auth-extended";
import { OtpType } from "@/lib/auth-extended";

export default function ApiTestPage() {
  const [email, setEmail] = useState("test@example.com");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("newpassword123");
  const [confirmPassword, setConfirmPassword] = useState("newpassword123");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const addResult = (step: string, success: boolean, data: any) => {
    const result = {
      step,
      success,
      data,
      timestamp: new Date().toLocaleTimeString(),
    };
    setResults(prev => [result, ...prev]);
  };

  const testForgotPassword = async () => {
    setLoading(true);
    try {
      const result = await authExtended.forgotPasswordExecute({
        email,
        type: OtpType.FORGOT_PASSWORD,
      });
      addResult("Forgot Password", true, result);
      toast.success("✅ Forgot Password API thành công!");
    } catch (error: any) {
      addResult("Forgot Password", false, error?.response?.data || error);
      toast.error("❌ Forgot Password API thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const testVerifyOtp = async () => {
    if (!otp) {
      toast.error("Vui lòng nhập OTP");
      return;
    }
    
    setLoading(true);
    try {
      const result = await authExtended.verifyOtpExecute({
        email,
        otp,
        type: OtpType.FORGOT_PASSWORD,
      });
      addResult("Verify OTP", true, result);
      toast.success("✅ Verify OTP API thành công!");
    } catch (error: any) {
      addResult("Verify OTP", false, error?.response?.data || error);
      toast.error("❌ Verify OTP API thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const testResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    
    setLoading(true);
    try {
      const result = await authExtended.resetPasswordExecute({
        email,
        otp,
        newPassword,
        confirmPassword,
      });
      addResult("Reset Password", true, result);
      toast.success("✅ Reset Password API thành công!");
    } catch (error: any) {
      addResult("Reset Password", false, error?.response?.data || error);
      toast.error("❌ Reset Password API thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">API Test Dashboard</h1>
          <p className="text-muted-foreground">
            Test forgot password APIs với backend thực
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Test Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Parameters</CardTitle>
                <CardDescription>
                  Nhập thông tin để test APIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp">OTP (từ email)</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                    maxLength={6}
                    className="text-center tracking-widest"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Actions</CardTitle>
                <CardDescription>
                  Thực hiện từng bước theo thứ tự
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={testForgotPassword}
                  disabled={loading || !email}
                  className="w-full"
                  variant="default"
                >
                  {loading ? "Testing..." : "1. Test Forgot Password"}
                </Button>

                <Button
                  onClick={testVerifyOtp}
                  disabled={loading || !email || !otp}
                  className="w-full"
                  variant="outline"
                >
                  {loading ? "Testing..." : "2. Test Verify OTP"}
                </Button>

                <Button
                  onClick={testResetPassword}
                  disabled={loading || !email || !otp || !newPassword}
                  className="w-full"
                  variant="secondary"
                >
                  {loading ? "Testing..." : "3. Test Reset Password"}
                </Button>

                <Separator />

                <Button
                  onClick={clearResults}
                  variant="ghost"
                  className="w-full"
                >
                  Clear Results
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Test Results
                  <Badge variant="outline">{results.length} tests</Badge>
                </CardTitle>
                <CardDescription>
                  Kết quả API calls theo thời gian thực
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {results.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Chưa có kết quả test nào
                    </p>
                  ) : (
                    results.map((result, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          result.success
                            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                            : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={result.success ? "default" : "destructive"}
                            >
                              {result.success ? "✅ SUCCESS" : "❌ ERROR"}
                            </Badge>
                            <span className="font-medium">{result.step}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {result.timestamp}
                          </span>
                        </div>
                        <pre className="text-xs bg-background/50 p-2 rounded overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* API Info */}
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">1. Forgot Password</h4>
                <p><strong>POST</strong> /auth/forgot-password</p>
                <p><strong>Body:</strong> {`{ email, type: "forgot_password" }`}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">2. Verify OTP</h4>
                <p><strong>POST</strong> /auth/verify-otp</p>
                <p><strong>Body:</strong> {`{ email, otp, type: "forgot_password" }`}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">3. Reset Password</h4>
                <p><strong>POST</strong> /auth/reset-password</p>
                <p><strong>Body:</strong> {`{ email, otp, newPassword, confirmPassword }`}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
