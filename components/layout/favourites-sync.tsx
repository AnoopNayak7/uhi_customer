"use client";

import { useFavouritesSync } from '@/hooks/use-favourites-sync';

export function FavouritesSync() {
  useFavouritesSync();
  return null;
}
