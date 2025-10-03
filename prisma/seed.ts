import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface DropdownItemData {
  name: string;
  href: string;
  description: string;
  features: string[];
  position: number;
}

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@fortune.com' },
    update: {},
    create: {
      email: 'admin@fortune.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    }
  });

  // Create theme config
  const themeConfig = await prisma.themeConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      primaryColor: '#3b82f6',
      accentColor: '#f97316',
      companyName: 'Fortune Technologies',
      isActive: true
    }
  });

  // Create hero content
  const heroContent = await prisma.heroContent.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      trustBadge: 'Trusted by 5,000+ Companies',
      mainHeading: 'Transform Your',
      subHeading: 'HR Operations',
      tagline: 'with AI-Powered Solutions',
      description: 'Streamline payroll, optimize talent management, and enhance employee experiences with Fortune Technologies\' comprehensive HR platform designed for modern businesses.',
      trustPoints: ['No Setup Fees', '24/7 Support', 'GDPR Compliant'],
      primaryCtaText: 'Start Free Trial',
      secondaryCtaText: 'Schedule Demo',
      phoneNumber: '0733769149',
      chatWidgetUrl: 'https://rag-chat-widget.vercel.app/',
      isActive: true
    }
  });

  // Create navigation items
  const navItems = [
    {
      name: 'What we offer',
      key: 'what-we-offer',
      position: 1,
      hasDropdown: true
    },
    {
      name: 'Who we serve',
      key: 'who-we-serve',
      position: 2,
      hasDropdown: true
    },
    {
      name: 'Why Fortune',
      key: 'why-fortune',
      position: 3,
      hasDropdown: true
    },
    {
      name: 'Careers',
      key: 'careers',
      href: '/careers',
      position: 4,
      hasDropdown: false
    },
    {
      name: 'About',
      key: 'about',
      href: '/about',
      position: 5,
      hasDropdown: false
    }
  ];

  for (const item of navItems) {
    const navItem = await prisma.navItem.upsert({
      where: { key: item.key },
      update: {},
      create: item
    });

    if (item.hasDropdown) {
      let dropdownTitle = '';
      let dropdownItems: DropdownItemData[] = [];

      switch (item.key) {
        case 'what-we-offer':
          dropdownTitle = 'What We Offer';
          dropdownItems = [
            {
              name: 'Payroll Management',
              href: '/services/payroll',
              description: 'Streamline your payroll process with our comprehensive PayWell Plus system. Handle salaries, deductions, taxes, and compliance automatically.',
              features: ['Automated Calculations', 'KRA Tax Compliance', 'NSSF & NHIF Integration', 'Employee Self-Service Portal'],
              position: 1
            },
            {
              name: 'Recruitment Services',
              href: '/services/recruitment',
              description: 'Professional recruitment and headhunting services for local and international companies. Attract and retain top talent.',
              features: ['Executive Search', 'Bulk Recruitment', 'Skills Assessment', 'Background Verification'],
              position: 2
            },
            {
              name: 'Staff Outsourcing',
              href: '/services/outsourcing',
              description: 'Complete staff outsourcing solutions for companies looking to focus on core business while we handle HR operations.',
              features: ['Full HR Management', 'Payroll Processing', 'Compliance Handling', 'Employee Benefits'],
              position: 3
            },
            {
              name: 'HR Consulting',
              href: '/services/hr-consulting',
              description: 'Expert HR consulting services to optimize your human resource strategies and improve organizational performance.',
              features: ['Policy Development', 'Process Optimization', 'Training Programs', 'Performance Management'],
              position: 4
            }
          ];
          break;

        case 'who-we-serve':
          dropdownTitle = 'Who We Serve';
          dropdownItems = [
            {
              name: 'Small Business (1-50)',
              href: '/clients/small-business',
              description: 'Perfect for growing companies with 1-50 employees. Enterprise-level HR capabilities at affordable prices.',
              features: ['Basic Payroll', 'Employee Records', 'Time Tracking', 'Leave Management'],
              position: 1
            },
            {
              name: 'Medium Enterprise (51-500)',
              href: '/clients/medium-business',
              description: 'Scalable HR solutions for medium enterprises with 51-500 employees. Advanced features for growing teams.',
              features: ['Advanced Payroll', 'Performance Management', 'Recruitment Tools', 'Analytics Dashboard'],
              position: 2
            }
          ];
          break;

        case 'why-fortune':
          dropdownTitle = 'Why Fortune';
          dropdownItems = [
            {
              name: 'Local Expertise',
              href: '/why-fortune/local-expertise',
              description: '15+ years of experience in the Kenyan market with deep understanding of local business challenges and regulations.',
              features: ['KRA Integration', 'NSSF Compliance', 'NHIF Processing', 'Local Banking Support'],
              position: 1
            },
            {
              name: '24/7 Support',
              href: '/why-fortune/support',
              description: 'Round-the-clock support from our expert team to ensure your HR operations never stop.',
              features: ['Phone Support', 'Live Chat', 'Email Support', 'On-site Assistance'],
              position: 2
            }
          ];
          break;
      }

      const dropdownData = await prisma.dropdownData.create({
        data: {
          navItemId: navItem.id,
          title: dropdownTitle
        }
      });

      for (const dropItem of dropdownItems) {
        await prisma.dropdownItem.create({
          data: {
            name: dropItem.name,
            href: dropItem.href,
            description: dropItem.description,
            features: dropItem.features,
            position: dropItem.position,
            isActive: true,
            dropdownDataId: dropdownData.id
          }
        });
      }
    }
  }

  // Create hero dashboard slides
  const heroDashboards = [
    {
      title: 'HR Dashboard',
      description: 'Complete overview of your HR operations with real-time insights and automated workflows',
      stats: [
        { label: 'Active Employees', value: '2,847', color: 'primary' },
        { label: 'Payroll Accuracy', value: '98.2%', color: 'accent' }
      ],
      features: ['Payroll Processing', 'Time Tracking', 'Benefits Management'],
      position: 1
    },
    {
      title: 'Analytics Center',
      description: 'Data-driven insights into workforce performance and organizational trends',
      stats: [
        { label: 'Reports Generated', value: '1,234', color: 'primary' },
        { label: 'Data Accuracy', value: '99.8%', color: 'accent' }
      ],
      features: ['Real-time Analytics', 'Custom Reports', 'Trend Analysis'],
      position: 2
    },
    {
      title: 'Recruitment Hub',
      description: 'Streamlined hiring process with AI-powered candidate matching and assessment',
      stats: [
        { label: 'Open Positions', value: '47', color: 'primary' },
        { label: 'Hire Success Rate', value: '85%', color: 'accent' }
      ],
      features: ['AI Matching', 'Video Interviews', 'Background Checks'],
      position: 3
    }
  ];

  for (const dashboard of heroDashboards) {
    await prisma.heroDashboard.create({
      data: dashboard
    });
  }

  console.log('✅ Database seeded successfully with complete navigation and hero content');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });