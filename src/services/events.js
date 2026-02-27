export const events = [
  {
    id: 1,
    title: "Gaming Expo 2025",
    location: "New York",
    image: "https://placehold.co/400x300/18181b/ffffff?text=Gaming+Expo",
  },
  {
    id: 2,
    title: "Indie Game Developers Meetup",
    location: "San Francisco",
    image: "https://placehold.co/400x300/18181b/ffffff?text=Indie+Meetup",
  },
  {
    id: 3,
    title: "Esports Championship",
    location: "Los Angeles",
    image: "https://placehold.co/400x300/18181b/ffffff?text=Esports",
  },
];

export const fetchEvents = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(events);
    }, 500);
  });
};
