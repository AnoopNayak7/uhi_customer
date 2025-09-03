"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Crown, 
  TrendingUp,
  Eye,
  Heart,
  Phone,
  BarChart3,
  Users,
  Building,
  Shield,
  Headphones
} from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for individual property owners',
      price: { monthly: 0, yearly: 0 },
      badge: null,
      features: [
        { name: 'List up to 3 properties', included: true },
        { name: 'Basic property search & browsing', included: true },
        { name: 'Standard property photos (up to 5)', included: true },
        { name: 'Basic property details', included: true },
        { name: 'Contact form inquiries', included: true },
        { name: 'Mobile responsive listings', included: true },
        { name: 'Basic analytics (views, favorites)', included: true },
        { name: 'Email support', included: true },
        { name: 'Featured listings', included: false },
        { name: 'Premium placement', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Lead management', included: false },
        { name: 'Priority support', included: false },
        { name: 'Custom branding', included: false }
      ],
      cta: 'Get Started Free',
      popular: false,
      color: 'border-gray-200'
    },
    {
      name: 'Professional',
      description: 'For real estate agents and small builders',
      price: { monthly: 999, yearly: 9990 },
      badge: 'Most Popular',
      features: [
        { name: 'List up to 25 properties', included: true },
        { name: 'All Free plan features', included: true },
        { name: 'Featured listings (5 per month)', included: true },
        { name: 'Premium property photos (up to 15)', included: true },
        { name: 'Advanced property details & amenities', included: true },
        { name: 'Lead management dashboard', included: true },
        { name: 'Advanced analytics & insights', included: true },
        { name: 'Phone & email support', included: true },
        { name: 'Social media integration', included: true },
        { name: 'Property comparison tools', included: true },
        { name: 'Custom property URLs', included: true },
        { name: 'Bulk property upload', included: true },
        { name: 'Custom branding', included: false },
        { name: 'API access', included: false }
      ],
      cta: 'Start Professional',
      popular: true,
      color: 'border-blue-500 ring-2 ring-blue-200'
    },
    {
      name: 'Enterprise',
      description: 'For large builders and real estate companies',
      price: { monthly: 2999, yearly: 29990 },
      badge: 'Best Value',
      features: [
        { name: 'Unlimited property listings', included: true },
        { name: 'All Professional plan features', included: true },
        { name: 'Unlimited featured listings', included: true },
        { name: 'Premium placement in search results', included: true },
        { name: 'Custom branding & white-label options', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'Priority customer support (24/7)', included: true },
        { name: 'Advanced lead scoring & CRM integration', included: true },
        { name: 'Custom analytics & reporting', included: true },
        { name: 'API access for integrations', included: true },
        { name: 'Multi-user team access', included: true },
        { name: 'Custom domain support', included: true },
        { name: 'Marketing automation tools', included: true },
        { name: 'Performance marketing support', included: true }
      ],
      cta: 'Contact Sales',
      popular: false,
      color: 'border-purple-500'
    }
  ];

  const addOns = [
    {
      name: 'Premium Photography',
      description: 'Professional property photography service',
      price: 2999,
      icon: Eye,
      features: ['Professional photographer visit', 'High-quality images', '24-hour delivery', 'Unlimited revisions']
    },
    {
      name: 'Virtual Tour',
      description: '360° virtual property tours',
      price: 4999,
      icon: Building,
      features: ['360° photography', 'Interactive virtual tour', 'Mobile compatible', 'Embedded in listings']
    },
    {
      name: 'Marketing Boost',
      description: 'Enhanced marketing and promotion',
      price: 1999,
      icon: TrendingUp,
      features: ['Social media promotion', 'Featured placement', 'Email marketing', 'Performance analytics']
    },
    {
      name: 'Lead Generation',
      description: 'Advanced lead generation tools',
      price: 3999,
      icon: Users,
      features: ['Targeted advertising', 'Lead scoring', 'CRM integration', 'Follow-up automation']
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your real estate needs. Start free and upgrade as you grow.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-blue-500"
              />
              <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              <Badge className="bg-green-500 text-white">Save 17%</Badge>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card key={plan.name} className={`relative ${plan.color} ${plan.popular ? 'scale-105' : ''}`}>
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white px-4 py-1">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                    
                    <div className="mt-6">
                      <div className="text-4xl font-bold text-gray-900">
                        {plan.price.monthly === 0 ? (
                          'Free'
                        ) : (
                          formatPrice(isYearly ? plan.price.yearly : plan.price.monthly)
                        )}
                      </div>
                      {plan.price.monthly > 0 && (
                        <div className="text-sm text-gray-500 mt-1">
                          per {isYearly ? 'year' : 'month'}
                          {isYearly && (
                            <span className="block text-green-600 font-medium">
                              Save {formatPrice(plan.price.monthly * 12 - plan.price.yearly)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-6">
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-blue-500 hover:bg-blue-600' 
                            : plan.name === 'Enterprise'
                            ? 'bg-purple-500 hover:bg-purple-600'
                            : 'bg-gray-900 hover:bg-gray-800'
                        }`}
                        asChild
                      >
                        <Link href={plan.name === 'Enterprise' ? '/contact' : '/auth/signup'}>
                          {plan.cta}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Add-ons Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Premium Add-ons
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Enhance your listings with professional services and advanced features
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addOns.map((addon) => (
                <Card key={addon.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <addon.icon className="w-6 h-6 text-blue-500" />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{addon.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{addon.description}</p>
                      
                      <div className="text-2xl font-bold text-gray-900 mb-4">
                        {formatPrice(addon.price)}
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        {addon.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full">
                        Add to Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-8">
              {[
                {
                  question: "Can I start with the free plan?",
                  answer: "Yes! Our free plan allows you to list up to 3 properties and includes all basic features. You can upgrade anytime as your needs grow."
                },
                {
                  question: "What happens if I exceed my plan limits?",
                  answer: "We'll notify you when you're approaching your limits. You can either upgrade your plan or remove some listings to stay within your current plan."
                },
                {
                  question: "Can I cancel my subscription anytime?",
                  answer: "Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your billing period."
                },
                {
                  question: "Do you offer refunds?",
                  answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets popular in India."
                },
                {
                  question: "Is there a setup fee?",
                  answer: "No, there are no setup fees or hidden charges. You only pay the plan price and any add-ons you choose."
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of property owners and real estate professionals using Urbanhousein
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/auth/signup">
                  Start Free Trial
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}