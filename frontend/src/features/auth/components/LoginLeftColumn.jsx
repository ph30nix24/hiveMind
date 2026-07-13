import { BrainCircuit, BarChart3, Globe } from 'lucide-react';



const testimonial = {
  quote:
    '"Hivemind transformed how our team automates research. What used to take days now runs in minutes."',
  name: 'Sarah Chen',
  role: 'CTO at NovaTech',
  avatar: 'SC',
};

const features = [
  {
    id: 'brain',
    icon: BrainCircuit,
    iconClass: 'bg-[#5969ff]/10 text-[#5969ff] border-[#5969ff]/20',
    title: 'Intelligent Orchestration',
    description: 'Your agents learn, adapt, and collaborate across tasks automatically.',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    iconClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    title: 'Real-Time Analytics',
    description: 'Monitor performance, costs, and outputs with a live dashboard.',
  },
  {
    id: 'global',
    icon: Globe,
    iconClass: 'bg-[#a15bf2]/10 text-[#a15bf2] border-[#a15bf2]/20',
    title: 'Global Infrastructure',
    description: 'Deploy agents across 30+ regions with sub-100 ms latency.',
  },
];

const LoginLeftColumn = () => (
  <div className="flex-1 w-full max-w-xl flex flex-col gap-8 animate-fade-in-up">
    {/* Headline */}
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-4xl font-bold leading-tight tracking-tight text-white font-heading italic md:text-center lg:text-start">
        Your AI agents <br className='max-lg:hidden' />
        are waiting <br className='max-m' />
        <span className="gradient-text">to get to work.</span>
      </h1>
      <p className="text-[13px] md:text-[15px] text-text-muted leading-relaxed lg:max-w-md font-body md:text-center lg:text-start ">
        Sign back in and pick up right where you left off. Your workflows,
        your agents, your results — all in one place.
      </p>
    </div>


    {/* Testimonial card */}
    <div className="glass-panel rounded-2xl p-6 max-w-md border-l-2 border-primary max-lg:hidden ">
      <p className="text-sm text-text-main leading-relaxed italic mb-4">
        {testimonial.quote}
      </p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#4866ff] to-[#9f54fc] flex items-center justify-center text-white text-xs font-bold shrink-0">
          {testimonial.avatar}
        </div>
        <div className='font-body'>
          <p className="text-sm font-semibold text-white">{testimonial.name}</p>
          <p className="text-xs text-text-muted pt-0.5">{testimonial.role}</p>
        </div>
      </div>
    </div>

    {/* Feature list */}
    <ul className="space-y-5 list-none p-0 max-lg:hidden">
      {features.map(({ id, icon: Icon, iconClass, title, description }) => (
        <li key={id} className="flex items-start gap-4">
          <div
            className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border ${iconClass}`}
            aria-hidden="true"
          >
            <Icon size={22} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-0.5">{title}</h3>
            <p className="text-sm text-text-muted leading-relaxed">{description}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default LoginLeftColumn;
