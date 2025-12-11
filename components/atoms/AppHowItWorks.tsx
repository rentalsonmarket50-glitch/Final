import { FC } from 'react';

interface IHowItWorksStep {
  number: string;
  title: string;
  description: string;
}

const steps: IHowItWorksStep[] = [
  {
    number: '01',
    title: 'Search',
    description: 'Find the perfect property in your desired location with our smart search',
  },
  {
    number: '02',
    title: 'Book',
    description: 'Select your dates and complete the booking in just a few clicks',
  },
  {
    number: '03',
    title: 'Confirm',
    description: 'Receive instant confirmation and detailed property information',
  },
  {
    number: '04',
    title: 'Enjoy',
    description: 'Check in and enjoy your comfortable stay with peace of mind',
  },
];

const AppHowItWorks: FC = () => {
  return (
    <section className="my-16 py-12 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How it works
          </h2>
          <p className="text-lg text-gray-600">
            Book your perfect stay in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="mb-6">
                <span className="text-6xl md:text-7xl font-bold text-gray-200">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppHowItWorks;

