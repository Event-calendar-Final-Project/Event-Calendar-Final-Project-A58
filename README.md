# Event-Calendar-Final-Project-A58
Event-Calendar
# Event-Calendar-Final-Project-A58

Welcome to the Event-Calendar project!

The Event-Calendar project is a web application that allows users to manage and keep track of events. It provides features such as creating, editing, and deleting events, as well as displaying event details and managing event attendees.
# Event-Calendar-Final-Project-A58
Event-Calendar

Welcome to the Event-Calendar project!

The Event-Calendar project is a web application that allows users to manage and keep track of events. It provides features such as creating, editing, and deleting events, as well as displaying event details and managing event attendees.

Functional Requirements:

Entities:
- Authentication is handled by Firebase, so there is no need for an auth entity.
- Each user must have a unique username, email, phone number, and photo. Users should also have a first name and a last name.
- Usernames must be between 3 and 30 characters and must be unique.
- Email addresses must be valid and unique in the system.
- Passwords must be between 8 and 30 characters and must include at least one number and one symbol.
- First and last names must be between 1 and 30 characters and must only include uppercase and lowercase letters.
- Phone numbers must have 10 digits and must be unique in the system.
- Users can optionally have an address.

Events:
- Events must have an ID, title, start date and time, end date and time, and a list of invited participants (which should include only the event creator if it's a private event with no other participants).
- Titles must be between 3 and 30 characters.
- Events must have at least one participant (the creator).
- Events can be part of a series of recurring events.
- Events can be public or private.
- Events can have a location, and a map can be attached to the location using a maps API.
- Events can have a description, which must be at most 500 characters.
- Events can display the weather on the day of the event at the event's location using a weather API.

Contacts Lists:
- Contacts lists must have an ID, an owner, and a list of contacts.
- Contacts lists can have a name (e.g., "Work Contacts", "Personal Friends", etc.).

Public Part:
- The public part of the application must be accessible without authentication.
- It should provide registration functionality and a login form for users to authenticate using their username and password.
- Anonymous users must be able to register and login.
- The public part should have a search functionality for public events.
- The public page can display information about the current weather at the user's location.

Private Part:
- The private part of the application is only accessible to authenticated users.
- Registered users have a private area that they can access after successful login, where they can view their calendar.
- The private area includes a logout button that redirects the user to the public landing page.
- The calendar supports different standard views such as day, week, month, and work week. External libraries should not be used for the calendar views.

Individual User Requirements:
- Users can view and edit their personal information, including their first and last name, phone number, address, and avatar picture.
- Users cannot edit their username.
- Users can search for other users by their name, phone number, and/or email.
- Users can invite users from their contact lists to events.
- Users can accept or decline invitations (notification functionality needs to be researched).
- Users can have a global preference to not be invited to events unless they manually allow it through their preference settings.

Event Requirements:
- Events must be created by a user, and that user becomes the event's creator.
- Users can create or participate in multiple events.
- The event creator can invite or disinvite other participants.
- Each event has its own page/view where information about the event is visible, including a cover photo, location, list of participants, description, and start/end date and time.
- Other event participants can invite additional participants if the event creator has given them the right to do so.
- Events can have a draft option, allowing users to save events as drafts and easily select them from a list of drafts later when creating similar events.
- Events can have reminders to notify participants at a certain time before the event.
Series of events requirements:
- A series of events must have a name and a starting event.
- A series of events must either have an ending event or run indefinitely.
- A series of events must be able to be scheduled on a weekly/monthly/yearly basis, e.g., "Pay phone bill" on every 1st number of the month.
- A series of events could have the option to be manually scheduled on different days and hours by the user, e.g., "AC Milan season 2022/2023 schedule", wherein the team plays every week, but always on a different day, with a different starting time and in a different location, all manually set by the user.

Administrative part:
Accessible to users with administrative privileges.
- Admin users must be able to search for users by username, first and last name, email. Lists of users should support pagination or infinite scroll functionality.
- Admin users must be able to block and unblock individual users. Blocked users must not be able to login.
- Admin users must be able to search for events by name and edit/delete events. Events lists should support pagination.

## Installation
To install and run the Event-Calendar project locally, follow these steps:

1. Clone the repository:
    ```
    git clone https://github.com/your-username/Event-Calendar.git
    ```

2. Navigate to the project directory:
    ```
    cd Event-Calendar
    ```

3. Install the dependencies:
    ```
    npm install
    ```

4. Start the application:
    ```
    npm start
    ```

5. Open your browser and visit `http://localhost:3000` to access the Event-Calendar application.

## Usage
Once the application is up and running, you can perform the following actions:

- Create a new event by clicking on the "New Event" button.
- Edit an existing event by clicking on the event card and selecting the "Edit" option.
- Delete an event by clicking on the event card and selecting the "Delete" option.
- View event details by clicking on the event card.
- Manage event attendees by clicking on the event card and selecting the "Manage Attendees" option.

## Contributing
Contributions are welcome! If you would like to contribute to the Event-Calendar project, please follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```
    git checkout -b feature/your-feature-name
    ```
3. Make your changes and commit them:
    ```
    git commit -m "Add your commit message"
    ```
4. Push your changes to your forked repository:
    ```
    git push origin feature/your-feature-name
    ```
5. Open a pull request to the main repository.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact
If you have any questions or suggestions, feel free to reach out to us at [email protected]


## Installation
To install and run the Event-Calendar project locally, follow these steps:

1. Clone the repository:
    ```
    git clone https://github.com/your-username/Event-Calendar.git
    ```

2. Navigate to the project directory:
    ```
    cd Event-Calendar
    ```

3. Install the dependencies:
    ```
    npm install
    ```

4. Start the application:
    ```
    npm start
    ```

5. Open your browser and visit `http://localhost:3000` to access the Event-Calendar application.

## Usage
Once the application is up and running, you can perform the following actions:

- Create a new event by clicking on the "New Event" button.
- Edit an existing event by clicking on the event card and selecting the "Edit" option.
- Delete an event by clicking on the event card and selecting the "Delete" option.
- View event details by clicking on the event card.
- Manage event attendees by clicking on the event card and selecting the "Manage Attendees" option.

## Contributing
Contributions are welcome! If you would like to contribute to the Event-Calendar project, please follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```
    git checkout -b feature/your-feature-name
    ```
3. Make your changes and commit them:
    ```
    git commit -m "Add your commit message"
    ```
4. Push your changes to your forked repository:
    ```
    git push origin feature/your-feature-name
    ```
5. Open a pull request to the main repository.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact
If you have any questions or suggestions, feel free to reach out to us at [email protected]
