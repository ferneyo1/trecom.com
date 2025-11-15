import React, { useState } from 'react';
import { Button } from './Button';

interface StripeCheckoutFormProps {
    // These props are kept for API compatibility, but are not used in this simulation.
    clientSecret: string;
    onSuccess: () => void;
    onError: (message: string) => void;
    stripe: any; 
}

// A robust simulation of a Stripe payment form that does not crash.
const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({ onSuccess, onError }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setErrorMessage('');

        // Basic validation for simulation
        if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvc) {
            const errorMsg = 'Por favor, complete todos los campos de la tarjeta.';
            setErrorMessage(errorMsg);
            onError(errorMsg);
            setIsProcessing(false);
            return;
        }

        // Simulate network delay for a realistic experience
        setTimeout(() => {
            // In this simulation, we will assume the payment is always successful.
            console.log("Simulating successful payment...");
            setIsProcessing(false);
            onSuccess();
        }, 1500);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Número de Tarjeta</label>
                <input 
                    type="text" 
                    id="cardNumber" 
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                    placeholder="0000 0000 0000 0000"
                    required 
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="expiry" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Vencimiento (MM/AA)</label>
                    <input 
                        type="text" 
                        id="expiry" 
                        name="expiry"
                        value={cardDetails.expiry}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        placeholder="MM/AA"
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-slate-700 dark:text-slate-300">CVC</label>
                    <input 
                        type="text" 
                        id="cvc" 
                        name="cvc"
                        value={cardDetails.cvc}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                        placeholder="123"
                        required 
                    />
                </div>
            </div>

            <Button disabled={isProcessing} type="submit" className="w-full">
                <span id="button-text">
                    {isProcessing ? "Procesando..." : "Pagar ahora"}
                </span>
            </Button>
            {errorMessage && <div id="payment-message" className="text-red-500 text-sm mt-2 text-center">{errorMessage}</div>}
        </form>
    );
};

export default StripeCheckoutForm;
