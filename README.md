# SE-Project
# Online Event Ticketing System

## Project Overview
The **Online Event Ticketing System** is a full-stack web application designed to streamline the process of browsing, booking, and managing tickets for events. The system supports three user roles: **Standard User**, **Event Organizer**, and **System Admin**, each with distinct functionalities. Users can browse events, book tickets, and view their booking history, while organizers can manage events. The system admin has full control over users and events.

---

## Features
- **Homepage**: Displays a list of upcoming events with details such as event name, date, location, and price.
- **Event Details Page**: Offers detailed information about an event with a booking option.
- **Ticket Booking System**: Allows users to select the number of tickets, check availability, and proceed to checkout.
- **Search and Filter**: Facilitates event searches by name, category, date, or location.
- **User Dashboard**: Displays booked tickets and event history for users.
- **Admin Panel**: Enables event organizers to add, update, and delete events.
- **Database Integration**: Stores event details, user information, and bookings in MongoDB.

---

## User Roles
1. **Standard User**: 
   - Browse and search events.
   - Book tickets.
   - View booking history.

2. **Event Organizer**:
   - Create, update, and delete their own events.

3. **System Admin**:
   - Full control over the platform, including user and event management.

---

## Database Schemas
The system uses MongoDB to store data. The three primary schemas for the project are:

1. **User Schema**:
   - Fields: name, email, profile picture, password, role (Standard User, Organizer, or System Admin), and timestamp.
   - Description: Represents users with different roles in the system.

2. **Event Schema**:
   - Fields: title, description, date, location, category, image, ticket pricing, total tickets, remaining tickets, associated organizer, and timestamp.
   - Description: Stores event details and tracks ticket availability.

3. **Booking Schema**:
   - Fields: user, event, number of tickets, total price, booking status (pending, approved, or canceled), and timestamp.
   - Description: Records ticket bookings made by users and links them to events.


