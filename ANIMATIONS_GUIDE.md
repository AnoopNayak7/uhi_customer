# Animation System Guide

This guide explains the comprehensive animation system implemented in your UrbanHouseIN app using Framer Motion.

## 🎯 Features Implemented

### 1. Page Transitions
- **Smooth page transitions** with fade-in effects
- **Layout wrapper** for consistent page loading animations
- **Mobile-optimized** transitions with reduced motion
- **Fixed navigation issues** - no more blank screens when going back

### 2. Component Animations
- **Button hover and tap animations** with spring physics
- **Card hover effects** with elevation and scale
- **Property card animations** with staggered loading
- **Hero section animations** with sequential reveals

### 3. Mobile Optimizations
- **Reduced motion** for better performance on mobile devices
- **Touch-friendly interactions** with haptic feedback
- **Swipe gestures** for dismissing components
- **Pull-to-refresh** functionality
- **Optimized stagger delays** for mobile

### 4. Advanced Features
- **Scroll-triggered animations** with intersection observer
- **Parallax effects** (mobile-optimized)
- **Loading animations** and skeletons
- **Filter animations** with smooth expand/collapse

## 🚀 How to Use

### Basic Motion Wrapper
```tsx
import { MotionWrapper } from '@/components/animations/motion-wrapper';

<MotionWrapper variant="fadeInUp" delay={0.2}>
  <YourComponent />
</MotionWrapper>
```

### Page Content Wrapper
```tsx
import { PageContent } from '@/components/animations/layout-wrapper';

<PageContent>
  <YourPageContent />
</PageContent>
```

### Available Variants
- `fadeInUp` - Fade in from bottom
- `fadeInDown` - Fade in from top
- `fadeInLeft` - Fade in from left
- `fadeInRight` - Fade in from right
- `scaleIn` - Scale in from center
- `slideInUp` - Slide in from bottom

### Staggered Animations
```tsx
import { StaggerContainer, StaggerItem } from '@/components/animations/motion-wrapper';

<StaggerContainer>
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
  <StaggerItem>Item 3</StaggerItem>
</StaggerContainer>
```

### Card Hover Effects
```tsx
import { CardHover } from '@/components/animations/page-transitions';

<CardHover>
  <Card>Your content</Card>
</CardHover>
```

### Button Animations
Buttons automatically have hover and tap animations. To disable:
```tsx
<Button animate={false}>No Animation</Button>
```

### Mobile-Specific Components
```tsx
import { MobileFadeIn, TouchButton } from '@/components/animations/mobile-animations';

<MobileFadeIn delay={0.1}>
  <Content />
</MobileFadeIn>

<TouchButton onClick={handleClick} haptic={true}>
  Touch Me
</TouchButton>
```

### Property List Animations
```tsx
import { AnimatedPropertyGrid } from '@/components/animations/animated-property-list';

<AnimatedPropertyGrid loading={loading}>
  {properties.map(property => <PropertyCard key={property.id} {...property} />)}
</AnimatedPropertyGrid>
```

## 🎨 Animation Presets

### Transitions
- `smooth` - Smooth cubic bezier (0.6s)
- `spring` - Spring physics
- `bounce` - Bouncy spring
- `fast` - Quick transition (0.3s)
- `slow` - Slow transition (1s)

### Usage
```tsx
<MotionWrapper variant="fadeInUp" transition="spring">
  <Content />
</MotionWrapper>
```

## 📱 Mobile Optimizations

The animation system automatically detects mobile devices and:
- Reduces animation duration by 50%
- Uses simpler easing functions
- Reduces parallax effects
- Optimizes stagger delays
- Provides haptic feedback for touch interactions

## 🔧 Performance Tips

1. **Use `AnimatePresence`** for components that mount/unmount
2. **Prefer transforms** over changing layout properties
3. **Use `will-change: transform`** for frequently animated elements
4. **Reduce motion** on mobile for better performance
5. **Use `viewport={{ once: true }}`** for scroll-triggered animations

## 🎯 Components Updated

### Pages
- ✅ Home page with section reveals
- ✅ Properties page with animated listings
- ✅ All pages have smooth transitions

### Components
- ✅ Hero section with staggered animations
- ✅ Property cards with hover effects
- ✅ Buttons with spring animations
- ✅ Property listings with grid animations

### UI Components
- ✅ Button component with built-in animations
- ✅ Card components with hover effects
- ✅ Loading states with smooth transitions

## 🚀 Next Steps

To add animations to new components:

1. Import the appropriate animation component
2. Wrap your content with motion wrappers
3. Choose suitable variants and transitions
4. Test on both desktop and mobile
5. Consider performance implications

## 🐛 Troubleshooting

### Common Issues
1. **Animations not working**: Ensure Framer Motion is properly imported
2. **Performance issues**: Reduce animation complexity on mobile
3. **Layout shifts**: Use transforms instead of changing dimensions
4. **Stutter on mobile**: Enable hardware acceleration with `transform3d`

### Debug Mode
Add this to see animation boundaries:
```tsx
<motion.div style={{ border: '1px solid red' }}>
  Your animated content
</motion.div>
```

## 📚 Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Animation Performance Guide](https://web.dev/animations-guide/)
- [Mobile Animation Best Practices](https://developers.google.com/web/fundamentals/design-and-ux/animations)

---

Your app now has a comprehensive animation system that provides smooth, performant animations across all devices! 🎉
