import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Notification } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bell, CreditCard, DollarSign, Shield, CheckCircle, Clock, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const MOCK_USER_ID = "user-1";

export default function Notifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications", MOCK_USER_ID],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await apiRequest("PATCH", `/api/notifications/${notificationId}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications", MOCK_USER_ID] });
      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await apiRequest("DELETE", `/api/notifications/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications", MOCK_USER_ID] });
      toast({
        title: "Success",
        description: "Notification deleted",
      });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "TRANSACTION":
        return <DollarSign className="w-5 h-5" />;
      case "SECURITY":
        return <Shield className="w-5 h-5" />;
      case "PAYMENT":
        return <CreditCard className="w-5 h-5" />;
      case "ACCOUNT":
        return <Bell className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "TRANSACTION":
        return "bg-green-100 text-green-600";
      case "SECURITY":
        return "bg-red-100 text-red-600";
      case "PAYMENT":
        return "bg-blue-100 text-blue-600";
      case "ACCOUNT":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const unreadCount = notifications.filter(n => n.isRead === 'false').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter bg-white min-h-screen">
      {/* Header */}
      <header className="bg-banking-primary px-4 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-white text-banking-primary">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">No notifications</p>
                <p className="text-sm text-gray-500">
                  You're all caught up! We'll notify you when there's something new.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className={`transition-all ${notification.isRead === 'false' ? 'ring-2 ring-banking-primary/20' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{notification.title}</h3>
                          {notification.isRead === 'false' && (
                            <Badge variant="secondary" className="bg-banking-primary text-white text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {notification.isRead === 'false' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                          disabled={markAsReadMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Read
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteNotificationMutation.mutate(notification.id)}
                        disabled={deleteNotificationMutation.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Mark All as Read */}
            {unreadCount > 0 && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="pt-6">
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">
                      You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                    <Button 
                      onClick={() => {
                        notifications
                          .filter(n => n.isRead === 'false')
                          .forEach(n => markAsReadMutation.mutate(n.id));
                      }}
                      className="bg-banking-primary hover:bg-banking-primary-dark"
                      disabled={markAsReadMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark All as Read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}