import { db } from '@/lib/db';
import { hashPassword, RANK_TITLES } from '@/lib/auth';

const DEMO_PHOTO = '/trainees/';

async function main() {
  console.log('🌱 Seeding Lycans Fight Club...');

  // Super admin (owner)
  const superAdmin = await db.member.upsert({
    where: { email: 'alpha@lycans.club' },
    update: {},
    create: {
      email: 'alpha@lycans.club',
      password: hashPassword('lycans123'),
      name: 'Dimitri Volkov',
      phone: '+20 100 000 0001',
      photo: '/trainees/superadmin.svg',
      role: 'SUPER_ADMIN',
      skillLevel: 'APEX',
      rank: 8,
      rankTitle: RANK_TITLES[8],
      bio: 'Founder & Head Coach of Lycans Fight Club. Apex predator of the ring.',
      weightClass: 'Heavyweight',
      discipline: 'MMA',
    },
  });

  // Coach / admin
  const coach = await db.member.upsert({
    where: { email: 'coach@lycans.club' },
    update: {},
    create: {
      email: 'coach@lycans.club',
      password: hashPassword('lycans123'),
      name: 'Marcus Reign',
      phone: '+20 100 000 0002',
      photo: '/trainees/coach.svg',
      role: 'ADMIN',
      skillLevel: 'ELITE',
      rank: 7,
      rankTitle: RANK_TITLES[7],
      bio: 'Lead striking coach. Former national kickboxing champion.',
      weightClass: 'Light Heavyweight',
      discipline: 'Muay Thai',
    },
  });

  // Trainees
  const traineeData = [
    { name: 'Elena Cross', phone: '+20 101 222 1101', skill: 'WARRIOR', rank: 4, wc: 'Featherweight', disc: 'BJJ', bio: 'Rising striker with razor-sharp elbows.' },
    { name: 'Kai Stryker', phone: '+20 101 222 1102', skill: 'VETERAN', rank: 5, wc: 'Welterweight', disc: 'Boxing', bio: 'Footwork phantom. Counters like a viper.' },
    { name: 'Sasha Vorn', phone: '+20 101 222 1103', skill: 'ROOKIE', rank: 2, wc: 'Flyweight', disc: 'Judo', bio: 'New blood. Hungry. Fast learner.' },
    { name: 'Dante Wolfe', phone: '+20 101 222 1104', skill: 'ELITE', rank: 6, wc: 'Middleweight', disc: 'MMA', bio: 'Grappler with a killer instinct.' },
    { name: 'Mira Lang', phone: '+20 101 222 1105', skill: 'WARRIOR', rank: 4, wc: 'Strawweight', disc: 'Karate', bio: 'Precision striker, calm under fire.' },
    { name: 'Rex Maddox', phone: '+20 101 222 1106', skill: 'NOVICE', rank: 1, wc: 'Heavyweight', disc: 'Wrestling', bio: 'Raw power. Building technique.' },
    { name: 'Ivy Sable', phone: '+20 101 222 1107', skill: 'VETERAN', rank: 5, wc: 'Bantamweight', disc: 'Muay Thai', bio: 'Clinch specialist. Relentless.' },
    { name: 'Cole Vane', phone: '+20 101 222 1108', skill: 'ROOKIE', rank: 2, wc: 'Lightweight', disc: 'MMA', bio: 'All-rounder in the making.' },
  ];

  const photos = [
    'trainee1.svg', 'trainee2.svg', 'trainee3.svg', 'trainee4.svg',
    'trainee5.svg', 'trainee6.svg', 'trainee7.svg', 'trainee8.svg',
  ];

  const trainees = [];
  for (let i = 0; i < traineeData.length; i++) {
    const t = traineeData[i];
    const email = `trainee${i + 1}@lycans.club`;
    const m = await db.member.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashPassword('lycans123'),
        name: t.name,
        phone: t.phone,
        photo: `/trainees/${photos[i]}`,
        role: 'TRAINEE',
        skillLevel: t.skill as 'NOVICE',
        rank: t.rank,
        rankTitle: RANK_TITLES[t.rank],
        bio: t.bio,
        weightClass: t.wc,
        discipline: t.disc,
      },
    });
    trainees.push(m);
  }

  // Seed attendance for the last several sessions
  const now = new Date();
  for (const t of trainees) {
    const sessions = 3 + (t.rank % 4); // 3-6 sessions
    for (let s = 0; s < sessions; s++) {
      const day = new Date(now);
      day.setDate(now.getDate() - s * 2 - 1);
      day.setHours(18, 30, 0, 0);
      const out = new Date(day);
      out.setHours(20, 15, 0, 0);
      await db.attendance.create({
        data: { memberId: t.id, checkIn: day, checkOut: out },
      });
    }
  }

  // Seed feedback
  const feedbacks = [
    { rating: 5, comment: 'Coach Reign transformed my striking overnight. This place is a forge for warriors.', category: 'coaching' },
    { rating: 5, comment: 'The atmosphere is electric. Moonlit sessions, real discipline, real growth.', category: 'facility' },
    { rating: 4, comment: 'Tough love coaching that works. I leveled up from Rookie to Warrior in two months.', category: 'coaching' },
    { rating: 5, comment: 'Best MMA gym in the city. The lycan energy is unmatched.', category: 'general' },
  ];
  for (let i = 0; i < feedbacks.length; i++) {
    await db.feedback.create({
      data: {
        memberId: trainees[i % trainees.length].id,
        rating: feedbacks[i].rating,
        comment: feedbacks[i].comment,
        category: feedbacks[i].category,
      },
    });
  }

  // Seed some chat messages
  const msgs = [
    { member: coach, content: 'Tonight we sharpen the clinch. Bring your war face. 🐺' },
    { member: trainees[3], content: 'Ready to bleed for it, Coach.' },
    { member: trainees[0], content: 'Sparring pairs posted?' },
    { member: coach, content: 'Yes — check the board. Dante vs Kai main set.' },
    { member: trainees[1], content: "Let's dance. 🔥" },
  ];
  for (const m of msgs) {
    await db.message.create({ data: { memberId: m.member.id, content: m.content } });
  }

  // Chat room closed by default
  await db.chatRoom.upsert({
    where: { id: 'main' },
    update: {},
    create: { id: 'main', isOpen: false },
  });

  console.log(`✅ Seeded ${trainees.length + 2} members, attendance, feedback & messages.`);
  console.log('   Super admin login: alpha@lycans.club / lycans123');
  console.log('   Coach login:        coach@lycans.club / lycans123');
  console.log('   Trainee login:      trainee1@lycans.club / lycans123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
