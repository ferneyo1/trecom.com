import React from 'react';
import { User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';

interface HelpDashboardProps {
  user: User;
  onBackToDashboard: () => void;
}

const HelpDashboard: React.FC<HelpDashboardProps> = ({ user, onBackToDashboard }) => {
  const { t } = useLanguage();
  const roleKey = user.role.toLowerCase() as 'seeker' | 'professional' | 'recommender';
  
  // A helper to safely get nested translation values.
  const getTranslationObject = (key: string) => {
    const result = t(key);
    // If the key resolves to a string (because it wasn't found as an object), return an empty array.
    if (typeof result === 'string') return [];
    return result;
  }
  
  const helpContent = {
    title: t(`help.${roleKey}.title`),
    description: t(`help.${roleKey}.description`),
    faqs: getTranslationObject(`help.${roleKey}.faqs`) as { q: string, a: string }[] || []
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-4">
        <Button onClick={onBackToDashboard} variant="secondary">
          &larr; {t('help.backToDashboard')}
        </Button>
      </div>
      <Card title={helpContent.title}>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{helpContent.description}</p>
        <div className="space-y-4">
          {helpContent.faqs.map((faq, index) => (
            <details key={index} className="group bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg cursor-pointer">
              <summary className="font-medium list-none flex justify-between items-center">
                {faq.q}
                <span className="transition-transform duration-300 group-open:rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              <p className="text-slate-600 dark:text-slate-400 mt-3">{faq.a}</p>
            </details>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default HelpDashboard;