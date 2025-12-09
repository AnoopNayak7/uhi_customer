/**
 * WhatsApp Utilities
 * 
 * Provides utilities for generating WhatsApp links and tracking interactions
 */

import { pushToDataLayer } from './gtm';

export interface PropertyContactInfo {
  phone?: string;
  builderPhone?: string;
  contactPhone?: string;
  email?: string;
  builderEmail?: string;
  contactEmail?: string;
}

export interface PropertyInfo {
  id: string;
  title: string;
  address?: string;
  city?: string;
  location?: {
    address?: string;
  };
  price?: number;
  contactPhone?: string;
  builderPhone?: string;
  agent?: {
    name?: string;
    phone?: string;
  };
}

/**
 * Normalizes phone number to WhatsApp format (removes all non-digits)
 */
export const normalizePhoneNumber = (phone: string | undefined | null): string => {
  if (!phone) return '';
  // Remove all non-digit characters
  return phone.replace(/\D/g, '');
};

/**
 * Gets the contact phone number from property, with fallback priority
 */
export const getContactPhone = (property: PropertyInfo): string => {
  // Priority: agent phone > contactPhone > builderPhone > default
  return (
    property.agent?.phone ||
    property.contactPhone ||
    property.builderPhone ||
    '918762201252' // Default fallback
  );
};

/**
 * Formats property information for WhatsApp message
 */
export const formatPropertyMessage = (
  property: PropertyInfo,
  customMessage?: string
): string => {
  if (customMessage) {
    return customMessage;
  }

  const propertyName = property.title || 'Property';
  const location = property.location?.address || property.address || property.city || '';
  const price = property.price 
    ? `₹${(property.price / 100000).toFixed(1)} L` 
    : '';

  let message = `Hi, I'm interested in "${propertyName}"`;
  
  if (location) {
    message += ` located at ${location}`;
  }
  
  if (price) {
    message += ` priced at ${price}`;
  }
  
  message += `. Could you please provide more details and schedule a viewing? Thank you.`;
  
  return message;
};

/**
 * Generates WhatsApp URL with pre-filled message
 */
export const generateWhatsAppUrl = (
  phone: string,
  message: string
): string => {
  const normalizedPhone = normalizePhoneNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
};

/**
 * Opens WhatsApp chat with property information
 */
export const openWhatsAppChat = (
  property: PropertyInfo,
  customMessage?: string,
  options?: {
    trackEvent?: boolean;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
): void => {
  try {
    const phone = getContactPhone(property);
    const message = formatPropertyMessage(property, customMessage);
    const url = generateWhatsAppUrl(phone, message);
    
    // Track event if tracking is enabled
    if (options?.trackEvent !== false) {
      pushToDataLayer({
        event: 'whatsapp_click',
        property_id: property.id,
        property_title: property.title,
        property_city: property.city,
        property_price: property.price,
        contact_phone: phone,
      });
    }
    
    // Open WhatsApp in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Call success callback
    options?.onSuccess?.();
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Failed to open WhatsApp');
    console.error('Error opening WhatsApp:', err);
    options?.onError?.(err);
  }
};

/**
 * Opens WhatsApp chat for a phone call (tel: link)
 */
export const openPhoneCall = (
  phone: string,
  options?: {
    trackEvent?: boolean;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
): void => {
  try {
    const normalizedPhone = normalizePhoneNumber(phone);
    const telUrl = `tel:+${normalizedPhone}`;
    
    // Track event if tracking is enabled
    if (options?.trackEvent !== false) {
      pushToDataLayer({
        event: 'phone_call_click',
        contact_phone: normalizedPhone,
      });
    }
    
    // Open phone dialer
    window.location.href = telUrl;
    
    // Call success callback
    options?.onSuccess?.();
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Failed to initiate call');
    console.error('Error initiating phone call:', err);
    options?.onError?.(err);
  }
};

