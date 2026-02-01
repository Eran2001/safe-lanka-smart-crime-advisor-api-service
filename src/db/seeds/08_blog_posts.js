export async function seed(knex) {
  await knex('blog_posts').del();
  
  const posts = [
    {
      slug: 'understanding-crime-patterns-sri-lanka',
      title: 'Understanding Crime Patterns in Sri Lanka',
      excerpt: 'An in-depth analysis of crime trends across different regions',
      content_md: '# Understanding Crime Patterns\n\nCrime analysis is essential for public safety. This article explores various patterns observed across Sri Lankan districts.\n\n## Key Findings\n\nOur data shows seasonal variations in different crime types...',
      author: 'Dr. Perera',
      published_at: new Date('2024-12-15'),
      status: 'published'
    },
    {
      slug: 'data-driven-policing',
      title: 'The Future of Data-Driven Policing',
      excerpt: 'How analytics and AI are transforming law enforcement',
      content_md: '# Data-Driven Policing\n\nModern law enforcement relies heavily on data analysis to predict and prevent crime.\n\n## Benefits\n\n- Improved resource allocation\n- Faster response times\n- Preventive measures',
      author: 'Officer Silva',
      published_at: new Date('2024-12-10'),
      status: 'published'
    },
    {
      slug: 'community-safety-tips',
      title: 'Community Safety Tips for 2025',
      excerpt: 'Practical advice to keep your community safe',
      content_md: '# Community Safety Tips\n\nStaying safe requires community participation. Here are some tips:\n\n1. Report suspicious activity\n2. Secure your property\n3. Stay informed about local crime',
      author: 'SafeLanka Team',
      published_at: new Date('2025-01-05'),
      status: 'published'
    },
    {
      slug: 'cybercrime-awareness',
      title: 'Cybercrime: What You Need to Know',
      excerpt: 'Protecting yourself in the digital age',
      content_md: '# Cybercrime Awareness\n\nCybercrime is on the rise. Learn how to protect yourself online.',
      author: 'Tech Team',
      published_at: new Date('2024-11-20'),
      status: 'published'
    },
    {
      slug: 'youth-crime-prevention',
      title: 'Youth Crime Prevention Programs',
      excerpt: 'Investing in the next generation',
      content_md: '# Youth Crime Prevention\n\nPreventing youth crime through education and community programs.',
      author: 'Social Services',
      published_at: new Date('2024-10-15'),
      status: 'published'
    },
    {
      slug: 'emergency-response-guide',
      title: 'Emergency Response: A Quick Guide',
      excerpt: 'What to do in case of an emergency',
      content_md: '# Emergency Response Guide\n\nQuick actions can save lives. Know what to do in emergencies.',
      author: 'Emergency Services',
      published_at: new Date('2024-12-01'),
      status: 'published'
    },
    {
      slug: 'neighborhood-watch',
      title: 'Starting a Neighborhood Watch',
      excerpt: 'Building safer communities together',
      content_md: '# Neighborhood Watch Programs\n\nCommunity vigilance is key to crime prevention.',
      author: 'Community Outreach',
      published_at: new Date('2024-11-10'),
      status: 'published'
    },
    {
      slug: 'crime-statistics-2024',
      title: '2024 Crime Statistics Report',
      excerpt: 'Annual review of crime data',
      content_md: '# 2024 Crime Statistics\n\nComprehensive analysis of crime trends in 2024.',
      author: 'Analytics Team',
      published_at: new Date('2025-01-15'),
      status: 'published'
    },
    {
      slug: 'technology-in-law-enforcement',
      title: 'Technology in Modern Law Enforcement',
      excerpt: 'Tools and techniques shaping policing',
      content_md: '# Technology in Law Enforcement\n\nFrom body cameras to AI analytics, technology is changing policing.',
      author: 'Tech Specialist',
      published_at: new Date('2024-09-25'),
      status: 'published'
    },
    {
      slug: 'public-safety-collaboration',
      title: 'Public-Police Collaboration',
      excerpt: 'Working together for safer communities',
      content_md: '# Public-Police Collaboration\n\nEffective policing requires partnership with the community.',
      author: 'Public Relations',
      published_at: new Date('2024-10-30'),
      status: 'published'
    }
  ];
  
  await knex('blog_posts').insert(posts);
}