
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/utils/formatters';

const Profile: React.FC = () => {
  const { user } = useAuth();
  
  // Mock data for the profile
  const profileData = {
    name: 'Javon J',
    username: '@Psalm23_1',
    joinedYear: 2020,
    totalBalance: 519.59,
    individualInvesting: {
      total: 519.59,
      individualHoldings: 468.00,
      individualCash: 4.75,
      cryptoHoldings: 46.84
    },
    retirement: {
      total: 0.00,
      rothIraHoldings: 0.00,
      rothIraCash: 0.00
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile | StockPilot</title>
      </Helmet>
      
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="w-32">
              <svg viewBox="0 0 24 24" height="28" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.6514 9.71288C18.6694 9.71288 19.7454 9.35527 20.6534 8.69842C21.2874 8.25236 21.8854 7.66342 22.2694 7.04181C21.9094 7.35073 21.5374 7.65965 21.1894 7.88142C20.3854 8.40591 19.4954 8.69842 18.5694 8.69842C16.8354 8.69842 15.3194 7.66342 14.5874 6.33609C15.0534 7.57626 16.2774 9.71288 17.6514 9.71288Z" fill="currentColor"/>
                <path d="M19.3034 21.4442C19.3034 19.8858 19.3034 18.3428 19.3034 16.7843C19.3034 16.1121 19.1374 15.4706 18.8974 14.8599C18.6814 14.3215 18.3874 13.8447 18.0454 13.4218C17.7154 13.017 17.3374 12.673 16.9354 12.4049C16.5094 12.1215 16.0474 11.9602 15.5854 11.8757C15.8734 12.0522 16.1614 12.2592 16.4134 12.5117C16.8274 12.92 17.1694 13.422 17.3974 13.9773C17.6254 14.5326 17.7634 15.131 17.7634 15.7446C17.7634 16.2492 17.6734 16.7423 17.4934 17.1958C17.3254 17.6108 17.0614 17.9873 16.7494 18.2995C16.4374 18.6117 16.0594 18.8672 15.6454 19.043C15.2194 19.2205 14.7454 19.3118 14.2594 19.3118C13.8454 19.3118 13.4554 19.2356 13.0894 19.0886C12.7474 18.9467 12.4594 18.7482 12.1954 18.4897C12.1954 18.5 12.1834 18.5 12.1714 18.5C12.1714 18.48 12.1834 18.48 12.1954 18.48C12.9214 18.5917 13.7134 18.3844 14.3354 17.9149C14.7374 17.6108 15.0374 17.1958 15.2194 16.7263C15.3894 16.2806 15.4674 15.8137 15.4674 15.3559C15.4674 14.8806 15.3774 14.4223 15.2194 13.9908C15.0614 13.579 14.8334 13.2078 14.5334 12.9037C14.2474 12.6101 13.9014 12.3674 13.5114 12.1976C13.1334 12.0278 12.7234 11.9329 12.3034 11.9329C11.8314 11.9329 11.3814 12.0278 10.9554 12.208C10.5534 12.3778 10.1874 12.6204 9.86543 12.9139C9.56143 13.1969 9.30543 13.5371 9.11943 13.9254C8.94143 14.2882 8.83943 14.683 8.83943 15.0846C8.83943 15.4738 8.92943 15.8309 9.09343 16.166C9.25343 16.4908 9.48143 16.7949 9.77143 17.0366C9.77143 17.0466 9.76143 17.0466 9.75143 17.0466C9.75143 17.0366 9.75143 17.0266 9.75143 17.0266C9.33743 16.7423 9.00343 16.3513 8.76743 15.9037C8.53743 15.479 8.43543 15.0122 8.43543 14.546C8.43543 14.0363 8.54543 13.54 8.75943 13.0861C8.96543 12.6508 9.24743 12.2695 9.59943 11.945C9.94343 11.6308 10.3454 11.4003 10.7714 11.227C11.1854 11.0607 11.6214 10.975 12.0594 10.975C12.5334 10.975 12.9814 11.0504 13.3954 11.2235C13.8094 11.3899 14.1754 11.6238 14.4934 11.9309C14.8234 12.2487 15.0794 12.63 15.2734 13.0653C15.4774 13.5192 15.5854 14.0156 15.5854 14.5251C15.5854 14.9913 15.4954 15.4369 15.3374 15.8619C15.1674 16.3075 14.9154 16.7263 14.5854 17.1131C14.2474 17.507 13.8094 17.8419 13.3134 18.1031C12.8054 18.364 12.2394 18.534 11.6734 18.6221C11.7974 18.7076 11.9334 18.7735 12.0774 18.8238C12.5574 18.9797 13.0534 19.064 13.5374 19.064C14.0474 19.064 14.5334 18.9814 14.9934 18.8135C15.4414 18.649 15.8474 18.4106 16.2114 18.0984C16.5774 17.788 16.8774 17.4102 17.1114 16.9853C17.3554 16.5466 17.4934 16.0558 17.4934 15.5496C17.4934 15.0363 17.3794 14.544 17.1694 14.0873C16.9714 13.663 16.6834 13.275 16.3394 12.951C15.9954 12.6222 15.6034 12.3608 15.1794 12.1811C14.7674 12.0073 14.3294 11.917 13.8914 11.9104C13.9814 11.9004 14.0714 11.8937 14.1694 11.887C14.5214 11.8603 14.8614 11.8269 15.1994 11.7936C15.8014 11.7435 16.4094 11.6576 16.9974 11.497C17.6214 11.3328 18.2274 11.0811 18.7974 10.7285C19.3674 10.3741 19.8954 9.91143 20.3614 9.35903C20.8154 8.82329 21.2094 8.18978 21.5334 7.47583C21.8454 6.79352 22.0974 6.01783 22.2854 5.18878C22.4734 4.36333 22.5774 3.48295 22.5774 2.55631C19.8214 3.92097 17.1434 4.51676 14.6634 3.77947C13.3494 3.3871 12.1574 2.58807 11.1394 1.49307C10.1094 0.384733 9.27743 -1.71661e-05 8.31743 -1.71661e-05C5.07743 -1.71661e-05 2.76343 2.86523 2.16343 8.56719C2.07343 9.39265 2.01743 10.2316 2.01743 11.0811C2.01743 12.6101 2.20343 14.0818 2.52343 15.4712C2.86743 16.9414 3.36343 18.3034 4.00343 19.524C4.65943 20.7717 5.46343 21.8667 6.38343 22.7803C7.31943 23.7073 8.36343 24.4282 9.49143 24.9235C9.49143 24.9332 9.48143 24.9332 9.48143 24.9332C9.48143 24.9332 9.47143 24.9332 9.46143 24.9235C8.09143 24.0904 6.93743 22.9606 6.04743 21.5682C5.17743 20.2094 4.58343 18.5933 4.32743 16.7876C4.58343 19.9469 5.77143 22.6968 7.69143 24.5931C9.62943 26.5029 12.2394 27.4971 15.1194 27.4971C15.5454 27.4971 15.9594 27.4702 16.3734 27.4148C18.4194 27.0889 20.2914 25.9881 21.5334 24.2927C22.3594 23.1722 22.9114 21.8329 23.1274 20.3761C21.0694 22.5875 18.3734 22.3152 19.3034 21.4442Z" fill="currentColor"/>
                <path d="M12.3154 15.1276C12.3154 16.4344 11.2574 17.4907 9.95141 17.4907C8.64542 17.4907 7.58942 16.4344 7.58942 15.1276C7.58942 13.8209 8.64542 12.7646 9.95141 12.7646C11.2574 12.7646 12.3154 13.8209 12.3154 15.1276Z" fill="currentColor"/>
              </svg>
            </div>
            
            <div className="flex items-center space-x-8">
              <a href="/rewards" className="text-muted-foreground hover:text-white">Rewards</a>
              <a href="/investing" className="text-muted-foreground hover:text-white">Investing</a>
              <a href="/crypto" className="text-muted-foreground hover:text-white">Crypto</a>
              <a href="/spending" className="text-muted-foreground hover:text-white">Spending</a>
              <a href="/retirement" className="text-muted-foreground hover:text-white">Retirement</a>
              <a href="/notifications" className="text-muted-foreground hover:text-white">Notifications•</a>
              <a href="/account" className="text-primary border-b-2 border-primary pb-1">Account</a>
            </div>
          </div>
        </header>
        
        <main className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-start gap-8">
            <div className="w-4/5">
              <div className="flex items-center mb-6">
                <div className="relative mr-4">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-2xl">😊</span>
                  </div>
                  <button className="absolute bottom-0 right-0 bg-gray-600 rounded-full p-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M4 12H20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                
                <div>
                  <h1 className="text-2xl font-semibold">{profileData.name}</h1>
                  <div className="text-muted-foreground text-sm">{profileData.username} • Joined {profileData.joinedYear}</div>
                  <button className="text-sm text-primary mt-1">Edit profile</button>
                </div>
              </div>
              
              <div className="mb-10">
                <div className="flex items-baseline mb-1">
                  <h2 className="text-3xl font-bold">${formatCurrency(profileData.totalBalance)}</h2>
                </div>
                <div className="text-muted-foreground text-sm">Total in Robinhood</div>
              </div>
              
              <Card className="bg-gray-900 border-gray-800 mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <h3 className="text-xl font-semibold">Individual investing</h3>
                    <svg className="w-4 h-4 ml-2 text-muted-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 8V12M12 16V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total individual value</span>
                      <span className="font-semibold">${formatCurrency(profileData.individualInvesting.total)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Individual holdings</span>
                      <span className="font-semibold">${formatCurrency(profileData.individualInvesting.individualHoldings)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Individual cash</span>
                      <span className="font-semibold">${formatCurrency(profileData.individualInvesting.individualCash)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crypto holdings</span>
                      <span className="font-semibold">${formatCurrency(profileData.individualInvesting.cryptoHoldings)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800 mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <h3 className="text-xl font-semibold">Retirement</h3>
                    <svg className="w-4 h-4 ml-2 text-muted-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 8V12M12 16V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total retirement value</span>
                      <span className="font-semibold">${formatCurrency(profileData.retirement.total)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Roth IRA holdings</span>
                      <span className="font-semibold">${formatCurrency(profileData.retirement.rothIraHoldings)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Roth IRA cash</span>
                      <span className="font-semibold">${formatCurrency(profileData.retirement.rothIraCash)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="w-2/5">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Transfer money</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2">Amount</label>
                        <Input 
                          type="text"
                          value="$0.00"
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-2">From</label>
                        <Select defaultValue="">
                          <SelectTrigger className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Choose account" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="checking">Checking</SelectItem>
                            <SelectItem value="savings">Savings</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-2">To</label>
                        <Select defaultValue="">
                          <SelectTrigger className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Choose account" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="crypto">Crypto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button className="w-full bg-gray-700 hover:bg-gray-600">
                        Review transfer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Profile;
