# How to Add Your Logo

## Step 1: Add Your Logo File

1. Create a `public` folder in the `frontend` directory (if it doesn't exist)
2. Place your logo file in `frontend/public/logo.png` or `frontend/public/logo.svg`

**Recommended:**
- **Format**: SVG (scalable) or PNG (with transparency)
- **Size**: 
  - For best results: 512x512px (will be scaled down)
  - Minimum: 256x256px
- **Background**: Transparent

## Step 2: Enable the Logo in Components

Once you've added your logo file, uncomment the Image components in these files:

### 1. Navbar (`frontend/components/Navbar.tsx`)
- Line ~27-32: Uncomment the Image component
- Comment out or remove the Sparkles icon fallback

### 2. Sidebar Footer (`frontend/components/Sidebar.tsx`)
- Line ~127-132: Uncomment the Image component
- Comment out or remove the Sparkles icon fallback

### 3. Welcome Screen (`frontend/app/page.tsx`)
- Line ~141-146: Uncomment the Image component
- Comment out or remove the Sparkles icon fallback

## Step 3: Customize Logo Sizes (Optional)

You can adjust the logo sizes in each component:

**Navbar:**
```tsx
<Image 
  src="/logo.png" 
  alt="AI On-Call Engineer Logo" 
  width={32}    // Adjust size here
  height={32}   // Adjust size here
  className="object-contain"
/>
```

**Sidebar:**
```tsx
<Image 
  src="/logo.png" 
  alt="Logo" 
  width={16}    // Smaller for sidebar
  height={16}
  className="object-contain"
/>
```

**Welcome Screen:**
```tsx
<Image 
  src="/logo.png" 
  alt="AI On-Call Engineer Logo" 
  width={80}    // Larger for welcome screen
  height={80}
  className="object-contain"
/>
```

## Example: Complete Logo Implementation

After adding `logo.png` to `frontend/public/`, update the Navbar like this:

```tsx
<div className="flex items-center gap-2">
  <div className="relative w-8 h-8 flex items-center justify-center">
    <Image 
      src="/logo.png" 
      alt="AI On-Call Engineer Logo" 
      width={32} 
      height={32}
      className="object-contain"
    />
  </div>
  <span className="font-bold text-lg text-gray-900">AI On-Call Engineer</span>
</div>
```

## Quick Start

1. **Add logo file**: `frontend/public/logo.png`
2. **Uncomment Image components** in the 3 files mentioned above
3. **Remove or comment out** the Sparkles icon fallbacks
4. **Rebuild**: `npm run build` or `npm run dev`

## Logo Locations Summary

| Location | File | Line Range |
|----------|------|------------|
| Navbar | `components/Navbar.tsx` | ~27-32 |
| Sidebar Footer | `components/Sidebar.tsx` | ~127-132 |
| Welcome Screen | `app/page.tsx` | ~141-146 |

Your logo will appear in all three locations once enabled!

