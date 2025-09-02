import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building,
  Home,
  TreePine,
  Briefcase,
  Users,
  MapPin,
  TrendingUp,
  Star,
} from "lucide-react";
import Link from "next/link";

export function PropertyListings() {
  // Static data for better SEO and page source rendering
  const cities = [
    { name: "Bengaluru", properties: 1234, href: "/properties?city=Bengaluru" },
    { name: "Mumbai", properties: 2567, href: "/properties?city=Mumbai" },
    { name: "Delhi", properties: 1890, href: "/properties?city=Delhi" },
    { name: "Chennai", properties: 987, href: "/properties?city=Chennai" },
    { name: "Hyderabad", properties: 1456, href: "/properties?city=Hyderabad" },
    { name: "Pune", properties: 876, href: "/properties?city=Pune" },
  ];

  const propertyTypes = [
    {
      icon: Building,
      title: "Properties in Bengaluru",
      subtitle: "Property for Sale in Bengaluru",
      count: "15,000+ Properties",
      description:
        "Discover premium properties across Bengaluru including apartments, houses, villas, and more. Find your dream home in the most sought-after locations.",
      seoDescription:
        "Buy properties in Bengaluru - Find apartments, houses, villas for sale in Whitefield, Electronic City, Sarjapur Road, Koramangala, Indiranagar and more areas.",
      link: "/properties?city=Bengaluru",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
      features: ["Verified Properties", "Best Deals", "Location Insights"],
    },
    {
      icon: Home,
      title: "Flats in Bengaluru",
      subtitle: "Apartments & Flats for Sale",
      count: "800+ Projects",
      description:
        "Explore modern apartments and flats in Bengaluru's top residential areas. From 1BHK to luxury penthouses, find your perfect living space.",
      seoDescription:
        "Buy flats in Bengaluru - 1BHK, 2BHK, 3BHK apartments for sale in premium projects. Ready to move and under construction properties available.",
      link: "/properties?city=Bengaluru&category=apartment",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      iconColor: "text-green-600",
      features: ["Ready to Move", "Under Construction", "Premium Projects"],
    },
    {
      icon: TreePine,
      title: "Plots in Bengaluru",
      subtitle: "Residential Plots for Sale",
      count: "2,500+ Plots",
      description:
        "Invest in residential plots across Bengaluru's developing areas. Build your dream home from scratch with our verified plot listings.",
      seoDescription:
        "Buy residential plots in Bengaluru - Investment plots, ready to build land, and agricultural land for sale in emerging localities.",
      link: "/properties?city=Bengaluru&category=plot",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
      features: ["Investment Ready", "Clear Title", "Development Potential"],
    },
    {
      icon: Briefcase,
      title: "Commercial Properties",
      subtitle: "Office Space & Retail",
      count: "500+ Properties",
      description:
        "Find commercial properties including office spaces, retail shops, and warehouses in Bengaluru's prime business districts.",
      seoDescription:
        "Buy commercial properties in Bengaluru - Office spaces, retail shops, warehouses, and industrial properties for business investment.",
      link: "/properties?city=Bengaluru&type=commercial",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
      features: ["Prime Location", "High ROI", "Business Ready"],
    },
    // Builder Floors commented out as requested
    // {
    //   icon: Building,
    //   title: 'Builder Floors in Bengaluru',
    //   subtitle: 'Builder Floor for Sale',
    //   count: '800+ Properties',
    //   description: 'Exclusive builder floor properties in prime Bengaluru locations. Perfect for those seeking spacious living with modern amenities.',
    //   link: '/properties?city=Bengaluru&category=house',
    //   bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
    //   iconColor: 'text-indigo-600',
    //   features: ['Spacious Layout', 'Prime Location', 'Modern Design']
    // }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Property Listings in
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              {" "}
              Bengaluru
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Currently launching in Bengaluru with comprehensive property
            listings. More cities coming soon!
          </p>
        </div>

        {/* Featured Cities */}
        {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {cities.map((city) => (
            <Link key={city.name} href={city.href}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-4 text-center">
                  <MapPin className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">{city.name}</h3>
                  <p className="text-sm text-gray-600">{city.properties} Properties</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div> */}

        {/* Property Types Grid - 4 cards in a row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {propertyTypes.map((type) => (
            <Card
              key={type.title}
              className="group hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer overflow-hidden border-0 shadow-lg bg-white"
            >
              <CardContent className="p-6 h-full flex flex-col">
                {/* Icon and Header */}
                <div
                  className={`w-16 h-16 ${type.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}
                >
                  <type.icon className={`w-8 h-8 ${type.iconColor}`} />
                </div>

                {/* Title and Subtitle */}
                <h3 className="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300 tracking-tight leading-tight">
                  {type.title}
                </h3>

                <p className="text-gray-500 mb-4 font-semibold text-xs uppercase tracking-wide">
                  {type.subtitle}
                </p>

                {/* Property Count Badge */}
                {/* <div className="flex items-center mb-4">
                  <TrendingUp className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-sm font-semibold text-red-600">
                    {type.count}
                  </span>
                </div> */}

                {/* Description */}
                <p className="text-sm text-gray-600 mb-6 flex-grow leading-relaxed font-medium">
                  {type.description}
                </p>

                {/* Features List */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-3">
                    {type.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200"
                      >
                        <Star className="w-3 h-3 text-yellow-500 mr-1.5" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant="default"
                  size="lg"
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 font-bold text-sm py-3"
                  asChild
                >
                  <Link
                    href={type.link}
                    className="flex items-center justify-center"
                  >
                    <span>View Properties</span>
                    <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SEO Content Section */}
        <div className="mt-20 bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10 text-center tracking-tight">
              Find Your Dream Property in
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                {" "}
                Bengaluru
              </span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 text-red-500 mr-3" />
                  Popular Areas in Bengaluru
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-900">
                        Whitefield:
                      </span>
                      <span className="text-gray-700 ml-2">
                        IT hub with premium apartments and villas
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-900">
                        Electronic City:
                      </span>
                      <span className="text-gray-700 ml-2">
                        Affordable housing near tech parks
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-900">
                        Sarjapur Road:
                      </span>
                      <span className="text-gray-700 ml-2">
                        Growing residential corridor with modern projects
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-900">
                        Koramangala:
                      </span>
                      <span className="text-gray-700 ml-2">
                        Central location with established infrastructure
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-900">
                        Indiranagar:
                      </span>
                      <span className="text-gray-700 ml-2">
                        Upscale neighborhood with luxury properties
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-900">
                        HSR Layout:
                      </span>
                      <span className="text-gray-700 ml-2">
                        Planned residential area with good connectivity
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 text-green-500 mr-3" />
                  Property Investment Guide
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-900">
                        Ready to Move:
                      </span>
                      <span className="text-gray-700 ml-2">
                        Immediate possession properties
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-900">
                        Under Construction:
                      </span>
                      <span className="text-gray-700 ml-2">
                        Pre-launch and early bird offers
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-cyan-100 border border-cyan-200">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-900">
                        Resale Properties:
                      </span>
                      <span className="text-gray-700 ml-2">
                        Established neighborhoods
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-rose-50 to-rose-100 border border-rose-200">
                    <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-900">
                        New Projects:
                      </span>
                      <span className="text-gray-700 ml-2">
                        Latest amenities and modern designs
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-violet-50 to-violet-100 border border-violet-200">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-900">
                        Investment Properties:
                      </span>
                      <span className="text-gray-700 ml-2">
                        High rental yield areas
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-900">
                        Luxury Properties:
                      </span>
                      <span className="text-gray-700 ml-2">
                        Premium locations and amenities
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-2xl border border-red-100 shadow-lg">
              <h4 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Why Choose UrbanHousein for Bengaluru Properties?
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h5 className="font-bold text-gray-900 mb-2 text-lg">
                    Verified Listings
                  </h5>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    All properties are thoroughly verified for authenticity
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h5 className="font-bold text-gray-900 mb-2 text-lg">
                    Expert Guidance
                  </h5>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Professional real estate consultants to help you
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h5 className="font-bold text-gray-900 mb-2 text-lg">
                    Best Deals
                  </h5>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Negotiated rates and exclusive offers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
