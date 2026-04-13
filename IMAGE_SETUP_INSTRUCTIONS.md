# Employee Image Setup Instructions

## Issue Fixed
The image paths have been corrected from `/dist/emp/` to `/emp/`. The `/public/emp/` directory has been created.

## Next Step: Add Images

To display technician images, add the following image files to `/public/emp/`:

1. **engine.webp** - Sanoar Rahman (Engine Expert)
2. **sakib.webp** - Sakib Hasan (Dent Expert)
3. **forhad.webp** - Forhad Hosen (AC Electric Specialist)
4. **amir.webp** - Amir Rahman (Senior Technician)

## Image Requirements
- **Format**: WebP (preferred) or JPG/PNG
- **Dimensions**: Recommended 400x256px (or any 16:9 ratio)
- **Location**: `/public/emp/` folder

## After Adding Images
1. Save the images in `/public/emp/`
2. Run `npm run dev` to see images in the dev server
3. The images will automatically appear in the "Our Expert Team" section on the Services page

## File Structure
```
/public/emp/
  ├── engine.webp     (Sanoar Rahman)
  ├── sakib.webp      (Sakib Hasan)
  ├── forhad.webp     (Forhad Hosen)
  └── amir.webp       (Amir Rahman)
```

## Code Changes Made
- Updated `src/pages/ServicesPage.tsx` (lines 325-368)
- Changed image paths from `/dist/emp/` → `/emp/`
- Created `/public/emp/` directory structure
