import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'ClaudeBot',
                    'Claude-Web',
                    'CCBot',
                    'Bytespider',
                    'Diffbot',
                    'PerplexityBot',
                    'Omgilibot',
                    'Amazonbot',
                    'FacebookBot',
                    'PetalBot'
                ],
                disallow: '/',
            },
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/login/', '/api/', '/employee/', '/department/'],
            }
        ],
        sitemap: 'https://redlix.co.in/sitemap.xml',
    };
}
