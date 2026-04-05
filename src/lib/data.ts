export const DUMMY_COURSES = [
  {
    id: "cuid_1",
    title: "React for Beginners",
    description: "Learn the basics of React and Hooks from scratch.",
    category: "Web Development",
    instructorName: "Ali Khan",
    price: 0,
    level: "BEGINNER",
    isEnrolled: true,
    chapters: [
      { 
        id: "ch1", 
        title: "Introduction to JSX", 
        position: 1,
        description: "In this chapter, we will learn what JSX is and how it works under the hood." 
      },
      { 
        id: "ch2", 
        title: "State & Props", 
        position: 2,
        description: "Understanding how data flows between components using props and state." 
      },
    ]
  },
  {
    id: "cuid_2",
    title: "Next.js Pro",
    description: "Master the App Router and Server Components for production-ready apps.",
    category: "Web Development",
    instructorName: "Sara Ahmed",
    price: 5000,
    level: "ADVANCED",
    isEnrolled: false,
    chapters: [
      { 
        id: "ch3", 
        title: "Server Actions", 
        position: 1,
        description: "Learn how to handle form submissions and mutations using Server Actions." 
      },
    ]
  }
];