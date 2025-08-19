import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Phone, Mail, User } from 'lucide-react';
import { toast } from 'sonner';

interface ContactAgentProps {
  property: any;
}

export const ContactAgent = ({ property }: ContactAgentProps) => {
  const [message, setMessage] = useState('');
  
  const handleCallAgent = () => {
    toast.success('Connecting you with the agent...');
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    toast.success('Message sent successfully!');
    setMessage('');
  };
  
  return (
    <Card className="bg-orange-50 shadow-sm border border-gray-100">
      <CardContent className="p-5">
        <h3 className="text-[14px] font-semibold mb-2">Contact Agent</h3>
        <hr className='mb-4'/>
        
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-[#303030] rounded-full mr-3 flex items-center justify-center overflow-hidden">
            {property.agent?.photo ? (
              <img src={property.agent.photo} alt={property.agent.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-[14px]">{property.agent?.name || 'Abhay Naik'}</h4>
            <p className="text-[12px] text-gray-600">{property.agent?.company || 'Urbanhousein captain'}</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          <Button 
            variant="default"
            className="w-full flex items-center justify-center bg-red-500" 
            onClick={handleCallAgent}
          >
            <Phone className="w-4 h-4 mr-2" />
            Request a call
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-center">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="p-1">
                <h3 className="text-lg font-semibold mb-4">Contact {property.agent?.name || 'Agent'}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Your Message</label>
                    <Textarea 
                      placeholder="I'm interested in this property and would like to schedule a viewing..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="resize-none"
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Your Name</label>
                      <Input placeholder="Enter your name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Your Phone</label>
                      <Input placeholder="Enter your phone" />
                    </div>
                  </div>
                  
                  <Button className="w-full" onClick={handleSendMessage}>Send Message</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="text-[10px] text-gray-500 text-center">
          By contacting, you agree to our terms and privacy policy
        </div>
      </CardContent>
    </Card>
  );
};