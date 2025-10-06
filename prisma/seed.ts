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
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  await prisma.admin.upsert({
    where: { email: 'admin@fortune.com' },
    update: {},
    create: {
      email: 'admin@fortune.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    }
  });
  console.log('✅ Admin user created');

  // Create theme config
  await prisma.themeConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      primaryColor: '#3b82f6',
      accentColor: '#f97316',
      companyName: 'Fortune Technologies',
      logoUrl: '/logo.png',
      isActive: true
    }
  });
  console.log('✅ Theme config created');

  // Create hero content
  await prisma.heroContent.upsert({
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
  console.log('✅ Hero content created');

  // Navigation items
  const navItems = [
    { name: 'What we offer', key: 'what-we-offer', position: 1, hasDropdown: true },
    { name: 'Who we serve', key: 'who-we-serve', position: 2, hasDropdown: true },
    { name: 'Why Fortune', key: 'why-fortune', position: 3, hasDropdown: true },
    { name: 'Careers', key: 'careers', href: '/careers', position: 4, hasDropdown: false },
    { name: 'About', key: 'about', href: '/about', position: 5, hasDropdown: false }
  ];

  // Clean up existing dropdown items and data to avoid duplicates
  await prisma.dropdownItem.deleteMany({});
  await prisma.dropdownData.deleteMany({});

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
              description: 'Complete staff outsourcing solutions allowing you to focus on core business while we handle HR operations.',
              features: ['Full HR Management', 'Payroll Processing', 'Compliance Handling', 'Employee Benefits'],
              position: 3
            },
            {
              name: 'HR Consulting',
              href: '/services/hr-consulting',
              description: 'Expert HR consulting services to optimize your human resource strategies and improve organizational performance.',
              features: ['Policy Development', 'Process Optimization', 'Training Programs', 'Performance Management'],
              position: 4
            },
            {
              name: 'Time & Attendance',
              href: '/services/attendance',
              description: 'Smart time tracking with automated scheduling and biometric integration for accurate attendance management.',
              features: ['Biometric Integration', 'Mobile Clock-in', 'Shift Management', 'Overtime Tracking'],
              position: 5
            },
            {
              name: 'HR System',
              href: '/technology/hr-system',
              description: 'Complete HR management system for employee records, leave management, and performance tracking.',
              features: ['Employee Database', 'Leave Management', 'Performance Reviews', 'Document Management'],
              position: 6
            },
            {
              name: 'CCTV Solutions',
              href: '/security/cctv',
              description: 'Professional CCTV installation and monitoring solutions for enhanced security and workplace safety.',
              features: ['HD Camera Installation', '24/7 Monitoring', 'Cloud Storage', 'Remote Access'],
              position: 7
            },
            {
              name: 'Web Development',
              href: '/technology/web-development',
              description: 'Custom web development services to build powerful, scalable websites and web applications for your business.',
              features: ['Custom Websites', 'E-commerce Solutions', 'Mobile Responsive', 'SEO Optimized'],
              position: 8
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
            },
            {
              name: 'Large Enterprise (500+)',
              href: '/clients/large-enterprise',
              description: 'Enterprise-grade HR solutions for large organizations with 500+ employees. Complete customization and dedicated support.',
              features: ['Custom Workflows', 'Advanced Analytics', 'Multi-location Support', 'Dedicated Account Manager'],
              position: 3
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
            },
            {
              name: 'Security & Compliance',
              href: '/why-fortune/security',
              description: 'Bank-level security with full compliance to Kenyan data protection laws and international standards.',
              features: ['ISO 27001 Certified', 'Data Encryption', 'Regular Audits', 'GDPR Compliant'],
              position: 3
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
  console.log('✅ Navigation items created');

  // Delete existing hero dashboards to avoid duplicates
  await prisma.heroDashboard.deleteMany({});

  // Hero dashboards
  const heroDashboards = [
    {
      title: 'HR Dashboard',
      description: 'Complete overview of your HR operations with real-time insights',
      stats: [
        { label: 'Active Employees', value: '2,847', color: 'primary' },
        { label: 'Payroll Accuracy', value: '98.2%', color: 'accent' }
      ],
      features: ['Payroll Processing', 'Time Tracking', 'Benefits Management'],
      position: 1
    },
    {
      title: 'Analytics Center',
      description: 'Data-driven insights into workforce performance',
      stats: [
        { label: 'Reports Generated', value: '1,234', color: 'primary' },
        { label: 'Data Accuracy', value: '99.8%', color: 'accent' }
      ],
      features: ['Real-time Analytics', 'Custom Reports', 'Trend Analysis'],
      position: 2
    }
  ];

  for (const dashboard of heroDashboards) {
    await prisma.heroDashboard.create({ data: dashboard });
  }
  console.log('✅ Hero dashboards created');

  // Delete existing services to avoid duplicates
  await prisma.service.deleteMany({});

  // Services
  const services = [
    {
      title: 'Payroll Management',
      slug: 'payroll',
      description: 'Comprehensive payroll processing with automated tax calculations, KRA compliance, and employee self-service portals.',
      shortDesc: 'Automated payroll with KRA compliance',
      icon: 'Shield',
      color: 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400',
      features: ['Automated Calculations', 'KRA Tax Compliance', 'NSSF & NHIF Integration', 'Employee Self-Service'],
      isActive: true,
      isFeatured: true,
      isPopular: true,
      position: 1,
      buttonText: 'Get Started',
      buttonLink: '/contact',
    },
    {
      title: 'Recruitment Services',
      slug: 'recruitment',
      description: 'Professional recruitment and headhunting services for local and international companies.',
      shortDesc: 'Professional talent acquisition',
      icon: 'Users',
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
      features: ['Executive Search', 'Bulk Recruitment', 'Skills Assessment', 'Background Verification'],
      isActive: true,
      isFeatured: true,
      position: 2,
      buttonText: 'Start Hiring',
      buttonLink: '/contact',
    },
    {
      title: 'Staff Outsourcing',
      slug: 'outsourcing',
      description: 'Complete staff outsourcing solutions allowing you to focus on core business.',
      shortDesc: 'Complete HR outsourcing',
      icon: 'Globe',
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      features: ['Full HR Management', 'Payroll Processing', 'Compliance Handling', 'Employee Benefits'],
      isActive: true,
      isFeatured: true,
      position: 3,
      buttonText: 'Learn More',
      buttonLink: '/services/outsourcing',
    },
    {
      title: 'HR Consulting',
      slug: 'hr-consulting',
      description: 'Expert HR consulting services to optimize human resource strategies and improve organizational performance.',
      shortDesc: 'Strategic HR consulting',
      icon: 'TrendingUp',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      features: ['Policy Development', 'Process Optimization', 'Training Programs', 'Performance Management'],
      isActive: true,
      isFeatured: false,
      position: 4,
      buttonText: 'Consult Now',
      buttonLink: '/contact',
    },
    {
      title: 'Time & Attendance',
      slug: 'attendance',
      description: 'Smart time tracking with automated scheduling, biometric integration, and comprehensive attendance management.',
      shortDesc: 'Smart time tracking solutions',
      icon: 'Clock',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      features: ['Biometric Integration', 'Mobile Clock-in', 'Shift Management', 'Overtime Tracking'],
      isActive: true,
      isFeatured: true,
      position: 5,
      buttonText: 'Try It Now',
      buttonLink: '/services/attendance',
    },
    {
      title: 'HR System',
      slug: 'hr-system',
      description: 'Cloud-based HR platform centralizing all human resource operations with workflow automation and custom reports.',
      shortDesc: 'Complete HR management platform',
      icon: 'Monitor',
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
      features: ['Employee Database', 'Document Management', 'Workflow Automation', 'Custom Reports'],
      isActive: true,
      isFeatured: false,
      position: 6,
      buttonText: 'Get Demo',
      buttonLink: '/contact',
    },
    {
      title: 'CCTV Solutions',
      slug: 'cctv',
      description: 'Advanced security monitoring systems with cloud backup, remote access, and AI-powered detection capabilities.',
      shortDesc: 'Professional security systems',
      icon: 'Shield',
      color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      features: ['24/7 Monitoring', 'Cloud Storage', 'Mobile Access', 'AI Detection'],
      isActive: true,
      isFeatured: false,
      position: 7,
      buttonText: 'Secure Now',
      buttonLink: '/contact',
    },
    {
      title: 'Web Development',
      slug: 'web-development',
      description: 'Custom web solutions and digital platforms tailored to your business requirements with modern technologies.',
      shortDesc: 'Custom web solutions',
      icon: 'Zap',
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      features: ['Responsive Design', 'E-commerce', 'CMS Integration', 'SEO Optimization'],
      isActive: true,
      isFeatured: false,
      position: 8,
      buttonText: 'Build Now',
      buttonLink: '/contact',
    }
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service
    });
  }
  console.log('✅ Services created');

  // Delete existing testimonials to avoid duplicates
  await prisma.testimonial.deleteMany({});

  // Testimonials
const testimonials = [
  {
    name: 'Sarah Wanjiku',
    role: 'HR Director',
    company: 'Safaricom PLC',
    content: 'Fortune Technologies completely transformed our HR operations. The payroll automation saved us 20 hours per week, and employee satisfaction increased by 45%.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c37c?w=150&h=150&fit=crop&crop=face',
    results: ['20hrs saved weekly', '45% satisfaction boost', '100% compliance'],
    service: 'payroll',
    isActive: true,
    isFeatured: true,
    position: 1,
  },
  {
    name: 'Michael Kiprotich',
    role: 'CEO',
    company: 'TechNova Kenya',
    content: 'The AI-powered recruitment features helped us reduce hiring time by 60%. The integration with KRA and NSSF is seamless.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    results: ['60% faster hiring', 'Seamless KRA integration', 'ROI in 2 months'],
    service: 'recruitment',
    isActive: true,
    isFeatured: true,
    position: 2,
  },
]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log('✅ Testimonials created');

  // Delete existing stats to avoid duplicates
  await prisma.stat.deleteMany({});

  // Stats
  const stats = [
    {
      number: '5,000+',
      label: 'Companies Trust Us',
      icon: 'Users',
      color: 'text-primary-600',
      isActive: true,
      position: 1,
    },
    {
      number: '1M+',
      label: 'Employees Managed',
      icon: 'TrendingUp',
      color: 'text-orange-600',
      isActive: true,
      position: 2,
    },
    {
      number: '99.9%',
      label: 'Uptime Guarantee',
      icon: 'Shield',
      color: 'text-green-600',
      isActive: true,
      position: 3,
    },
    {
      number: '24/7',
      label: 'Customer Support',
      icon: 'Clock',
      color: 'text-purple-600',
      isActive: true,
      position: 4,
    }
  ];

  for (const stat of stats) {
    await prisma.stat.create({ data: stat });
  }
  console.log('✅ Stats created');

  // Section Contents
  const sectionContents = [
    {
      sectionKey: 'features',
      title: 'Everything You Need to Manage Your Workforce',
      subtitle: 'Complete HR Solution',
      description: 'From hiring to retirement, our integrated platform covers every aspect of human resource management with cutting-edge technology and intuitive design.',
    },
    {
      sectionKey: 'testimonials',
      title: 'What Our Clients Say',
      subtitle: 'Trusted by Industry Leaders',
      description: 'See how Fortune Technologies has helped businesses across Kenya transform their operations.',
    },
    {
      sectionKey: 'stats',
      title: 'Proven Results',
      subtitle: 'Numbers That Matter',
      description: 'Our track record speaks for itself with measurable results across all our services.',
    }
  ];

  for (const content of sectionContents) {
    await prisma.sectionContent.upsert({
      where: { sectionKey: content.sectionKey },
      update: {},
      create: content
    });
  }
  console.log('✅ Section contents created');

  // Footer Sections and Links
  await prisma.footerLink.deleteMany({});
  await prisma.footerSection.deleteMany({});

  const footerSections = [
    {
      title: 'HR Solutions',
      position: 1,
      links: [
        { name: 'Payroll Management', href: '/services/payroll', position: 1 },
        { name: 'Time & Attendance', href: '/services/attendance', position: 2 },
        { name: 'HR Consulting', href: '/services/hr-consulting', position: 3 },
        { name: 'Staff Outsourcing', href: '/services/outsourcing', position: 4 },
        { name: 'HR System', href: '/technology/hr-system', position: 5 }
      ]
    },
    {
      title: 'Technology',
      position: 2,
      links: [
        { name: 'Software Development', href: '/technology/web-development', position: 1 },
        { name: 'CCTV Solutions', href: '/security/cctv', position: 2 },
        { name: 'Mobile App', href: '/services/mobile-app', position: 3 },
        { name: 'Data Security', href: '/services/data-security', position: 4 },
        { name: 'AI Solutions', href: '/services/ai-solutions', position: 5 }
      ]
    },
    {
      title: 'Industries',
      position: 3,
      links: [
        { name: 'Small Business', href: '/clients/small-business', position: 1 },
        { name: 'Healthcare', href: '/industries/healthcare', position: 2 },
        { name: 'Manufacturing', href: '/industries/manufacturing', position: 3 },
        { name: 'Retail & Commerce', href: '/industries/retail', position: 4 },
        { name: 'Financial Services', href: '/industries/finance', position: 5 }
      ]
    },
    {
      title: 'Support',
      position: 4,
      links: [
        { name: 'Help Center', href: '/support', position: 1 },
        { name: 'Documentation', href: '/docs', position: 2 },
        { name: 'About Us', href: '/about', position: 3 },
        { name: 'Careers', href: '/careers', position: 4 },
        { name: 'Contact Us', href: '/contact', position: 5 }
      ]
    }
  ];

  for (const section of footerSections) {
    const createdSection = await prisma.footerSection.create({
      data: {
        title: section.title,
        position: section.position,
        isActive: true
      }
    });

    for (const link of section.links) {
      await prisma.footerLink.create({
        data: {
          footerSectionId: createdSection.id,
          name: link.name,
          href: link.href,
          position: link.position,
          isActive: true
        }
      });
    }
  }
  console.log('✅ Footer sections and links created');

  // Contact Info
  await prisma.contactInfo.deleteMany({});
  const contactInfoItems = [
    {
      type: 'email',
      label: 'Email',
      value: 'support@fortunekenya.com',
      icon: 'Mail',
      position: 1
    },
    {
      type: 'phone',
      label: 'Phone',
      value: '+254 722 769 149',
      icon: 'Phone',
      position: 2
    },
    {
      type: 'address',
      label: 'Address',
      value: 'SouthGate Centre, Nairobi, Kenya',
      icon: 'MapPin',
      position: 3
    }
  ];

  for (const contact of contactInfoItems) {
    await prisma.contactInfo.create({
      data: {
        ...contact,
        isActive: true
      }
    });
  }
  console.log('✅ Contact info created');

  // Social Links
  await prisma.socialLink.deleteMany({});
  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: 'Linkedin',
      href: 'https://linkedin.com/company/fortune-technologies',
      position: 1
    },
    {
      name: 'Twitter',
      icon: 'Twitter',
      href: 'https://twitter.com/@fcl_kenya',
      position: 2
    },
    {
      name: 'Facebook',
      icon: 'Facebook',
      href: 'https://facebook.com/fortunetechnologies',
      position: 3
    },
    {
      name: 'YouTube',
      icon: 'Youtube',
      href: 'https://youtube.com/@fortunetechnologies',
      position: 4
    }
  ];

  for (const social of socialLinks) {
    await prisma.socialLink.create({
      data: {
        ...social,
        isActive: true
      }
    });
  }
  console.log('✅ Social links created');

  // Page Contents
  await prisma.pageContent.deleteMany({});
  const pageContents = [
    {
      pageKey: 'services',
      title: 'Transform Your Business with Fortune Technologies',
      subtitle: 'Comprehensive HR Solutions',
      description: 'From payroll management to strategic HR consulting, we provide end-to-end solutions that empower your organization to focus on what matters most - growing your business.',
      heroTitle: 'Transform Your Business with',
      heroSubtitle: 'Fortune Technologies',
      heroDescription: 'From payroll management to strategic HR consulting, we provide end-to-end solutions that empower your organization to focus on what matters most - growing your business.',
      ctaText: 'Start Free Trial',
      ctaLink: '/contact',
      ctaSecondaryText: 'Schedule Consultation',
      ctaSecondaryLink: '/contact',
      isActive: true
    },
    {
      pageKey: 'payroll',
      title: 'Advanced Payroll Management',
      subtitle: 'Streamline Your Payroll Operations',
      description: 'Streamline your payroll operations with our comprehensive, compliant, and automated payroll management system. Trusted by 5,000+ businesses across Kenya.',
      heroTitle: 'Advanced Payroll',
      heroSubtitle: 'Management',
      heroDescription: 'Streamline your payroll operations with our comprehensive, compliant, and automated payroll management system. Trusted by 5,000+ businesses across Kenya.',
      ctaText: 'Get Started Today',
      ctaLink: '/contact',
      ctaSecondaryText: 'Schedule Demo',
      ctaSecondaryLink: '/contact',
      isActive: true
    }
  ];

  for (const content of pageContents) {
    await prisma.pageContent.create({
      data: content
    });
  }
  console.log('✅ Page contents created');

  // Call to Actions
  await prisma.callToAction.deleteMany({});
  const callToActions = [
    {
      pageKey: 'services',
      title: 'Ready to Get Started?',
      description: 'Join over 5,000 companies that trust Fortune Technologies with their HR operations. Start your transformation today with a free consultation.',
      primaryText: 'Get Free Consultation',
      primaryLink: '/contact',
      secondaryText: 'Contact Sales Team',
      secondaryLink: '/contact',
      bgColor: 'bg-gradient-to-r from-blue-600 to-blue-500',
      textColor: 'text-white',
      position: 1,
      isActive: true
    },
    {
      pageKey: 'payroll',
      title: 'Ready to Transform Your Payroll Management?',
      description: 'Join thousands of businesses who trust Fortune Technologies for their payroll needs.',
      primaryText: 'Start Free Trial',
      primaryLink: '/contact',
      secondaryText: 'Contact Sales Team',
      secondaryLink: '/contact',
      bgColor: 'bg-gradient-to-r from-blue-600 to-orange-500',
      textColor: 'text-white',
      position: 1,
      isActive: true
    }
  ];

  for (const cta of callToActions) {
    await prisma.callToAction.create({
      data: cta
    });
  }
  console.log('✅ Call-to-actions created');

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });