export const events = [
  {
    id: 1,
    title: "Gaming Expo 2025",
    location: "New York",
    image: "/gaming_expo.jpg",
  },
  {
    id: 2,
    title: "Indie Game Developers Meetup",
    location: "San Francisco",
    image: "/indie_meetup.jpg",
  },
  {
    id: 3,
    title: "Esports Championship",
    location: "Los Angeles",
    image: "/esports.jpg",
  },
];

export const fetchEvents = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(events);
    }, 500);
  });
};
