import { useQuery } from "@tanstack/react-query";
import { CreditCard, User } from "@shared/schema";
import { QuickActions } from "@/components/quick-actions";
import { BeneficiariesSection } from "@/components/beneficiaries-section";
import { getQueryFn } from "@/lib/queryClient";
import PageLayout from "@/components/page-layout";

export default function Dashboard() {
  const { data: me } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const userId = me?.id;



  return (
    <PageLayout>
              <QuickActions />
      {userId && <BeneficiariesSection userId={String(userId)} />}
    </PageLayout>
  );
}
