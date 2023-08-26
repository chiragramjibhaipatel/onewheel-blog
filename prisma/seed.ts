import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  const posts = [
    {
      slug: "getting-started-with-javascript",
      title: "Getting Started with JavaScript",
      markdown:
        "Learn the basics of JavaScript programming language, including:\n- Variables and data types\n- Basic control structures",
    },
    {
      slug: "mastering-html5-css3",
      title: "Mastering HTML5 and CSS3",
      markdown:
        "Dive into the world of modern web development with:\n- HTML5 features\n- CSS3 styling techniques\n- Creating responsive web pages",
    },
    {
      slug: "the-art-of-responsive-design",
      title: "The Art of Responsive Design",
      markdown:
        "Explore the principles of responsive web design:\n- Fluid layouts\n- Media queries\n- Flexible images and media",
    },
    {
      slug: "deep-dive-into-python",
      title: "Deep Dive into Python",
      markdown:
        "Take an in-depth journey into Python:\n- Basic syntax and data structures\n- Functions and modules\n- Advanced features like decorators",
    },
    {
      slug: "demystifying-machine-learning",
      title: "Demystifying Machine Learning",
      markdown:
        "An introduction to machine learning:\n- Supervised, unsupervised, and reinforcement learning\n- Common algorithms like decision trees and neural networks",
    },
    {
      slug: "the-power-of-nodejs",
      title: "The Power of Node.js",
      markdown:
        "Discover the capabilities of Node.js:\n- Event-driven architecture\n- Building scalable network applications\n- Using npm packages",
    },
    {
      slug: "journey-into-cybersecurity",
      title: "Journey into Cybersecurity",
      markdown:
        "Explore the realm of cybersecurity:\n- Types of cyber threats\n- Importance of encryption\n- Best practices for securing online presence",
    },
    {
      slug: "crafting-compelling-ui-ux",
      title: "Crafting Compelling UI/UX",
      markdown:
        "Learn the principles of UI/UX design:\n- User-centered design process\n- Visual hierarchy and typography\n- Creating wireframes and prototypes",
    },
    {
      slug: "the-world-of-cryptocurrencies",
      title: "The World of Cryptocurrencies",
      markdown:
        "An overview of cryptocurrencies and blockchain:\n- How blockchain works\n- Popular cryptocurrencies like Bitcoin and Ethereum\n- Potential real-world applications",
    },
    {
      slug: "beginners-guide-to-linux",
      title: "Beginner's Guide to Linux",
      markdown:
        "Embark on a journey into the Linux OS:\n- Installation and basic command line usage\n- File system navigation\n- User and permission management",
    },
  ];

  for (const post of posts){
    await prisma.post.upsert({
      where: {slug: post.slug},
      update: post,
      create: post,
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
