import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser, type User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User as UserIcon, Shield, Bell, Eye, EyeOff, KeyRound } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/page-layout";

export default function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    transactions: true,
    marketing: false,
    security: true,
    statements: true,
  });

  // Get user data and setup
  const { data: me } = useQuery<User | null>({ queryKey: ["/api/auth/me"], queryFn: getQueryFn({ on401: "returnNull" }) });
  const userId = me?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await apiRequest("PATCH", `/api/users/${userId}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Profile updated successfully" });
      // Refetch user data to update the form
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (e: any) => {
      toast({ title: "Failed", description: e?.message || "Could not update profile", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertUser) => {
    if (!userId) return;
    // Remove password if empty to avoid updating it
    const { password, ...updateData } = data;
    const payload = password ? data : updateData;
    updateProfile.mutate(payload as InsertUser);
  };

  // Populate form with user data when loaded
  useEffect(() => {
    if (me) {
      form.reset({
        username: me.username || "",
        firstName: me.firstName || "",
        lastName: me.lastName || "",
        email: me.email || "",
        phone: me.phone || "",
        password: "", // Don't pre-fill password
      });
    }
  }, [me, form]);
  const pinForm = useForm<{ pin: string; confirm: string }>({ defaultValues: { pin: "", confirm: "" } });
  const savePin = useMutation({
    mutationFn: async (pin: string) => {
      const res = await apiRequest("POST", `/api/users/${userId}/pin`, { pin });
      return res.json();
    },
    onSuccess: () => toast({ title: "Saved", description: "PIN updated successfully" }),
    onError: (e: any) => toast({ title: "Failed", description: e?.message || "Could not update PIN", variant: "destructive" }),
  });
  const onSavePin = (v: { pin: string; confirm: string }) => {
    if (!userId) return;
    if (!v.pin || v.pin.length < 4) return toast({ title: "Invalid PIN", description: "PIN must be at least 4 digits", variant: "destructive" });
    if (v.pin !== v.confirm) return toast({ title: "Mismatch", description: "PINs do not match", variant: "destructive" });
    savePin.mutate(v.pin);
  };

  return (
    <PageLayout>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!me ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500">Loading profile...</div>
                  </div>
                ) : (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          {...form.register("firstName")}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          {...form.register("lastName")}
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...form.register("phone")}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Account ID</Label>
                      <Input
                        id="username"
                        {...form.register("username")}
                        placeholder="Enter username"
                        disabled
                      />
                      <p className="text-xs text-gray-500">Account ID cannot be changed</p>
                    </div>

                    <Button
                      type="submit"
                      className="bg-banking-primary hover:bg-banking-primary-dark"
                      disabled={updateProfile.isPending}
                    >
                      {updateProfile.isPending ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Password & Security
                </CardTitle>
                <CardDescription>
                  Manage your password and security preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button className="bg-banking-primary hover:bg-banking-primary-dark">
                    Update Password
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Authentication</p>
                      <p className="text-sm text-gray-600">Receive codes via SMS to your phone</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center"><KeyRound className="w-4 h-4 mr-2" /> Transaction PIN</h3>
                  <form onSubmit={pinForm.handleSubmit(onSavePin)} className="grid gap-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="pin">New PIN</Label>
                      <Input id="pin" type="password" maxLength={6} {...pinForm.register("pin")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm">Confirm PIN</Label>
                      <Input id="confirm" type="password" maxLength={6} {...pinForm.register("confirm")} />
                    </div>
                    <Button type="submit" className="bg-banking-primary hover:bg-banking-primary-dark" disabled={savePin.isPending}>{savePin.isPending ? "Saving…" : "Save PIN"}</Button>
                  </form>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Login Activity</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-gray-600">Chrome on Windows • Active now</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Current</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Mobile App</p>
                        <p className="text-sm text-gray-600">iPhone • Last seen 2 hours ago</p>
                      </div>
                      <Button variant="outline" size="sm">Revoke</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Transaction Alerts</p>
                      <p className="text-sm text-gray-600">Get notified of account activity</p>
                    </div>
                    <Switch
                      checked={notifications.transactions}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, transactions: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Security Alerts</p>
                      <p className="text-sm text-gray-600">Important security notifications</p>
                    </div>
                    <Switch
                      checked={notifications.security}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, security: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Statement Notifications</p>
                      <p className="text-sm text-gray-600">Monthly statement availability</p>
                    </div>
                    <Switch
                      checked={notifications.statements}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, statements: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Communications</p>
                      <p className="text-sm text-gray-600">Product updates and offers</p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, marketing: checked }))
                      }
                    />
                  </div>
                </div>

                <Button className="bg-banking-primary hover:bg-banking-primary-dark">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </PageLayout>
  );
}