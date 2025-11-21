import React, { useState, useEffect } from 'react';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Job, RecommenderProfile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import Header from './shared/Header'; // A simple header for public view

interface PublicJobViewProps {
    jobId: string;
}

const PublicJobView: React.FC<PublicJobViewProps> = ({ jobId }) => {
    const [job, setJob] = useState<Job | null>(null);
    const [recommender, setRecommender] = useState<RecommenderProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { t } = useLanguage();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const jobRef = doc(db, 'jobs', jobId);
                const jobSnap = await getDoc(jobRef);

                if (jobSnap.exists()) {
                    const jobData = jobSnap.data();
                    const sanitizedData: any = {};
                    for (const key in jobData) {
                        if (jobData[key] instanceof Timestamp) {
                            sanitizedData[key] = jobData[key].toDate().toISOString();
                        } else {
                            sanitizedData[key] = jobData[key];
                        }
                    }
                    const fetchedJob = { id: jobSnap.id, ...sanitizedData } as Job;
                    setJob(fetchedJob);

                    const recommenderRef = doc(db, 'recommenders', fetchedJob.recommenderId);
                    const recommenderSnap = await getDoc(recommenderRef);
                    if (recommenderSnap.exists()) {
                        setRecommender(recommenderSnap.data() as RecommenderProfile);
                    }

                } else {
                    setError(t('publicJobView.jobNotFound'));
                }
            } catch (err) {
                console.error(err);
                setError(t('publicJobView.errorLoadingJob'));
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId, t]);
    
    const handleLoginToApply = () => {
        // Redirect to the main page, which will show the login form
        window.location.href = window.top.location.origin + window.top.location.pathname;
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><p>{t('loading')}</p></div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">{error}</p></div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
             <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">teRecomiendo</span>
                    </div>
                    </div>
                </div>
            </header>
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    {job && (
                         <Card title={job.title}>
                             <div className="space-y-4">
                                <h3 className="text-2xl font-bold">{job.title}</h3>
                                <p className="text-lg text-slate-600 dark:text-slate-400">{job.company} - {job.city}</p>
                                
                                <div className="prose dark:prose-invert max-w-none">
                                    <p>{job.description}</p>
                                    {job.tasks && job.tasks.length > 0 && (
                                        <>
                                            <h4>{t('recommender.functionsToPerform')}</h4>
                                            <ul>
                                                {job.tasks.map((task, index) => <li key={index}>{task}</li>)}
                                            </ul>
                                        </>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">{t('seeker.recommendedBy')}</h4>
                                    <div className="flex items-center space-x-3 mt-2">
                                        {recommender?.photoURL && (
                                            <img src={recommender.photoURL} alt={job.recommenderName} className="w-12 h-12 rounded-full object-cover" />
                                        )}
                                        <p className="font-medium">{job.recommenderName}</p>
                                    </div>
                                </div>
                                <Button onClick={handleLoginToApply} className="w-full mt-6" size="lg">
                                    {t('publicJobView.applyNowLogin')}
                                </Button>
                             </div>
                         </Card>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PublicJobView;
