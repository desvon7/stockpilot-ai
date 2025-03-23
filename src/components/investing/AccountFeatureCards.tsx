
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AccountFeatureCardsProps {
  cashValue: number;
}

const AccountFeatureCards: React.FC<AccountFeatureCardsProps> = ({ cashValue }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg mb-2">Margin investing</h3>
            <div className="mb-2 font-bold">Disabled</div>
            <p className="text-sm text-muted-foreground mb-4">Margin investing is a feature that allows you to borrow money for greater potential gains or losses. Margin investing is currently disabled for your account.</p>
            <Button variant="outline" className="w-full">Enable Margin Investing</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg mb-2">Instant Deposits</h3>
            <div className="mb-2 font-bold text-green-500">GOOD</div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total pending deposits</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Instant Deposits</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Instant Deposits used</span>
                <span>$0.00</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg mb-2">Withdrawable Cash</h3>
            <div className="mb-2 font-bold">${cashValue.toFixed(2)}</div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Individual Cash</span>
                <span>${cashValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Withdrawable Cash</span>
                <span>${cashValue.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg mb-2">Dividend reinvestment</h3>
            <div className="mb-2 font-bold">Disabled</div>
            <p className="text-sm text-muted-foreground mb-4">Dividend reinvestment (DRIP) automatically reinvests cash dividend payments into additional shares of the underlying stock or fund.</p>
            <p className="text-sm text-muted-foreground mb-4">You can turn it on in <span className="text-primary">Settings</span>.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg mb-2">Stock Lending</h3>
            <div className="mb-2 font-bold">Disabled</div>
            <p className="text-sm text-muted-foreground mb-4">With Stock Lending, get the opportunity to earn extra income on your portfolio. <span className="text-primary">Learn more</span></p>
            <Button variant="outline" className="w-full">Activate Stock Lending</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg mb-2">Day trades</h3>
            <div className="mb-2 font-bold">0 of 3</div>
            <p className="text-sm text-muted-foreground mb-4">A day trade is when you open and close the same stock or option position on the same day.</p>
            <Button variant="outline" className="w-full">Day trade settings</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg mb-2">Cash sweep program</h3>
            <div className="mb-2 font-bold">Disabled</div>
            <p className="text-sm text-muted-foreground mb-4">You can earn up to 4% APY on the uninvested cash in your account by having it swept to program banks. <span className="text-primary">Learn more</span></p>
            <Button variant="outline" className="w-full">Enable cash sweep</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg mb-2">Futures and event contracts trading</h3>
            <div className="mb-2 font-bold">Enabled</div>
            <p className="text-sm text-muted-foreground mb-4">Futures give you nearly 24-hour access to trade price movements of stock indexes, crypto, commodities and more with leverage.</p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full mb-2">View list of futures</Button>
              <Button variant="outline" size="sm" className="w-full">Trade event contracts</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AccountFeatureCards;
