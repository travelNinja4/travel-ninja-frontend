---
sidebar_position: 1
title: Finding your way around
---

# Finding your way around

Once signed in, every Travel Ninja screen shares the same frame: a side menu on the left to move between modules, and a header along the top that shows where you are.

**Who uses it:** everyone, on every screen

![The side menu, grouped into Operations, Engage, Insights and Account, with the agency name and Sign out at the bottom, and the page header showing Dashboard](/img/screens/overview/side-menu.png)

## The side menu

The menu groups the modules by what the agency is doing:

| Group          | Items                                                                                 |
| -------------- | ------------------------------------------------------------------------------------- |
| **Operations** | **Dashboard**, **Tours**, **Bookings**, **Customers**, **Calendar**, **Availability** |
| **Engage**     | **Messages**, **Reviews**                                                             |
| **Insights**   | **Tour performance**, **Revenue**                                                     |
| **Account**    | **Settings**, **Billing & payouts**                                                   |

The screen you're on is highlighted. The bottom of the menu shows the agency's name and plan, and **Sign out**.

### On different screen sizes

- **Computer:** the menu is open. Click the arrow at its top edge to shrink it to icons (**Collapse sidebar**), and again to open it (**Expand sidebar**).
- **Tablet:** the menu starts as a narrow strip of icons. Use the same arrow to open it.
- **Phone:** the menu is hidden. Tap the menu button (**Open navigation**) to slide it in, and close it when you've picked a screen.

### Menu items that are coming soon

Only **Dashboard**, **Tours**, **Bookings** and **Customers** have screens today. **Calendar**, **Availability**, **Messages**, **Reviews**, **Tour performance**, **Revenue**, **Settings** and **Billing & payouts** are planned. Clicking them opens a **This trail doesn't exist** page with a **Back to dashboard** button.

## The page header

- **Breadcrumb** (top left): your position, always starting from **Dashboard**, for example _Dashboard / Tours / New_. Click an earlier part to go back up.
- **Moon / sun icon**: switches between light and dark mode. Travel Ninja remembers your choice on that device; until you pick one, it follows your device's setting.
- **Bell icon**: reserved for notifications. It doesn't open anything yet.

## Signing out

Click **Sign out** at the bottom of the side menu. You're returned to the sign-in page. See [Sign in and out](../getting-started/sign-in.md).

## If you lose your internet connection

![You're offline! Please reconnect to the internet to continue. Waiting for connection...](/img/screens/overview/offline.png)

When the device goes offline, Travel Ninja replaces the screen with **You're offline!** and waits. Your screen comes back as soon as the connection returns.

## A page that doesn't exist

An old link or a mistyped address opens **This trail doesn't exist**. Click **Back to dashboard** to carry on.

## Known limitations

- The agency name and plan at the bottom of the menu currently always show **Wanderly Travels** and **Professional plan**, whatever agency is signed in.
- The **Messages** count is a sample number.

## Things to check when testing

- [ ] Each working menu item (**Dashboard**, **Tours**, **Bookings**, **Customers**) opens its screen and is highlighted.
- [ ] Coming-soon items open **This trail doesn't exist**, and **Back to dashboard** works.
- [ ] Collapse and expand the menu on a computer; check it starts as icons on a tablet and hidden on a phone.
- [ ] The breadcrumb matches the screen, and its earlier parts are clickable.
- [ ] Dark mode switches the whole app and is remembered after a page reload.
- [ ] Turning off the network shows **You're offline!**; turning it on brings the screen back.
- [ ] **Sign out** returns to the sign-in page.
