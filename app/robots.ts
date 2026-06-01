import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/login/', '/api/', '/employee/', '/department/'],
        },
        sitemap: 'https://redlix.co.in/sitemap.xml',
    };
}
