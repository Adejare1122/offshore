import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Phone, Mail, MessageCircle, Clock, MapPin, HeadphonesIcon, FileText, Shield, DollarSign, CreditCard } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Support() {
  const [activeChat, setActiveChat] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      subject: "",
      category: "",
      priority: "",
      message: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Support ticket:", data);
    toast({
      title: "Support Ticket Submitted",
      description: "We'll get back to you within 24 hours.",
    });
    form.reset();
  };

  const faqCategories = [
    {
      title: "Account Management",
      icon: Shield,
      faqs: [
        { q: "How do I reset my password?", a: "You can reset your password by clicking 'Forgot Password' on the login page." },
        { q: "How do I update my contact information?", a: "Go to Profile Settings and update your details in the Personal Information section." },
        { q: "How do I close my account?", a: "Contact our support team to initiate the account closure process." },
      ]
    },
    {
      title: "Transactions",
      icon: DollarSign,
      faqs: [
        { q: "How long do transfers take?", a: "Internal transfers are instant. External transfers take 1-3 business days." },
        { q: "What are the transfer limits?", a: "Daily transfer limit is $50,000. Monthly limit is $250,000." },
        { q: "How do I dispute a transaction?", a: "Use the dispute form in your transaction history or contact support." },
      ]
    },
    {
      title: "Cards & Payments",
      icon: CreditCard,
      faqs: [
        { q: "How do I report a lost card?", a: "Call our 24/7 hotline immediately or use the card freeze feature in the app." },
        { q: "How do I increase my credit limit?", a: "Submit a credit limit increase request through your card settings." },
        { q: "What should I do if my card is declined?", a: "Check your balance, verify the merchant accepts your card type, or contact us." },
      ]
    },
  ];

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
          <h1 className="text-xl font-semibold text-white">Support Center</h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="status">Service Status</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* Contact Us Tab */}
          <TabsContent value="contact" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Methods */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Get In Touch</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Phone Support */}
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-banking-primary rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Phone Support</h3>
                        <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">24/7 Available</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Live
                      </Badge>
                    </div>

                    {/* Email Support */}
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-banking-primary rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Email Support</h3>
                        <p className="text-sm text-gray-600">support@italianoffshore.com</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">Response within 2 hours</span>
                        </div>
                      </div>
                    </div>

                    {/* Live Chat */}
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-banking-primary rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Live Chat</h3>
                        <p className="text-sm text-gray-600">Chat with our support team</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">Mon-Fri, 8 AM - 8 PM</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setActiveChat(!activeChat)}
                        className="bg-banking-primary hover:bg-banking-primary-dark"
                      >
                        {activeChat ? "End Chat" : "Start Chat"}
                      </Button>
                    </div>

                    {/* Branch Location */}
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-banking-primary rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Branch Location</h3>
                        <p className="text-sm text-gray-600">123 Banking Street, Milan, Italy</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">Mon-Fri, 9 AM - 5 PM</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Support Ticket Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Support Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...form.register("email")}
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input
                          id="phone"
                          {...form.register("phone")}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={(value) => form.setValue("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account">Account Issues</SelectItem>
                          <SelectItem value="transactions">Transaction Problems</SelectItem>
                          <SelectItem value="cards">Card Related</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select onValueChange={(value) => form.setValue("priority", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        {...form.register("subject")}
                        placeholder="Brief description of your issue"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        {...form.register("message")}
                        placeholder="Please provide detailed information about your issue..."
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-banking-primary hover:bg-banking-primary-dark">
                      Submit Ticket
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="mt-6">
            <div className="space-y-6">
              {faqCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <category.icon className="w-5 h-5 mr-2" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.faqs.map((faq, faqIndex) => (
                        <div key={faqIndex} className="border-b border-gray-200 pb-4">
                          <h4 className="font-semibold mb-2">{faq.q}</h4>
                          <p className="text-gray-600">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Service Status Tab */}
          <TabsContent value="status" className="mt-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Service Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { service: "Online Banking", status: "operational" },
                      { service: "Mobile App", status: "operational" },
                      { service: "Card Payments", status: "operational" },
                      { service: "Wire Transfers", status: "maintenance" },
                      { service: "Customer Support", status: "operational" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{item.service}</span>
                        <Badge 
                          variant={item.status === "operational" ? "secondary" : "destructive"}
                          className={item.status === "operational" ? "bg-green-100 text-green-800" : 
                                    item.status === "maintenance" ? "bg-yellow-100 text-yellow-800" : ""}
                        >
                          {item.status === "operational" ? "Operational" : 
                           item.status === "maintenance" ? "Maintenance" : "Disrupted"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label>How would you rate our service?</Label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button key={rating} variant="outline" size="sm">
                          ⭐ {rating}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Your Feedback</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Tell us about your experience..."
                      rows={4}
                    />
                  </div>

                  <Button className="bg-banking-primary hover:bg-banking-primary-dark">
                    Submit Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}