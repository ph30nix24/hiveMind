import { Users, Zap, ShieldCheck } from 'lucide-react';

export const features = [
  {
    id: 'multi-agent',
    icon: Users,
    iconClass: 'bg-[#5969ff]/10 text-[#5969ff] border-[#5969ff]/20',
    title: 'Multi-Agent Collaboration',
    description: 'Create, manage, and orchestrate multiple AI agents seamlessly.',
  },
  {
    id: 'automation',
    icon: Zap,
    iconClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    title: 'Powerful Automation',
    description: 'Automate workflows and complex tasks with intelligent agents.',
  },
  {
    id: 'security',
    icon: ShieldCheck,
    iconClass: 'bg-[#a15bf2]/10 text-[#a15bf2] border-[#a15bf2]/20',
    title: 'Secure & Private',
    description: 'Your data and agents are protected with enterprise-grade security.',
  },
];

export const testimonial = {
  quote:
    '"Hivemind transformed how our team automates research. What used to take days now runs in minutes."',
  name: 'Sarah Chen',
  role: 'CTO at NovaTech',
  avatar: 'SC',
};