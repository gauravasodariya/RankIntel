
import { CheckCircle2 } from 'lucide-react'
import { pricingPlans } from '../../assets/assets'

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 border transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? 'bg-primary/5 border-primary shadow-lg scale-105'
                  : 'bg-card border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className={`text-2xl font-bold ${plan.popular ? 'text-primary' : 'text-foreground'} mb-2`}>
                {plan.name}
              </h3>
              <p className="text-muted-foreground mb-6">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'border border-border text-foreground hover:bg-hover'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
