import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://redlix.co.in';

    // Base pages
    const basePages = [
        '',
        '/about-us',
        '/portfolio',
        '/resources',
        '/privacy',
        '/terms',
        '/cookies'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Project pages (Hardcoded for now based on current portfolio)
    const projectSlugs = [
        'dhasha-media',
        'hsga-telangana',
        'smartfit',
        'hus-system',
        'nss-cmrit',
        'national-ecommerce'
    ];

    const projectPages = projectSlugs.map((slug) => ({
        url: `${baseUrl}/portfolio/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));
    return [...basePages, ...projectPages];
}
