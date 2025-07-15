import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Shield, AlertTriangle, Scale, Gavel } from 'lucide-react';

export default function TermsOfServicePage() {
  const sections = [
    {
      icon: Users,
      title: "User Accounts and Registration",
      content: [
        "You must be at least 18 years old to create an account",
        "Provide accurate and complete information during registration",
        "Maintain the security of your account credentials",
        "You are responsible for all activities under your account",
        "Notify us immediately of any unauthorized use of your account"
      ]
    },
    {
      icon: FileText,
      title: "Property Listings",
      content: [
        "Property information must be accurate and up-to-date",
        "You must have legal authority to list the property",
        "Prohibited content includes false information, discriminatory language, or illegal activities",
        "We reserve the right to remove listings that violate our policies",
        "You retain ownership of your property information and images"
      ]
    },
    {
      icon: Shield,
      title: "User Conduct",
      content: [
        "Use the platform only for lawful purposes",
        "Do not harass, abuse, or harm other users",
        "Respect intellectual property rights",
        "Do not attempt to gain unauthorized access to our systems",
        "Report any suspicious or inappropriate behavior"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Activities",
      content: [
        "Posting false or misleading property information",
        "Using the platform for illegal activities",
        "Spamming or sending unsolicited communications",
        "Attempting to circumvent our security measures",
        "Violating any applicable laws or regulations"
      ]
    },
    {
      icon: Scale,
      title: "Liability and Disclaimers",
      content: [
        "We provide the platform 'as is' without warranties",
        "We are not responsible for the accuracy of user-generated content",
        "Users are responsible for verifying property information",
        "We do not guarantee successful property transactions",
        "Our liability is limited to the maximum extent permitted by law"
      ]
    },
    {
      icon: Gavel,
      title: "Dispute Resolution",
      content: [
        "Disputes should first be resolved through direct communication",
        "We may provide mediation services for certain disputes",
        "Legal disputes will be governed by Indian law",
        "Jurisdiction for legal proceedings will be in Bangalore, Karnataka",
        "We reserve the right to suspend accounts during dispute resolution"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using our platform. By using UrbanHouseIN, you agree to these terms.
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  These Terms of Service ("Terms") govern your use of UrbanHouseIN's website and services. 
                  By accessing or using our platform, you agree to be bound by these Terms. If you disagree 
                  with any part of these terms, then you may not access the service.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to update these Terms at any time. Changes will be effective immediately 
                  upon posting. Your continued use of the service after changes are posted constitutes acceptance 
                  of the new Terms.
                </p>
              </CardContent>
            </Card>

            {/* Main Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <span>{section.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Payment Terms */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Payment and Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Free Services</h4>
                    <p className="text-gray-600">
                      Basic property listing and browsing features are provided free of charge.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Premium Services</h4>
                    <p className="text-gray-600">
                      Enhanced features and premium listings may require payment as specified in our pricing plans.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Refund Policy</h4>
                    <p className="text-gray-600">
                      Refunds are handled on a case-by-case basis. Contact our support team for assistance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Intellectual Property Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    The UrbanHouseIN platform, including its design, functionality, and content, is protected by 
                    intellectual property laws. You may not copy, modify, or distribute our platform without permission.
                  </p>
                  <p className="text-gray-600">
                    User-generated content remains the property of the respective users, but you grant us a license 
                    to use, display, and distribute such content on our platform.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Account Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    We may terminate or suspend your account immediately, without prior notice, for conduct that 
                    we believe violates these Terms or is harmful to other users, us, or third parties.
                  </p>
                  <p className="text-gray-600">
                    You may terminate your account at any time by contacting our support team. Upon termination, 
                    your right to use the service will cease immediately.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> legal@urbanhousein.com</p>
                  <p><strong>Phone:</strong> +91 90000 00000</p>
                  <p><strong>Address:</strong> Bangalore, Karnataka, India</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}