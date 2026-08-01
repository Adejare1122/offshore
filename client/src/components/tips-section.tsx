import { PiggyBankIcon, WalletIcon, HomeIcon, ShieldCheckIcon } from "lucide-react";

export function TipsSection() {
  const tips = [
    {
      icon: PiggyBankIcon,
      title: "Auto Save",
      description: "Set a goal, save automatically with Italian National Offshore's Auto Save and track your progress.",
      bgColor: "bg-yellow-50",
      iconColor: "bg-yellow-400",
    },
    {
      icon: WalletIcon,
      title: "Budget",
      description: "Check in with your budget and stay on top of your spending",
      bgColor: "bg-green-50",
      iconColor: "bg-green-500",
    },
    {
      icon: HomeIcon,
      title: "Home Option",
      description: "Your home purchase, refinance and insights right under one roof.",
      bgColor: "bg-teal-50",
      iconColor: "bg-teal-500",
    },
    {
      icon: ShieldCheckIcon,
      title: "Security Tip",
      description: "We will NEVER ask you to provide your security details such as COT Code or any sensitive details of your account.",
      bgColor: "bg-pink-50",
      iconColor: "bg-pink-500",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Italian Tips</h3>
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className={`flex items-start space-x-3 p-3 ${tip.bgColor} rounded-xl`}>
            <div className={`w-8 h-8 ${tip.iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <tip.icon className="text-white w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">{tip.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
