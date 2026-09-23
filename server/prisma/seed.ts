import { LeadStatus } from "@prisma/client";
import prisma from "../src/lib/prisma";

const firstNames = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
  "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
  "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
  "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
  "Kenneth", "Carol", "Kevin", "Amanda", "Brian", "Melissa", "George", "Deborah",
  "Edward", "Stephanie", "Ronald", "Rebecca", "Timothy", "Sharon", "Jason", "Laura",
  "Jeffrey", "Cynthia", "Ryan", "Dorothy", "Jacob", "Amy", "Gary", "Kathleen",
  "Nicholas", "Angela", "Eric", "Shirley", "Jonathan", "Emma", "Stephen", "Brenda",
  "Larry", "Pamela", "Justin", "Nicole", "Scott", "Anna", "Brandon", "Samantha",
  "Benjamin", "Katherine", "Samuel", "Christine", "Gregory", "Debra", "Alexander", "Rachel",
  "Frank", "Carolyn", "Patrick", "Janet", "Raymond", "Maria", "Jack", "Heather",
  "Dennis", "Diane", "Jerry", "Julie", "Tyler", "Joyce", "Aaron", "Victoria"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
  "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
  "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
  "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
  "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker",
  "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy",
  "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey",
  "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
  "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza",
  "Ruiz", "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers",
  "Long", "Ross", "Foster", "Jimenez"
];

const domains = [
  "techpulse.io",
  "innovateflow.com",
  "growthscale.co",
  "apexleads.org",
  "venturenext.ai",
  "brightwave.dev",
  "novasystems.net",
  "cloudpeak.solutions",
  "nexusgroup.io",
  "summitcorp.com",
  "elevatebiz.net",
  "horizonventures.org"
];

const statuses: LeadStatus[] = [
  LeadStatus.NEW,
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
  LeadStatus.CONVERTED,
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomPhone(): string {
  const countryCode = "+1";
  const areaCode = Math.floor(200 + Math.random() * 800);
  const prefix = Math.floor(200 + Math.random() * 800);
  const lineNumber = Math.floor(1000 + Math.random() * 9000);
  return `${countryCode} (${areaCode}) ${prefix}-${lineNumber}`;
}

async function seed() {
  console.log("🌱 Starting seeding of 100 dummy leads...");

  const leads = [];
  const now = Date.now();

  for (let i = 1; i <= 100; i++) {
    const firstName = firstNames[(i - 1) % firstNames.length];
    const lastName = lastNames[(i - 1 + 17) % lastNames.length];
    const fullName = `${firstName} ${lastName}`;
    const domain = getRandomElement(domains);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${domain}`;
    const phone = getRandomPhone();
    const status = getRandomElement(statuses);

    // Stagger creation dates across past 60 days
    const daysAgo = (100 - i) * 0.6; // leads spread out over ~60 days up to now
    const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

    leads.push({
      name: fullName,
      email,
      phone,
      status,
      createdAt,
    });
  }

  // Insert leads in batch
  const result = await prisma.lead.createMany({
    data: leads,
    skipDuplicates: true,
  });

  console.log(`✅ Successfully seeded ${result.count} leads into the database!`);

  const totalCount = await prisma.lead.count();
  console.log(`📊 Total leads currently in database: ${totalCount}`);
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

