import { Users, Zap, ShieldCheck } from 'lucide-react';

const features = [
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

const LeftColumn = () => (
  <div className="flex-1 w-full max-w-xl flex flex-col lg:gap-8 animate-fade-in-up">
    {/* Headline */}
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-4xl font-bold leading-tight tracking-tight text-white font-heading italic md:text-center lg:text-start">
        Create your account <br className='max-lg:hidden' />
        and build with <br className='max-md:hidden' />
        <span className="gradient-text">intelligent agents.</span>
      </h1>
      <p className="text-[13px] md:text-[15px] text-text-muted leading-relaxed lg:max-w-md font-body md:text-center lg:text-start ">
        Join the future of multi-agent collaboration. Automate, orchestrate,
        and scale your ideas with AI.
      </p>
    </div>

    {/* Hero image */}
    <div className="w-full max-w-md mx-auto lg:mx-0 max-lg:hidden">
      <img
        src="../../../../signup/img1.webp"
        alt="Hivemind Neural Network Graphic"
        className="w-3/5 h-auto object-contain rounded-xl opacity-90 drop-shadow-2xl"
        loading="lazy"
      />
    </div>

    {/* Feature list */}
    <ul className="space-y-6 mt-4 list-none p-0 max-lg:hidden">
      {features.map(({ id, icon: Icon, iconClass, title, description }) => (
        <li key={id} className="flex items-start gap-4">
          <div
            className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${iconClass}`}
            aria-hidden="true"
          >
            <Icon size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-0.5 font-heading">{title}</h3>
            <p className="text-[13px] text-text-muted leading-relaxed font-body">{description}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default LeftColumn;
