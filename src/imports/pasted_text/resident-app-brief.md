Create a complete, polished, interactive MVP mobile application for apartment/residential community management called "The Lumina Residences".

IMPORTANT:
Use the existing reference design direction provided in this project as the primary visual reference. Preserve its visual identity rather than creating a generic property-management application.

The existing visual direction is:
- Mobile-first
- iOS-style interface
- Warm off-white/cream background
- Dark teal/green primary color
- Subtle neutral colors
- Rounded cards
- Clean modern typography
- Minimal line icons
- Premium, calm residential aesthetic
- Generous spacing
- Clean bottom navigation

This is a REAL PRODUCT MVP, not a concept or a collection of static screens. Design it as an application that could eventually be implemented, deployed, maintained, and scaled in production.

==================================================
1. PRODUCT
==================================================

The Lumina Residences is a mobile application for residents of an apartment/residential complex.

Residents should be able to:
- View their apartment information
- View apartment and utility payments
- Check payment status and history
- View payment details and receipts
- Reserve common areas
- Read building news and announcements
- Receive notifications
- Manage application preferences

MVP user role:
- Resident / Tenant

Keep the scope focused on the resident MVP. Do not create an admin dashboard.

==================================================
2. NAVIGATION
==================================================

Use a persistent bottom navigation with exactly five main sections:

1. Settings
2. Payments
3. Home
4. Reservation
5. News

Home is the default screen.

The selected navigation item must have a clear active state.

All navigation items must be interactive in the prototype.

==================================================
3. AUTHENTICATION
==================================================

Create:

SIGN IN
- The Lumina Residences branding
- Residential building illustration
- "Welcome Home"
- Apartment ID input
- Password input
- Show/hide password
- Remember me
- Forgot password
- "Sign In to Residence" button
- "Contact Management" option for new residents

Prototype:
Sign In → Home

Include appropriate validation/error states.

==================================================
4. HOME
==================================================

Create a resident dashboard based on the existing design.

Header:
- The Lumina Residences
- "Hello, Sarah Jenkins"
- "UNIT 402-B"
- View Details

Apartment / Amenity status:
- Pool
- Rooftop
- Other relevant amenity status

Utilities Overview:
- Water Utility
- Energy Utility
- Status
- Due date
- Amount

Latest News:
- Recent announcements
- "View All"

Include useful quick-access information while keeping the screen clean and uncluttered.

Cards should be interactive where appropriate.

==================================================
5. PAYMENTS
==================================================

Create a Payments screen.

Show:
- Apartment Tax
- Water Utility Tax
- Energy Utility Tax

Each payment card should include:
- Payment type
- Billing period
- Amount
- Status
- Due date

Statuses:
- PAID
- DUE
- FUTURE

Use clear visual indicators, but do not communicate status using color alone.

Prototype:
Payments → Payment Type Details

==================================================
6. PAYMENT DETAILS
==================================================

Create detail screens for:
- Apartment Tax
- Water Utility Tax
- Energy Utility Tax

Include:
- Back navigation
- Title
- Monthly payment grid
- January through December
- Paid / Due / Future states
- Payment amount where appropriate

Prototype:
Payment Type → Select Month → Monthly Payment Detail

==================================================
7. MONTHLY PAYMENT DETAIL
==================================================

Create a detailed payment statement screen.

Include:
- Month
- Payment status
- Total amount
- Due date
- Paid date
- Payment breakdown
- Base charge
- Maintenance
- Insurance
- Other applicable charges
- Total statement
- Payment method
- Download Receipt

Example:
Apartment Tax
January 2026
$185.00
PAID

Make the payment status and total amount highly visible.

The "Download Receipt" action should have a realistic success/feedback state in the prototype.

==================================================
8. RESERVATIONS
==================================================

Create a Common Areas reservation screen.

Available amenities:
- Gym
- Rooftop
- Pool

Each amenity card should include:
- High-quality image
- Name
- Availability
- Short description
- Reserve button

Example:
Gym
Open • 5 active bookings
Reserve

Prototype:
Reservation → Amenity → Booking

==================================================
9. RESERVATION BOOKING
==================================================

Create a booking screen.

Include:
- Selected amenity
- Date selector
- Available dates
- Time slots
- Selected time state
- Unavailable time slots
- Confirm Reservation button

Example time slots:
9:00 AM
10:00 AM
11:00 AM
2:00 PM
3:00 PM
4:00 PM

Unavailable slots should look disabled.

Prototype flow:

Reservation
→ Select Gym
→ Select Date
→ Select Time
→ Confirm Reservation
→ Reservation Success
→ Reservation Details

After confirmation, show:
- Success state
- Amenity
- Date
- Time
- Reservation status

==================================================
10. NEWS & UPDATES
==================================================

Create a News & Updates screen.

Category filters:
- All
- Water
- Gas
- Energy
- General

News cards should include:
- Category
- Title
- Date
- Short description
- Image when appropriate
- Featured indicator when appropriate

Use realistic examples:

"Scheduled Water Main Maintenance"
"Gas System Safety Certification"
"Electric Vehicle Charger Upgrade"
"Main Entrance Awning Repairs"

Prototype:
News → News Item → News Detail

==================================================
11. NEWS DETAIL
==================================================

Create a detailed news/announcement screen.

Include:
- Back navigation
- Category
- Title
- Date
- Main image
- Full announcement content
- Important information

Include read/unread behavior in the prototype where appropriate.

==================================================
12. SETTINGS
==================================================

Create the Settings screen following the existing visual style.

Sections:

ACCOUNT
- Account
- Notifications
- Language
- Preferences
- Feedback
- Logout

Each item should have an appropriate icon and navigation behavior.

Logout should require confirmation.

==================================================
13. PREFERENCES
==================================================

Create Preferences.

DISPLAY
- Font Size
- Small
- Default
- Large
- Dark Mode
- Accent Tone

NOTIFICATIONS
- Push Notifications
- Email Digests
- Quiet Hours

LANGUAGE
- App Language

Make toggles, selections, and controls interactive in the prototype.

==================================================
14. DESIGN SYSTEM
==================================================

Create and consistently use a reusable design system.

Use:
- Design tokens
- Auto Layout
- Reusable components
- Component variants
- Responsive constraints
- Consistent spacing
- Consistent typography
- Consistent colors
- Consistent border radius
- Consistent shadows
- Consistent iconography

Create reusable components for:

- Buttons
- Text fields
- Password fields
- Search
- Cards
- Payment cards
- Status badges
- Navigation
- Bottom navigation
- List items
- Toggles
- Tabs
- Category filters
- Date selectors
- Time slots
- Modals
- Confirmation dialogs
- Toasts
- Alerts
- Success states
- Error states
- Loading states
- Empty states

Use meaningful component/layer names.

Avoid unnecessary one-off components.

==================================================
15. UX STATES
==================================================

Design realistic states for important components and screens:

- Default
- Hover where applicable
- Pressed
- Selected
- Disabled
- Loading
- Success
- Error
- Empty
- Paid
- Due
- Future
- Available
- Unavailable
- Read
- Unread

Important actions must provide appropriate feedback.

==================================================
16. RESPONSIVE DESIGN
==================================================

The primary experience is mobile.

Design for:
- iPhone-sized screens
- Different mobile screen sizes
- Tablet where appropriate

Use Auto Layout and responsive constraints.

Respect:
- Safe areas
- Touch targets
- Screen edges
- Keyboard behavior
- Long content

Do not simply shrink desktop layouts.

==================================================
17. ACCESSIBILITY
==================================================

Follow WCAG-oriented accessibility principles.

Use:
- Good contrast
- Clear labels
- Clear hierarchy
- Accessible controls
- Large enough touch targets
- Visible selected/focus states
- Clear error messages

Do not rely only on color to communicate status.

==================================================
18. INTERACTIVE PROTOTYPE — REQUIRED
==================================================

DO NOT CREATE ONLY STATIC SCREENS.

Create a fully connected interactive MVP prototype.

Every important button, navigation item, card, tab, filter, toggle, date selector, time slot, and action should behave realistically.

Implement these complete flows:

FLOW 1 — LOGIN

Sign In
→ Home


FLOW 2 — PAYMENT

Home
→ Payments
→ Apartment Tax
→ January 2026
→ Payment Details
→ Download Receipt
→ Success Feedback


FLOW 3 — RESERVATION

Home
→ Reservation
→ Gym
→ Select Date
→ Select Time
→ Confirm Reservation
→ Success
→ Reservation Details


FLOW 4 — NEWS

Home
→ News
→ Select Announcement
→ News Detail
→ Back


FLOW 5 — SETTINGS

Home
→ Settings
→ Preferences
→ Change Font Size
→ Toggle Dark Mode
→ Notification Settings


FLOW 6 — BOTTOM NAVIGATION

Make all five navigation items functional:

Settings
↔ Payments
↔ Home
↔ Reservation
↔ News


FLOW 7 — BACK NAVIGATION

Every detail screen must have working back navigation that returns to the appropriate previous screen.


FLOW 8 — INTERACTIVE STATES

Demonstrate:
- Selected/unselected states
- Active/inactive navigation
- Paid/Due/Future payments
- Available/unavailable reservation slots
- Toggle ON/OFF
- Read/unread news
- Loading
- Success
- Error
- Empty states
- Confirmation dialogs


FLOW 9 — REALISTIC DATA

Use realistic sample data throughout the application.

When a user performs an important action, update the visible state where appropriate.

For example:

User confirms a Gym reservation
→ show reservation success
→ show reservation details
→ selected time becomes reserved/unavailable


==================================================
19. VISUAL QUALITY
==================================================

Keep the existing visual identity.

The application should feel:

Premium
Calm
Modern
Residential
Minimal
Professional
Trustworthy

Use:
- Warm off-white/cream backgrounds
- Dark teal/green primary color
- Neutral supporting colors
- Subtle borders
- Soft shadows
- Moderate corner radius
- Clean typography
- Simple icons
- High-quality residential imagery

Avoid:
- Excessive gradients
- Excessive animations
- Bright saturated colors
- Excessive glassmorphism
- Dense layouts
- Unnecessary charts
- Decorative elements without purpose
- Generic SaaS dashboard aesthetics


==================================================
20. PRODUCT QUALITY
==================================================

This must feel like a real application, not an AI-generated mockup.

Prioritize:
- Consistency
- Usability
- Clear information hierarchy
- Realistic content
- Natural navigation
- Reusable components
- Complete user flows
- Accessibility
- Maintainability
- Scalability

Do not create random additional features.

Do not create disconnected screens.

Do not create unnecessary screens just to increase the number of screens.

Do not redesign the application into an admin/property-management dashboard.

Focus on a polished resident MVP.

FINAL GOAL:

Deliver a complete, polished, interactive mobile MVP for The Lumina Residences with:

1. Consistent design system
2. Complete core screens
3. Reusable components
4. Realistic data
5. Responsive mobile layouts
6. Complete user flows
7. Interactive prototype
8. Realistic UI states
9. Professional UX
10. Developer-friendly structure

The result should look and behave like a real resident application that can later be connected to a production backend, API, authentication system, database, and payment/reservation services.