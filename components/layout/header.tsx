"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useAuthStore, usePropertyStore } from "@/lib/store";
import { LocationSelector } from "./location-selector";
import {
  ServicesMegaMenu,
  mobileServiceLinks,
} from "./services-mega-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  LogOut,
  Heart,
  Eye,
  Plus,
  BarChart3,
  Menu,
  X,
  GitCompare,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TouchButton } from "@/components/animations/mobile-animations";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Buy", href: "/properties?type=sell" },
  { label: "Rent", href: "/properties?type=rent" },
  { label: "Commercial", href: "/properties?type=commercial" },
  { label: "Plots", href: "/properties?type=plots" },
];

function getUserInitial(user: {
  firstName?: string;
  email?: string;
}) {
  const char = user.firstName?.trim()?.[0] || user.email?.trim()?.[0] || "?";
  return char.toUpperCase();
}

function UserAvatar({
  user,
  size = "sm",
}: {
  user: { firstName?: string; email?: string };
  size?: "sm" | "md";
}) {
  const isMd = size === "md";

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-[#303030] font-manrope font-semibold uppercase leading-none text-white aspect-square",
        isMd ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs"
      )}
      aria-hidden
    >
      {getUserInitial(user)}
    </span>
  );
}

export function Header({ hideOnScroll = false }: { hideOnScroll?: boolean }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { compareList } = usePropertyStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!hideOnScroll) {
      document.documentElement.style.setProperty("--header-offset", "4rem");
      return;
    }

    const onScroll = () => {
      const currentY = window.scrollY;

      if (currentY <= 8) {
        setIsHidden(false);
      } else if (currentY > lastScrollY.current && currentY > 72) {
        setIsHidden(true);
        setIsMobileMenuOpen(false);
        setMobileServicesOpen(false);
      } else if (currentY < lastScrollY.current) {
        setIsHidden(false);
      }

      lastScrollY.current = currentY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideOnScroll]);

  useEffect(() => {
    if (!hideOnScroll) return;

    document.documentElement.style.setProperty(
      "--header-offset",
      isHidden ? "0px" : "4rem"
    );

    return () => {
      document.documentElement.style.setProperty("--header-offset", "4rem");
    };
  }, [hideOnScroll, isHidden]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0 },
    open: {
      opacity: 1,
      height: "auto" as const,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: -16 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <>
      <header
        className={cn(
          "nav-glass-bar z-[60] overflow-visible",
          hideOnScroll
            ? "fixed inset-x-0 top-0 transition-transform duration-300 ease-in-out"
            : "sticky top-0",
          hideOnScroll && isHidden && "-translate-y-full"
        )}
      >
      <div className="relative mx-auto max-w-7xl overflow-visible px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-8 overflow-visible md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-manrope text-sm font-medium text-[#484848] transition-colors hover:text-[#222222]"
              >
                {item.label}
              </Link>
            ))}
            <ServicesMegaMenu />
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/tools/property-comparison"
              className="nav-compare-btn hidden md:inline-flex"
            >
              <GitCompare className="size-3.5" strokeWidth={1.25} />
              Compare
              {compareList.length > 0 ? (
                <span className="nav-compare-count" aria-label={`${compareList.length} properties to compare`}>
                  {compareList.length}
                </span>
              ) : null}
            </Link>

            {isAuthenticated && user ? (
              <>
                {user.role === "builder" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-9 rounded-full border-[#EBEBEB] font-manrope text-xs hover:bg-[#FAFAFA]"
                  >
                    <Link href="/dashboard/property/create">
                      <Plus className="mr-1.5 size-3.5" strokeWidth={1.25} />
                      Add Property
                    </Link>
                  </Button>
                ) : null}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#303030] font-manrope text-xs font-semibold uppercase leading-none text-white transition-colors hover:bg-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#303030]/20 focus-visible:ring-offset-2"
                      aria-label="Account menu"
                    >
                      {getUserInitial(user)}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-60 rounded-2xl border-[#EBEBEB] p-2"
                    align="end"
                    sideOffset={8}
                  >
                    <div className="mb-2 flex items-center gap-3 rounded-xl bg-[#FAFAFA] p-3">
                      <UserAvatar user={user} size="md" />
                      <div className="min-w-0">
                        <p className="truncate font-manrope text-sm font-semibold text-[#222222]">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="truncate font-manrope text-xs text-[#717171]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-xl">
                      <Link href="/dashboard">
                        <BarChart3 className="mr-2 size-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl">
                      <Link href="/profile">
                        <User className="mr-2 size-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl">
                      <Link href="/favourites">
                        <Heart className="mr-2 size-4" />
                        Favourites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl">
                      <Link href="/viewed-properties">
                        <Eye className="mr-2 size-4" />
                        Recently Viewed
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="rounded-xl text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 size-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  asChild
                  className="h-9 rounded-full font-manrope text-sm font-medium text-[#484848] hover:bg-[#F5F5F5] hover:text-[#222222]"
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="property-btn-pill h-9 rounded-full bg-[#303030] px-5 text-sm text-white hover:bg-[#1a1a1a]"
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <TouchButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full p-2 text-[#484848] hover:bg-[#F5F5F5]"
              haptic
            >
              {isMobileMenuOpen ? (
                <X className="size-5" strokeWidth={1.5} />
              ) : (
                <Menu className="size-5" strokeWidth={1.5} />
              )}
            </TouchButton>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen ? (
            <motion.div
              className="overflow-hidden border-t border-[#F0F0F0] md:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="space-y-1 px-2 py-4">
                {navigationItems.map((item) => (
                  <motion.div key={item.href} variants={menuItemVariants}>
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="block rounded-xl px-4 py-3 font-manrope text-sm font-medium text-[#484848] hover:bg-[#FAFAFA] hover:text-[#222222]"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div variants={menuItemVariants}>
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 font-manrope text-sm font-medium text-[#484848] hover:bg-[#FAFAFA]"
                  >
                    Services
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        mobileServicesOpen && "rotate-180"
                      )}
                      strokeWidth={1.5}
                    />
                  </button>
                  {mobileServicesOpen ? (
                    <div className="ml-2 space-y-1 border-l border-[#EBEBEB] pl-3">
                      {mobileServiceLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeMobileMenu}
                          className="block rounded-lg px-3 py-2 font-manrope text-sm text-[#717171] hover:bg-[#FAFAFA] hover:text-[#222222]"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </motion.div>

                <motion.div variants={menuItemVariants} className="px-2 py-2">
                  <p className="mb-2 px-2 font-manrope text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B0B0B0]">
                    Location
                  </p>
                  <LocationSelector />
                </motion.div>

                <motion.div variants={menuItemVariants}>
                  <Link
                    href="/tools/property-comparison"
                    onClick={closeMobileMenu}
                    className="flex items-center rounded-xl px-4 py-3 font-manrope text-sm text-[#484848] hover:bg-[#FAFAFA]"
                  >
                    <GitCompare className="mr-2 size-4" strokeWidth={1.25} />
                    Compare
                    {compareList.length > 0 ? (
                      <span className="nav-compare-count ml-auto">
                        {compareList.length}
                      </span>
                    ) : null}
                  </Link>
                </motion.div>

                {!isAuthenticated ? (
                  <motion.div
                    variants={menuItemVariants}
                    className="space-y-2 border-t border-[#F0F0F0] pt-4"
                  >
                    <Link
                      href="/auth/login"
                      onClick={closeMobileMenu}
                      className="block rounded-full border border-[#EBEBEB] px-4 py-3 text-center font-manrope text-sm font-medium text-[#484848]"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={closeMobileMenu}
                      className="block rounded-full bg-[#303030] px-4 py-3 text-center font-manrope text-sm font-medium text-white"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={menuItemVariants}
                    className="space-y-1 border-t border-[#F0F0F0] pt-4"
                  >
                    <Link
                      href="/dashboard"
                      onClick={closeMobileMenu}
                      className="block rounded-xl px-4 py-3 font-manrope text-sm text-[#484848] hover:bg-[#FAFAFA]"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={closeMobileMenu}
                      className="block rounded-xl px-4 py-3 font-manrope text-sm text-[#484848] hover:bg-[#FAFAFA]"
                    >
                      Profile
                    </Link>
                    {user?.role === "builder" ? (
                      <Link
                        href="/dashboard/property/create"
                        onClick={closeMobileMenu}
                        className="block rounded-xl px-4 py-3 font-manrope text-sm text-[#484848] hover:bg-[#FAFAFA]"
                      >
                        Add Property
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                      className="block w-full rounded-xl px-4 py-3 text-left font-manrope text-sm text-red-600 hover:bg-red-50"
                    >
                      Log out
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
      {hideOnScroll ? <div className="h-16 shrink-0" aria-hidden /> : null}
    </>
  );
}
