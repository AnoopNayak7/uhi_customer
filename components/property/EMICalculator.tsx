import { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Calculator } from 'lucide-react';

interface EMICalculatorProps {
  propertyPrice: number;
}

export const EMICalculator = ({ propertyPrice }: EMICalculatorProps) => {
  const [downPayment, setDownPayment] = useState(30);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Calculate loan amount based on down payment percentage
    const loan = propertyPrice - (propertyPrice * (downPayment / 100));
    setLoanAmount(loan);
    
    // Calculate EMI
    const monthlyInterestRate = interestRate / 12 / 100;
    const numberOfPayments = tenure * 12;
    const emiValue = loan * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) / 
                    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    setEmi(emiValue);
    setTotalAmount(emiValue * numberOfPayments);
    setTotalInterest(emiValue * numberOfPayments - loan);
  }, [propertyPrice, downPayment, interestRate, tenure]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardContent className="p-5">
        <div className="flex items-center mb-4">
          <Calculator className="w-5 h-5 mr-2 text-primary" />
          <CardTitle className="text-base font-semibold">EMI Calculator</CardTitle>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Down Payment</span>
              <span className="text-sm font-medium">{downPayment}% ({formatPrice(propertyPrice * (downPayment / 100))})</span>
            </div>
            <Slider
              value={[downPayment]}
              min={10}
              max={90}
              step={5}
              onValueChange={(value) => setDownPayment(value[0])}
              className="my-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10%</span>
              <span>90%</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Interest Rate</span>
              <span className="text-sm font-medium">{interestRate}%</span>
            </div>
            <Slider
              value={[interestRate]}
              min={5}
              max={15}
              step={0.1}
              onValueChange={(value) => setInterestRate(value[0])}
              className="my-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5%</span>
              <span>15%</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Loan Tenure</span>
              <span className="text-sm font-medium">{tenure} Years</span>
            </div>
            <Slider
              value={[tenure]}
              min={5}
              max={30}
              step={1}
              onValueChange={(value) => setTenure(value[0])}
              className="my-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5 Years</span>
              <span>30 Years</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray-600">Loan Amount</span>
              <span className="text-sm font-medium">{formatPrice(loanAmount)}</span>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Monthly EMI</span>
                <span className="text-base font-semibold text-primary">{formatPrice(emi)}</span>
              </div>
              <div className="text-xs text-gray-500">Principal + Interest</div>
            </div>
            
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray-600">Total Interest</span>
              <span className="text-sm font-medium">{formatPrice(totalInterest)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Amount</span>
              <span className="text-sm font-medium">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};