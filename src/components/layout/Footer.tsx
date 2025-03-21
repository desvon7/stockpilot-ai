
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'AI Advisor', href: '/advisor' },
        { name: 'Mobile App', href: '/app' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Learn', href: '/learn' },
        { name: 'Blog', href: '/blog' },
        { name: 'Market News', href: '/news' },
        { name: 'API', href: '/api' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Contact', href: '/contact' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms', href: '/terms' },
        { name: 'Privacy', href: '/privacy' },
        { name: 'Cookies', href: '/cookies' },
        { name: 'Disclosures', href: '/disclosures' },
      ]
    }
  ];
  
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-medium text-lg mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="bg-primary text-primary-foreground font-bold text-xl p-1 rounded mr-2">SP</span>
            <span className="font-medium text-xl">StockPilot</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              &copy; {year} StockPilot. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Investment advisory services offered through StockPilot AI Advisors, an SEC-registered investment advisor.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
