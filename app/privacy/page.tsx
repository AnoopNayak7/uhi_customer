import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, UserCheck, Database, Globe } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account (name, email, phone number)",
        "Property information when you list properties on our platform",
        "Usage data and analytics to improve our services",
        "Communication records when you contact our support team",
        "Location data when you search for properties in specific areas"
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our property listing services",
        "To facilitate communication between buyers and sellers",
        "To send you relevant property recommendations and updates",
        "To improve our platform and develop new features",
        "To comply with legal obligations and prevent fraud"
      ]
    },
    {
      icon: Lock,
      title: "Information Security",
      content: [
        "We use industry-standard encryption to protect your data",
        "Regular security audits and vulnerability assessments",
        "Secure data centers with 24/7 monitoring",
        "Limited access to personal information on a need-to-know basis",
        "Regular backup and disaster recovery procedures"
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access and review your personal information",
        "Request correction of inaccurate data",
        "Delete your account and associated data",
        "Opt-out of marketing communications",
        "Data portability and export options"
      ]
    },
    {
      icon: Globe,
      title: "Information Sharing",
      content: [
        "We do not sell your personal information to third parties",
        "Property listings are publicly visible as intended",
        "Contact information is shared only with verified interested parties",
        "We may share data with service providers under strict agreements",
        "Legal compliance may require disclosure in certain circumstances"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 15, 2024
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Introduction */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  UrbanHouseIN ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                  explains how we collect, use, disclose, and safeguard your information when you visit our website 
                  and use our services. Please read this privacy policy carefully. If you do not agree with the 
                  terms of this privacy policy, please do not access the site.
                </p>
              </CardContent>
            </Card>

            {/* Main Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span>{section.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Cookies Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Cookies and Tracking Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  We use cookies and similar tracking technologies to enhance your experience on our platform:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Essential Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Required for basic site functionality and security
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Help us understand how visitors interact with our site
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Preference Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Remember your settings and preferences
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Used to deliver relevant advertisements
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> privacy@urbanhousein.com</p>
                  <p><strong>Phone:</strong> +91 90000 00000</p>
                  <p><strong>Address:</strong> Bangalore, Karnataka, India</p>
                </div>
              </CardContent>
            </Card>

            {/* Updates Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Policy Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by 
                  posting the new Privacy Policy on this page and updating the "Last updated" date. You are 
                  advised to review this Privacy Policy periodically for any changes.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}