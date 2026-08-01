import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FrontHeader from "@/components/front-header";
import FrontFooter from "@/components/front-footer";
import PageHeader from "@/components/page-header";
import FrontPreFooterStrip from "@/components/front-prefooter-strip";

export default function PostOne() {

    return (
        <div className="min-h-screen bg-white">
            <FrontHeader />

            <PageHeader
                navigationTitle="Tax Checklist: 5 Things to Remember"
                parentNavigationTitle="Learn & Plan"
            />

            {/* About Italian Section */}
            <section className="py-12 md:py-16 container">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-sans font-medium text-gold mb-6">
                        Tax Checklist: 5 Things to Remember
                    </h2>
                    <div className="inline-flex gap-2 items-center mb-10">
                        <div className="inline-flex flex-col rounded-full bg-gray-100 px-1">
                            <img src="/assets/images/favicon.png" alt="logo" className="w-10 h-8 object-cover" />
                        </div>
                        <p className="font-semibold text-base">Italian Financial Tips</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-14 mb-4">
                        <div>
                            <img src="/assets/images/tax-checklist-5-things-to-remember.jpg" className="bg-cover w-full" alt="img" />
                        </div>
                        <div className=" flex flex-col gap-6 md:pr-5">
                            <p className="text-base">No matter who you are or how much experience you have, tax season can feel daunting. There’s a lot to remember and a lot of factors to consider while filing. The American tax system, for instance, involves around 800 forms—some with convoluted rules and requirements. And another layer of complication has been added during the pandemic, as rapid changes in finances and incomes have occurred, and things like stimulus checks have been introduced. </p>

                            <p className="text-base">Luckily, there are plenty of resources, like this tax checklist, available to ensure that filing goes smoothly this year. Below are a few key things to keep in mind as you approach the 2022 tax season. </p>

                            <h3 className="font-semibold text-3xl">1. File Your Taxes on Time</h3>
                            <p>
                                This may seem obvious, but filing your taxes by the due date is incredibly important. There are two main penalties in place if you’re unable to meet the deadline: the failure to file penalty and the failure to pay penalty. Both of these can add up to 25% of your taxes owed, meaning that you’ll be paying significantly more if you miss the deadline.
                            </p>
                        </div>
                    </div>
                    <p className="text-base">Avoiding these penalties is easy: just set a reminder in your calendar and remember to file your taxes by April 18. However, if this date seems unattainable, filing for extensions is possible, and can give you a bit more breathing room. </p>


                    <h3 className="font-semibold text-3xl mt-10 mb-2">2. Have Your Personal Information Ready</h3>
                    <p className="text-base">Not knowing your personal information and the types of taxes you have to pay or claims you are able to file is a common mistake. There are a few key pieces of personal information you should know before filing your taxes in 2022:</p>
                    <div className="pl-4 mt-4 mb-4">
                        <ul className="text-base list-disc marker:text-primary font-bold">
                            <li>Your income as a whole, including investment income</li>
                            <li>Social Security numbers for yourself, your spouses, and your dependents</li>
                            <li> Your marital status and whether you’re filing together or separately</li>
                            <li>Any deductions and expenses you may have which impact your taxable amount</li>
                        </ul>
                    </div>
                    <p className="text-base">Speaking with an expert in order to clarify which forms are needed for which tax claims can ensure you’re getting it right the first time. </p>

                    <h3 className="font-semibold text-3xl mt-10 mb-2">3. Prepare for Any Increases in Your Taxes</h3>
                    <p className="text-base">While filing your basic tax returns can be straightforward if you’re only receiving one income from a single employer, it can get a little complicated if you have other means of income to declare. For instance, your taxes may increase if you are receiving rental income, stocks and shares, or even a salary from secondary employment. Any additional means of income need to be declared for tax purposes and you will more than likely have to prepare yourself for a tax increase to account for these. </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-14 mt-5 mb-4">
                        <div>
                            <img src="/assets/images/Tax-Checklist-inpage.jpg" className="bg-cover w-full" alt="img" />
                        </div>
                        <div className=" flex flex-col gap-6 md:pr-5">
                            <h3 className="font-semibold text-3xl">4. Determine if You’re Eligible for Deductions</h3>
                            <p className="text-base">
                                Increases in income from selling your house or getting a raise will increase the amount you pay in your taxes. However, there are some factors of your life which may qualify you to deduct amounts from your taxes as well. Keeping these in mind will help you to save money on the amount owed on your taxes.
                            </p>
                            <p className="text-base">
                                Tuition costs, donations to charities, tax forgiveness credit, Health Savings Account contributions, mortgage interest payments, and student loans can impact your taxes in a positive way. Be sure to look at which deductions you qualify for as part of your tax filing prep in order to pay the optimal amount and save as much as you can.
                            </p>

                            <h3 className="font-semibold text-3xl">5. Make Sure to Double Check Your Information</h3>
                        </div>
                    </div>

                    <p className="text-base mb-4">
                        Before you file your taxes, be sure to double-check your math and the information on your forms, or consult with an expert on them. Ensuring that you are filing your taxes properly and error-free will save you issues in the long run.
                    </p>
                    <p className="text-base">
                        Although it seems like a lot to remember, having a tax checklist is a great place to start. Instead of being intimidated by the complex U.S. tax system, approach your taxes systematically and give yourself enough time to check over your claims. There is also the option to talk to local financial experts in order to provide some reassurance that your taxes are getting done right this year.
                    </p>
                </div>


            </section >





            {/* Pre-Footer Strip */}
            < FrontPreFooterStrip />
            <FrontFooter />
        </div >
    );
}
