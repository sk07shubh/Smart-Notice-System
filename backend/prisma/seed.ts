import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/utils/hash';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Seed Categories
  const categoryNames = [
    'Academic',
    'Examination',
    'Placement',
    'Events',
    'Administrative',
    'Sports',
    'Library'
  ];

  const categories = [];
  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories.push(category);
  }
  console.log(`Seeded ${categories.length} categories.`);

  // 2. Seed Admin User
  const adminEmail = 'admin@college.edu';
  const plainPassword = 'AdminPassword123!';
  const hashedPassword = await hashPassword(plainPassword);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      name: 'College Admin',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`Seeded admin user: ${admin.email}`);
  console.log(`Admin login credentials -> Email: ${admin.email}, Password: ${plainPassword}`);

  // 3. Seed Notices
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.name] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  const noticesData = [
    {
      title: 'End Semester Examination Timetable Published',
      description: 'The timetable for the upcoming end semester examinations has been published. All students are advised to check the schedule on the student portal. Exams will commence from the first week of next month.',
      categoryId: categoryMap['Examination'],
      postedById: admin.id,
      isPinned: true,
    },
    {
      title: 'Campus Placement Drive: Tech Innovations Ltd',
      description: 'Tech Innovations Ltd will be visiting the campus for a recruitment drive next Tuesday. Eligible final year students must register by Friday. Ensure you bring two copies of your resume.',
      categoryId: categoryMap['Placement'],
      postedById: admin.id,
      isPinned: true,
    },
    {
      title: 'Annual Sports Meet 2026',
      description: 'The Annual Sports Meet will be held on the 25th of this month. Trials for various athletic events will take place this weekend. Interested students should contact the sports coordinator.',
      categoryId: categoryMap['Sports'],
      postedById: admin.id,
      isPinned: false,
    },
    {
      title: 'Library Timing Extended During Exams',
      description: 'To support students during the examination period, the library will remain open until midnight starting next Monday. Please carry your college ID card at all times.',
      categoryId: categoryMap['Library'],
      postedById: admin.id,
      isPinned: false,
    },
    {
      title: 'Guest Lecture on Artificial Intelligence',
      description: 'A guest lecture by Dr. Alan Turing on recent advancements in Artificial Intelligence will be held in the main auditorium this Thursday at 10 AM. All CS and IT students are encouraged to attend.',
      categoryId: categoryMap['Academic'],
      postedById: admin.id,
      isPinned: false,
    },
    {
      title: 'Submission of Final Year Project Proposals',
      description: 'Final year students are reminded that the last date to submit their major project proposals is next Friday. Late submissions will not be entertained. Meet your respective guides for approval.',
      categoryId: categoryMap['Academic'],
      postedById: admin.id,
      isPinned: false,
    },
    {
      title: 'Maintenance Work in Block C',
      description: 'Due to electrical maintenance work, power supply in Block C will be interrupted tomorrow between 2 PM and 5 PM. We apologize for the inconvenience.',
      categoryId: categoryMap['Administrative'],
      postedById: admin.id,
      isPinned: false,
    },
    {
      title: 'Inter-College Cultural Fest - Registrations Open',
      description: 'Registrations for the upcoming inter-college cultural fest are now open. Showcase your talents in music, dance, and drama! Register at the student council office.',
      categoryId: categoryMap['Events'],
      postedById: admin.id,
      isPinned: false,
    }
  ];

  let noticesCreated = 0;
  for (const notice of noticesData) {
    // Avoid creating duplicates by checking if a notice with the same title exists
    const existing = await prisma.notice.findFirst({
      where: { title: notice.title },
    });
    if (!existing) {
      await prisma.notice.create({
        data: notice,
      });
      noticesCreated++;
    }
  }
  console.log(`Seeded ${noticesCreated} notices.`);
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
