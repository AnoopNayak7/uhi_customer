"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useAuthStore, usePropertyStore } from "@/lib/store";
import { LocationSelector } from "./location-selector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Settings,
  LogOut,
  Heart,
  Eye,
  Plus,
  BarChart3,
  Menu,
  X,
  GitCompare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TouchButton } from "@/components/animations/mobile-animations";

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { compareList } = usePropertyStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Buy", href: "/properties?type=sell" },
    { label: "Rent", href: "/properties?type=rent" },
    { label: "Commercial", href: "/properties?type=commercial" },
    // { label: 'PG/Co-living', href: '/properties?type=pg_co_living' },
    { label: "Plots", href: "/properties?type=plots" },
  ];

  // Animation variants for mobile menu
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
    },
    open: {
      opacity: 1,
      height: "auto" as any,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: -20,
    },
    open: {
      opacity: 1,
      x: 0,
    },
  };

  const menuButtonVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-red-500 transition-all duration-300 font-medium text-base relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth & Actions */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Compare Button */}
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="relative border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
            >
              <Link href="/tools/property-comparison">
                <GitCompare className="w-4 h-4 mr-2" />
                Compare
                {compareList.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold shadow-lg">
                    {compareList.length}
                  </span>
                )}
              </Link>
            </Button>

            {isAuthenticated && user ? (
              <>
                {user.role === "builder" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300"
                  >
                    <Link href="/dashboard/property/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Property
                    </Link>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-12 w-12 rounded-full hover:bg-gray-100 transition-all duration-300 p-0"
                    >
                      <Avatar className="h-10 w-10 border-2 border-gray-100 hover:border-gray-200 transition-all duration-300">
                        <AvatarFallback className="bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-all duration-300">
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2" align="end">
                    <div className="flex items-center justify-start gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                      <Avatar className="h-12 w-12 border-2 border-gray-200">
                        <AvatarFallback className="bg-gray-900 text-white font-semibold text-lg">
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="w-[200px] truncate text-sm text-gray-600">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem asChild className="p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Link href="/dashboard">
                        <BarChart3 className="mr-3 h-4 w-4 text-blue-600" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Link href="/profile">
                        <User className="mr-3 h-4 w-4 text-green-600" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Link href="/favourites">
                        <Heart className="mr-3 h-4 w-4 text-red-600" />
                        <span className="font-medium">Favourites</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Link href="/viewed-properties">
                        <Eye className="mr-3 h-4 w-4 text-purple-600" />
                        <span className="font-medium">Recently Viewed</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="p-3 rounded-lg hover:bg-red-50 transition-colors duration-200 text-red-600 hover:text-red-700"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span className="font-medium">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  asChild
                  className="text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-300 font-medium"
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button 
                  className="bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl transition-all duration-300 font-medium px-6 py-2.5 rounded-lg" 
                  asChild
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <TouchButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-lg text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
              haptic={true}
            >
              <motion.div
                variants={menuButtonVariants}
                animate={isMobileMenuOpen ? "open" : "closed"}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.div>
            </TouchButton>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden overflow-hidden border-t border-gray-100"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.div className="px-4 pt-4 pb-6 space-y-2 bg-gray-50/50">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    variants={menuItemVariants}
                    custom={index}
                  >
                    <Link
                      href={item.href}
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-red-500 hover:bg-white rounded-xl transition-all duration-300 border border-transparent hover:border-red-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Location Selector */}
                <motion.div variants={menuItemVariants} className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-700 mb-3">Location</div>
                  <LocationSelector />
                </motion.div>

                {/* Mobile Compare Button */}
                <motion.div variants={menuItemVariants}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start relative px-4 py-3 h-auto rounded-xl hover:bg-white hover:border-red-100 border border-transparent transition-all duration-300"
                    asChild
                  >
                    <Link
                      href="/tools/property-comparison"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <GitCompare className="mr-3 h-4 w-4" />
                      Compare Properties
                      {compareList.length > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold shadow-lg">
                          {compareList.length}
                        </span>
                      )}
                    </Link>
                  </Button>
                </motion.div>

                {!isAuthenticated ? (
                  <motion.div
                    className="pt-4 border-t border-gray-200 space-y-3"
                    variants={menuItemVariants}
                  >
                    <motion.div variants={menuItemVariants}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-3 h-auto rounded-xl hover:bg-white hover:border-gray-200 border border-transparent transition-all duration-300"
                        asChild
                      >
                        <Link
                          href="/auth/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div variants={menuItemVariants}>
                      <Button
                        className="w-full bg-red-500 hover:bg-red-600 px-4 py-3 h-auto rounded-xl shadow-lg transition-all duration-300"
                        asChild
                      >
                        <Link
                          href="/auth/signup"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="pt-4 border-t border-gray-200 space-y-3"
                    variants={menuItemVariants}
                  >
                    <motion.div variants={menuItemVariants}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-3 h-auto rounded-xl hover:bg-white hover:border-gray-200 border border-transparent transition-all duration-300"
                        asChild
                      >
                        <Link
                          href="/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <BarChart3 className="mr-3 h-4 w-4 text-blue-600" />
                          Dashboard
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div variants={menuItemVariants}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-3 h-auto rounded-xl hover:bg-white hover:border-gray-200 border border-transparent transition-all duration-300"
                        asChild
                      >
                        <Link
                          href="/profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="mr-3 h-4 w-4 text-green-600" />
                          Profile
                        </Link>
                      </Button>
                    </motion.div>
                    {user?.role === "builder" && (
                      <motion.div variants={menuItemVariants}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-4 py-3 h-auto rounded-xl hover:bg-white hover:border-gray-200 border border-transparent transition-all duration-300"
                          asChild
                        >
                          <Link
                            href="/dashboard/property/create"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Plus className="mr-3 h-4 w-4 text-green-600" />
                            Add Property
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                    <motion.div variants={menuItemVariants}>
                      <TouchButton
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full p-0"
                        haptic={true}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 h-auto rounded-xl hover:border-red-200 border border-transparent transition-all duration-300 pointer-events-none"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Log out
                        </Button>
                      </TouchButton>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
