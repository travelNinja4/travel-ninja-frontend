---
sidebar_position: 5
title: Customers
---

# Customers

The **Customers** screen lists the guests who have booked your tours. It's the agency's guest book: who they are, how to reach them, how much they've spent and when they last travelled, so staff can follow up with repeat guests or answer a guest's call quickly.

**Who uses it:** operations and sales staff · **Where to find it:** **Customers** in the side menu

![The Customers table listing guests with their contact details, city, bookings, total spend and last trip](/img/screens/customers/default.png)

## The customers table

Each row is one guest:

| Column          | What it shows                              |
| --------------- | ------------------------------------------ |
| **Customer**    | The guest's name                           |
| **Contact**     | Their email and mobile number              |
| **City**        | The city they're from (`—` if not entered) |
| **Bookings**    | How many tours they've booked              |
| **Total spend** | How much they've spent across all bookings |
| **Last trip**   | Their most recent tour                     |

The table shows one page of customers at a time. Use the page buttons at the bottom to move between pages.

## Search for a customer

Type in **Search by name, email, or city...** above the table. The results update once you stop typing. Clear the box to see everyone again.

## Filter by city

Choose a city from the **All cities** dropdown to see only guests from that city. Choose **All cities** to remove the filter.

Search and the city filter work together. For example, you can search for "Sneha" among guests from Chennai.

![Searching for sneha among guests from Chennai finds one guest](/img/screens/customers/filtered.png)

:::tip
Searching or changing the city always takes you back to the first page of results.

Your search, city and page are kept in the page address, so you can bookmark or share a filtered list, and the browser's **Back** button returns to your previous city filter.
:::

## View a customer's details

Click **View** at the end of a row. A panel opens on the right with:

- Email and mobile number
- City
- Number of bookings and total spend
- Last trip and its date

Close it with the **×** button, the **Esc** key, or by clicking outside the panel.

## Messages you might see

| Message                             | What it means                                               |
| ----------------------------------- | ----------------------------------------------------------- |
| **No customers yet**                | Nobody has booked a tour yet.                               |
| **No customers match your search**  | Nothing matches your search or city. Try different terms.   |
| **No customers on this page**       | The page number is past the last page. Go back a page.      |
| **We couldn't load your customers** | Something went wrong loading the list. Click **Try again**. |

![No customers match your search, after searching for zzz](/img/screens/customers/no-matches.png)

## Business rules

- A guest appears here once they've booked one of the agency's tours.
- **City** shows **—** when the guest didn't enter one.
- **Total spend** adds up all of the guest's bookings with the agency.

## Related modules

- [Tours](./tours.md): the trips shown under **Last trip**.
- [Bookings](./bookings.md): the bookings behind each guest's count and spend.

## Things to check when testing

- [ ] Each row shows the guest's name, email and mobile number, city (or **—**), bookings, total spend and last trip with its date.
- [ ] Search finds guests by name, email or city, once typing stops.
- [ ] The city filter shows only guests from that city, and works together with search.
- [ ] Searching or changing the city returns to page 1.
- [ ] The page address keeps the search, city and page, and **Back** returns to the previous city.
- [ ] **View** opens the details panel, and **×**, **Esc** and clicking outside all close it.
- [ ] Each message in the table above appears in its situation.
