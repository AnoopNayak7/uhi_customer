"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useAuthStore, usePropertyStore } from "@/lib/store";
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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-red-500 transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Compare Button */}
            <Button variant="outline" size="sm" asChild className="relative">
              <Link href="/tools/property-comparison">
                <GitCompare className="w-4 h-4 mr-2" />
                Compare
                {compareList.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {compareList.length}
                  </span>
                )}
              </Link>
            </Button>

            {isAuthenticated && user ? (
              <>
                {user.role === "builder" && (
                  <Button variant="outline" size="sm" asChild>
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
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favourites">
                        <Heart className="mr-2 h-4 w-4" />
                        Favourites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/viewed-properties">
                        <Eye className="mr-2 h-4 w-4" />
                        Recently Viewed
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button className="bg-red-500 hover:bg-red-600" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <TouchButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-red-500 hover:bg-gray-100 transition-colors"
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
              className="md:hidden overflow-hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    variants={menuItemVariants}
                    custom={index}
                  >
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-500 hover:bg-gray-50 rounded-md transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Compare Button */}
                <motion.div variants={menuItemVariants}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start relative"
                    asChild
                  >
                    <Link
                      href="/tools/property-comparison"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <GitCompare className="mr-2 h-4 w-4" />
                      Compare Properties
                      {compareList.length > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {compareList.length}
                        </span>
                      )}
                    </Link>
                  </Button>
                </motion.div>

                {!isAuthenticated ? (
                  <motion.div
                    className="pt-4 border-t border-gray-200 space-y-2"
                    variants={menuItemVariants}
                  >
                    <motion.div variants={menuItemVariants}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
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
                        className="w-full bg-red-500 hover:bg-red-600"
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
                    className="pt-4 border-t border-gray-200 space-y-2"
                    variants={menuItemVariants}
                  >
                    <motion.div variants={menuItemVariants}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link
                          href="/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div variants={menuItemVariants}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link
                          href="/profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </Button>
                    </motion.div>
                    {user?.role === "builder" && (
                      <motion.div variants={menuItemVariants}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link
                            href="/dashboard/property/create"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
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
                          className="w-full justify-start text-red-600 pointer-events-none"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
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
