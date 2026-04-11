import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with test data...");

  // Create test users
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@test.com",
      password: "$2b$10$dummy",
      role: "ADMIN",
    },
  });

  const instructor = await prisma.user.upsert({
    where: { email: "instructor@test.com" },
    update: {},
    create: {
      name: "Test Instructor",
      email: "instructor@test.com",
      password: "$2b$10$dummy",
      role: "INSTRUCTOR",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@test.com" },
    update: {},
    create: {
      name: "Test Student",
      email: "student@test.com",
      password: "$2b$10$dummy",
      role: "STUDENT",
    },
  });

  console.log("✅ Created test users:", { admin: admin.id, instructor: instructor.id, student: student.id });

  // Create test courses
  const courses = [];
  for (let i = 0; i < 15; i++) {
    const course = await prisma.course.upsert({
      where: { id: `test-course-${i}` },
      update: {},
      create: {
        id: `test-course-${i}`,
        title: `Test Course ${i + 1}`,
        description: `This is a test course description for pagination testing. It has enough words to be valid.`,
        price: i * 10,
        category: ["Development", "Data Science", "Design"][i % 3],
        level: (["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const)[i % 3],
        isPublished: i < 12,
        instructorId: instructor.id,
        rating: 4.0 + (i % 10) / 10,
      },
    });
    courses.push(course);
  }

  console.log(`✅ Created ${courses.length} test courses`);

  // Create chapters for first course
  for (let i = 0; i < 5; i++) {
    await prisma.chapter.upsert({
      where: { id: `test-chapter-${i}` },
      update: {},
      create: {
        id: `test-chapter-${i}`,
        title: `Chapter ${i + 1}`,
        description: `Test chapter description`,
        position: i,
        isPublished: true,
        courseId: courses[0].id,
      },
    });
  }

  console.log("✅ Created test chapters");

  // Create test enrollment
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId: student.id, courseId: courses[0].id },
    },
    update: {},
    create: {
      userId: student.id,
      courseId: courses[0].id,
    },
  });

  console.log("✅ Created test enrollment");

  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
