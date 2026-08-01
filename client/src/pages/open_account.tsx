import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Country, State, User } from "@shared/schema";
import PageLayout from "@/components/page-layout";
import { readNavData } from "@/lib/nav";
import { getQueryFn } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FrontHeader from "@/components/front-header";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
const accountCurrencies = [
    { value: "$", label: "US Dollar" },
    { value: "€", label: "Euro" },
    { value: "£", label: "Pounds Sterling" },
    { value: "RM", label: "Malaysian Ringgit - RM" },
    { value: "SGD$", label: "Singapore Dollar" },
    { value: "₹", label: "Indian Rupee" },
    { value: "Rp", label: "Indonesian Rupiah" },
    { value: "AUD$", label: "Australian Dollar" },
    { value: "CAD$", label: "Canadian Dollar" },
    { value: "₣", label: "CFP Franc" },
    { value: "¥", label: "Japanese Yen" },
    { value: "¥", label: "Chinese Yen" },
    { value: "ا.د", label: "Jordanian Dinar" },
    { value: "ك.د", label: "Kuwaiti Dinar" },
    { value: "MXN$", label: "Mexican Peso" },
    { value: ".ع.ر", label: "Omani Rial" },
    { value: "₱", label: "Philippine Peso" },
    { value: "ق.ر", label: "Qatari Rial" },
    { value: " ﷼", label: "Saudi Riyal" },
    { value: "₩", label: "South Korean Won" },
    { value: "฿", label: "Thailand Baht" },
    { value: "₫", label: "Vietnam Dong" },
];
import { Textarea } from "@/components/ui/textarea";

const OpenAccountSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email required"),
    phone: z.string().min(6, "Phone is required"),
    dob: z.date({
        required_error: "A date of birth is required.",
    }),
    gender: z.enum(["male", "female", "other"]).optional(),
    ssn: z.string().optional(),
    occupation: z.string().optional(),
    countryId: z.string().optional(),
    cityId: z.string().optional(),
    zip: z.string().optional(),
    address: z.string().optional(),
    nokName: z.string().optional(),
    nokEmail: z.string().email().optional().or(z.literal("")),
    nokPhone: z.string().optional(),
    nokRelationship: z.string().optional(),
    nokAddress: z.string().optional(),
    currency: z.string().optional(),
    password: z.string().min(6, "Min 6 characters"),
    password2: z.string().min(6, "Min 6 characters"),
    pin: z.string().min(4, "Min 4 digits"),
}).refine((vals) => vals.password === vals.password2, {
    message: "Passwords do not match",
    path: ["password2"],
});

export default function OpenAccount() {

    const { data: countries = [] } = useQuery<Country[]>({
        queryKey: ["/api/countries"],
    });

    const qp = (() => {
        try {
            const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : "");
            return Object.fromEntries(params.entries());
        } catch {
            return {} as Record<string, string>;
        }
    })();
    const formData = { ...qp } as any;

    const selectedCountryId = formData.countryId ? Number(formData.countryId) : undefined;

    const form = useForm<z.infer<typeof OpenAccountSchema>>({
        resolver: zodResolver(OpenAccountSchema),
        defaultValues: {
            name: String(formData.name || "").trim(),
            email: String(formData.email || "").trim(),
            phone: "",
            dob: new Date(),
            gender: undefined,
            ssn: "",
            occupation: "",
            countryId: String(selectedCountryId ?? ""),
            cityId: "",
            zip: "",
            address: "",
            nokName: "",
            nokEmail: "",
            nokPhone: "",
            nokRelationship: "",
            nokAddress: "",
            currency: "",
            password: "",
            password2: "",
            pin: "",
        },
    });

    const liveCountryId = Number(form.watch("countryId") || "") || undefined;
    const { data: cities = [] } = useQuery<State[]>({
        queryKey: [liveCountryId ? `/api/countries/${liveCountryId}/cities` : ""],
        enabled: !!liveCountryId,
    });

    const { toast } = useToast();

    const onSubmit = async (values: z.infer<typeof OpenAccountSchema>) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("phone", values.phone || "");
        formData.append("dob", values.dob ? values.dob.toISOString().slice(0, 10) : "");
        if (values.gender) formData.append("gender", values.gender);
        if (values.ssn) formData.append("ssn", values.ssn);
        if (values.occupation) formData.append("occupation", values.occupation);
        if (values.countryId) formData.append("countryId", values.countryId);
        if (values.cityId) formData.append("cityId", values.cityId);
        if (values.zip) formData.append("zip", values.zip);
        if (values.address) formData.append("address", values.address);
        if (values.nokName) formData.append("nokName", values.nokName);
        if (values.nokEmail) formData.append("nokEmail", values.nokEmail);
        if (values.nokPhone) formData.append("nokPhone", values.nokPhone);
        if (values.nokRelationship) formData.append("nokRelationship", values.nokRelationship);
        if (values.nokAddress) formData.append("nokAddress", values.nokAddress);
        if (values.currency) formData.append("currency", values.currency);
        formData.append("password", values.password);
        formData.append("pin", values.pin);
        const passportInput = document.getElementById("passport-upload") as HTMLInputElement | null;
        const idInput = document.getElementById("id-upload") as HTMLInputElement | null;
        if (passportInput?.files?.[0]) formData.append("passport", passportInput.files[0]);
        if (idInput?.files?.[0]) formData.append("idDocument", idInput.files[0]);

        const res = await fetch("/api/applications", {
            method: "POST",
            credentials: "include",
            body: formData,
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Application failed");
        }
        // Prime auth cache and toast success
        try {
            const meRes = await fetch("/api/auth/me", { credentials: "include" });
            if (meRes.ok) {
                const me = await meRes.json();
                queryClient.setQueryData(["/api/auth/me"], me);
            }
        } catch { }
        toast({ title: "Success", description: "Your account has been created." });
        setTimeout(() => { window.location.href = "/dashboard"; }, 800);
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 relative">
            <header className="bg-primary flex justify-center text-center h-16 py-4 pb-20 sticky top-0">
                <img src="/assets/images/logo.png" alt="Logo" className="h-5 w-auto object-contain" />
            </header>
            <main className="bg-gray-200 p-6">
                <div className="max-w-6xl mx-auto bg-white border border-gray-300 rounded-sm shadow-sm">
                    <div className="border-b border-gray-300 px-6 py-4">
                        <h1 className="text-xl md:text-2xl font-sans font-semibold text-gray-900">Complete Your Enrollment</h1>
                    </div>

                    <Form {...form}>
                        <form className="px-6 py-6 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            {/* Personal information */}
                            <section className="border border-gray-300 rounded-sm p-4 space-y-4">
                                <div className="text-base md:text-xl font-semibold text-primary">Personal <span className="text-gray-400">information</span></div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base text-primary font-semibold">Name</FormLabel>
                                            <FormControl>
                                                <Input className="h-9 border-gray-300" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base text-primary font-semibold">Email</FormLabel>
                                            <FormControl>
                                                <Input className="h-9 border-gray-300" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="phone" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base text-primary font-semibold">Phone</FormLabel>
                                            <FormControl>
                                                <Input className="h-9 border-gray-300" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="dob"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel className="text-base text-primary font-semibold">Date of birth</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-[240px] pl-3 h-9 rounded-none text-left font-normal hover:bg-transparent",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(field.value, "PPP")
                                                                    ) : (
                                                                        <span>Pick a date</span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                disabled={(date) =>
                                                                    date > new Date() || date < new Date("1900-01-01")
                                                                }
                                                                captionLayout="dropdown"
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField control={form.control} name="gender" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base text-primary font-semibold">Gender</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-9 border-gray-300 rounded-none">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="ssn" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base text-primary font-semibold">Social Security Number/Tax ID</FormLabel>
                                                <FormControl>
                                                    <Input className="h-9 border-gray-300" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="occupation" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base text-primary font-semibold">Occupation</FormLabel>
                                                <FormControl>
                                                    <Input className="h-9 border-gray-300" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>


                                </div>
                            </section>

                            {/* Contact information */}
                            <section className="border border-gray-300 rounded-sm p-4 space-y-4">
                                <div className="text-base md:text-xl font-semibold text-primary">Contact <span className="text-gray-400">information</span></div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField control={form.control} name="countryId" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base text-primary font-semibold">Country</FormLabel>
                                            <Select onValueChange={(val) => { field.onChange(val); form.setValue("cityId", ""); }} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-9 border-gray-300 rounded-none">
                                                        <SelectValue placeholder="Select Country" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {countries.map((c) => (
                                                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="cityId" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base text-primary font-semibold">City</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!liveCountryId}>
                                                <FormControl>
                                                    <SelectTrigger className="h-9 border-gray-300 rounded-none">
                                                        <SelectValue placeholder="Select Country First" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {cities.map((c) => (
                                                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="zip" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base text-primary font-semibold">ZIP</FormLabel>
                                            <FormControl>
                                                <Input className="h-9 border-gray-300" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="address" render={({ field }) => (
                                        <FormItem className="md:col-span-3">
                                            <FormLabel className="text-base text-primary font-semibold">Address</FormLabel>
                                            <FormControl>
                                                <Textarea className="h-12 border-gray-300" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </section>

                            {/* Next of Kin information */}
                            <section className="border border-gray-300 rounded-sm p-4 space-y-4">
                                <div className="text-base md:text-xl font-semibold text-primary">Next of Kin <span className="text-gray-400">information</span></div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <FormField control={form.control} name="nokName" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base text-primary font-semibold">Name</FormLabel>
                                            <FormControl>
                                                <Input className="h-9 border-gray-300" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="nokEmail" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base text-primary font-semibold">Email</FormLabel>
                                            <FormControl>
                                                <Input className="h-9 border-gray-300" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="nokPhone" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base text-primary font-semibold">Phone</FormLabel>
                                            <FormControl>
                                                <Input className="h-9 border-gray-300" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="nokRelationship" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base text-primary font-semibold">Relationship</FormLabel>
                                            <FormControl>
                                                <Input className="h-9 border-gray-300" placeholder="e.g Brother" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="nokAddress" render={({ field }) => (
                                        <FormItem className="md:col-span-4">
                                            <FormLabel className="text-base text-primary font-semibold">Address</FormLabel>
                                            <FormControl>
                                                <Textarea className="h-12 border-gray-300" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </section>

                            {/* Account information */}
                            <section className="border border-gray-300 rounded-sm p-4 space-y-4">
                                <div className="text-base md:text-xl font-semibold text-primary">Account <span className="text-gray-400">information</span></div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <FormField control={form.control} name="currency" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base text-primary font-semibold">Account Currency</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-9 border-gray-300 rounded-none">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {accountCurrencies.map((c) => (
                                                        <SelectItem key={c.value + c.label} value={c.value}>{c.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="password" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base text-primary font-semibold">Password</FormLabel>
                                            <FormControl>
                                                <Input className="h-9 border-gray-300" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="password2" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base text-primary font-semibold">Repeat Password</FormLabel>
                                            <FormControl>
                                                <Input className="h-9 border-gray-300" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="pin" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base text-primary font-semibold">PIN</FormLabel>
                                            <FormControl>
                                                <Input className="h-9 border-gray-300" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </section>

                            {/* KYC Verification */}
                            <section className="border border-gray-300 rounded-sm p-4 space-y-4">
                                <div className="text-base md:text-xl font-semibold text-primary">KYC <span className="text-gray-400">Verification</span></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-base text-primary font-semibold">Passport Photograph</Label>
                                        <input id="passport-upload" name="passport" type="file" className="block w-full text-base border border-gray-300 rounded-sm file:mr-4 file:py-1.5 file:px-3 file:border-0 file:text-base file:bg-gray-100 file:text-gray-700" />
                                        <p className="text-[10px] text-gray-500">Accepted file type: png, jpg, gif (max 5mb)</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-base text-primary font-semibold">Means of Identification</Label>
                                        <input id="id-upload" name="idDocument" type="file" className="block w-full text-base border border-gray-300 rounded-sm file:mr-4 file:py-1.5 file:px-3 file:border-0 file:text-base file:bg-gray-100 file:text-gray-700" />
                                        <p className="text-[10px] text-gray-500">Accepted documents: Passport, ID, Bank/Utility Bill. Accepted file type: PDF, png, jpg, gif (max 5mb)</p>
                                    </div>
                                </div>
                            </section>

                            <div className="pt-2">
                                <Button type="submit" className="px-6 py-2 bg-banking-primary text-white">SUBMIT FORM</Button>
                            </div>
                        </form>
                    </Form>
                </div >
            </main >

        </div >
    );
}


