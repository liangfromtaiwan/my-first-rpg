# Design System Updates - 2026-02-20

## 📋 Summary of Changes

This document records all updates made to the company-design-system skill.

---

## 🎨 Component Updates

### 1. Sidebar Navigation

#### Dimensions
| Property | Old Value | New Value |
|----------|-----------|-----------|
| Width (expanded) | 240px | **256px** |
| Width (collapsed) | 64px | 64px (unchanged) |

#### Colors
| Element | Old Value | New Value |
|---------|-----------|-----------|
| Background | White | **`var(--colors-sand-1)`** (#fdfdfc - Warm Neutral/Neutral 1) |
| Border-right | `var(--colors-gray-alpha-6)` | **`var(--colors-sand-3)`** (#f1f2f2 - Warm Neutral/Neutral 3) |

#### Tooltip (Collapsed State)
Added detailed tooltip specifications when sidebar is collapsed:
- **Position**: Right side of icon (left: 64px)
- **Background**: `var(--colors-sand-12)` (dark)
- **Text color**: `var(--tokens-colors-white-contrast)` (white)
- **Font-size**: 13px
- **Font-weight**: 500
- **Padding**: 8px 12px (`var(--spacing-2)` `var(--spacing-3)`)
- **Border-radius**: 4px (`var(--radius-2)`)
- **Offset**: 8px from sidebar (`var(--spacing-2)`)
- **Animation**: fade in 150ms ease
- **Arrow**: No arrow/caret
- **Content**: Menu item label (e.g., "ダッシュボード", "グループ")

---

### 2. Top Header Bar

#### Dimensions
| Property | Old Value | New Value |
|----------|-----------|-----------|
| Height | 64px | **56px** |

#### Colors
| Element | Old Value | New Value |
|---------|-----------|-----------|
| Background | White | **`var(--colors-sand-1)`** (#fdfdfc - Warm Neutral/Neutral 1) |
| Border-bottom | `var(--colors-gray-alpha-6)` | `var(--colors-gray-alpha-6)` (unchanged) |

---

### 3. Drawer Form

#### Dimensions
| Property | Old Value | New Value |
|----------|-----------|-----------|
| Width | 560px | **720px** |

#### Colors
| Element | Old Value | New Value |
|---------|-----------|-----------|
| Background | White | **`var(--colors-sand-1)`** (#fdfdfc - Warm Neutral/Neutral 1) |
| Box-shadow | `-4px 0 12px rgba(0,0,0,0.1)` | `-4px 0 12px rgba(0,0,0,0.1)` (unchanged) |

**Note**: Shadow-4 reference was mentioned but value not yet defined in all-variables.css

---

## 🎯 New Additions

### 1. Semantic Tokens Layer (Added at line 88)

Added complete semantic token system (`--sem-*`) as the primary token layer:

**Key Benefits:**
- More intuitive naming (e.g., `--sem-btn-primary-bg` vs `--colors-blue-9`)
- Better maintainability
- Clear component-level semantics

**Major Categories:**
- Brand/Accent colors
- Neutrals (Canvas/Surface)
- Text hierarchy
- Borders/Dividers
- Interactive states (hover, active, selected)
- Feedback (success, warning, danger, info)
- Component-specific (buttons, inputs, tables, badges)
- Layout scale (spacing, radius, typography)

**Quick Reference Table:**
Includes 20+ common use cases with `--sem-*` → primitive token mapping

---

### 2. Admin Layout Grid Contract (Added at line 1369)

Comprehensive grid system for all admin pages:

**Global Container:**
- Max width: 1440px
- Horizontal padding: 24px (`--sem-space-6`)
- Vertical spacing: `--sem-space-8`

**Desktop Grid (≥1024px):**
- 12-column system
- Column width: 32px each
- Gap: 20px
- **Allowed spans only**: 12 / 8 / 6 / 4 / 3 (no arbitrary values)

**Component Rules:**
- Main content: 8–12 columns
- Sidebar panel: 3–4 columns
- Form fields: 12 (full) / 6 (half) / 4 (third)

**Table Rules:**
- Full container width (span 12)
- Action column: 80–120px, right-aligned
- Horizontal scroll if overflow

**Responsive Breakpoints:**
- Mobile (<768px): 1 column
- Tablet (768–1023px): 8 columns
- Desktop (≥1024px): 12 columns

**Vertical Spacing:**
- Major blocks: `--sem-space-8` (48px)
- Related groups: `--sem-space-6` (32px)
- Form fields: `--sem-space-4` (16px)

**Sidebar Behavior:**
- Desktop expanded: 256px
- Desktop collapsed: 64px
- Mobile: overlay drawer with backdrop

**Dialog Widths:**
- Small: 400px
- Medium: 600px
- Large: 800px

---

## 📊 Updated Usage Guidelines (Line 1454)

### Token Priority System

Updated to prioritize semantic tokens:

```
1st: --sem-*                      ← 優先使用 (MOST RECOMMENDED)
2nd: --tokens-*                   ← Component-specific tokens
3rd: --spacing-*, --radius-*      ← Primitive spacing/radius
4th: --colors-*                   ← Only when no semantic equivalent
❌ Never: hardcoded values
```

### Updated Color Usage Table

Replaced raw token references with semantic equivalents:

| Use Case | ✅ Use This | ❌ Not This |
|----------|-------------|-------------|
| Primary button | `--sem-btn-primary-bg` | `--colors-blue-9` |
| Danger button | `--sem-btn-danger-bg` | `--colors-red-9` |
| Page background | `--sem-bg-canvas` | `#f5f5f5` |
| Card background | `--sem-layer-1` | `white` |
| Primary text | `--sem-text-primary` | `--colors-gray-alpha-12` |
| Borders | `--sem-border-default` | `--colors-gray-alpha-6` |

---

## 📈 File Statistics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total lines | 1,224 | 1,519 | +295 lines |
| DESIGN TOKENS | Line 12 | Line 12 | (unchanged) |
| **SEMANTIC TOKENS** | — | **Line 88** | ✅ NEW |
| COMPONENT LIBRARY | Line 86 | Line 283 | (moved) |
| **ADMIN LAYOUT GRID** | — | **Line 1369** | ✅ NEW |
| USAGE GUIDELINES | Line 1189 | Line 1454 | (moved) |

---

## 🎯 Design Rationale

### Why Warm Neutral/Neutral 1 (#fdfdfc)?

Instead of pure white (#ffffff), we use a warm near-white:
- **Better visual comfort**: Reduces eye strain
- **Warm tone**: Matches "Sand" palette (warmer than "Slate")
- **Subtle distinction**: Creates depth without borders
- **Professional**: Modern admin interfaces use off-white

### Why 256px Sidebar?

- **Better content fit**: More room for Japanese labels
- **16px alignment**: 256 = 16 × 16 (clean grid math)
- **Icon + text balance**: Comfortable padding without cramping

### Why 720px Drawer?

- **Form comfort**: Wide enough for two-column layouts
- **Desktop standard**: Common drawer width in modern UIs
- **Content visibility**: Background content still visible

### Why 56px Header?

- **Content density**: More vertical space for main content
- **Modern proportion**: Aligns with Material Design 3 / Fluent 2
- **Matches toolbar height**: Common button height (32px) + padding

---

## 🔍 Implementation Notes

### For Developers

When implementing components:

1. **Always check semantic tokens first**
   ```css
   /* ✅ GOOD */
   background: var(--sem-btn-primary-bg);
   
   /* ❌ AVOID */
   background: var(--colors-blue-9);
   ```

2. **Follow grid contract strictly**
   - Only use allowed column spans: 12 / 8 / 6 / 4 / 3
   - Use spacing tokens for all margins/padding
   - No arbitrary widths

3. **Sidebar tooltip implementation**
   - Use Radix UI Tooltip component
   - Apply semantic tokens for styling
   - 150ms fade animation
   - No arrow prop

### For Designers

When creating mockups:
- Background: #fdfdfc (Warm Neutral/Neutral 1)
- Sidebar: 256px
- Header: 56px
- Drawer: 720px
- Use 12-column grid overlay
- Spacing: multiples of 4px only

---

## ✅ Validation Checklist

When creating new admin pages, verify:

- [ ] Sidebar width is 256px (expanded) / 64px (collapsed)
- [ ] Header height is 56px
- [ ] Background color is `var(--colors-sand-1)`
- [ ] Using semantic tokens (`--sem-*`) for colors
- [ ] Following 12-column grid with allowed spans only
- [ ] Vertical spacing uses `--sem-space-*` tokens
- [ ] Drawer width is 720px (if used)
- [ ] Tooltip appears on collapsed sidebar hover
- [ ] All interactive states defined (hover, active, focus)

---

## 📝 Future Considerations

### Pending Decisions

1. **Shadow-4 Definition**
   - Need to add to all-variables.css
   - Suggested value: `0 8px 24px rgba(0,0,0,0.12)`

2. **Dark Mode Support**
   - Semantic tokens ready for theme switching
   - Need to define dark mode color mappings

3. **Additional Semantic Categories**
   - Consider adding: `--sem-nav-*`, `--sem-card-*`, `--sem-form-*`

---

## 🔗 Related Files

- `/mnt/skills/user/company-design-system/SKILL.md` (updated)
- `/mnt/skills/user/company-design-system/assets/all-variables.css` (reference)
- `/mnt/skills/user/company-design-system/examples/Platform/` (screenshots)

---

**Last Updated**: 2026-02-20  
**Updated By**: Design System Team  
**Version**: 2.0
