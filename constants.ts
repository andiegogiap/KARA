import { Prompt } from './types';

export const DEPLOYMENT_PROMPTS: Prompt[] = [
  {
    value: 1,
    title: 'User Research & Persona Definition',
    description: 'Understand your target audience deeply. Who are they, what are their goals, and what are their pain points? Develop detailed user personas to guide all design and development decisions.',
  },
  {
    value: 2,
    title: 'Information Architecture & User Flows',
    description: 'Structure your application\'s content and navigation logically. Design intuitive user flows that guide users to their goals with minimal friction and maximum clarity.',
  },
  {
    value: 3,
    title: 'Wireframing & Prototyping',
    description: 'Create low-fidelity wireframes to outline the structure and layout. Build interactive prototypes to test user flows and gather early feedback before writing any code.',
  },
  {
    value: 4,
    title: 'Visual Design & Design Systems',
    description: 'Establish a cohesive visual identity. Define color palettes, typography, iconography, and component styles. Create a design system for consistency and scalability.',
  },
  {
    value: 5,
    title: 'Accessibility (A11y)',
    description: 'Ensure your application is usable by everyone, including people with disabilities. Implement ARIA attributes, ensure keyboard navigability, and maintain sufficient color contrast.',
  },
  {
    value: 6,
    title: 'Frontend Technology Stack',
    description: 'Choose the right tools for the job. Select a framework (e.g., React, Vue, Svelte), state management library, and styling solution that fits your project\'s scale and requirements.',
  },
  {
    value: 7,
    title: 'Performance Optimization',
    description: 'Build a fast and responsive application. Optimize asset loading, implement efficient rendering strategies, and minimize bundle size to ensure a smooth user experience on all devices.',
  },
  {
    value: 8,
    title: 'Testing & User Feedback Loops',
    description: 'Implement a robust testing strategy, including unit, integration, and end-to-end tests. Establish channels for continuous user feedback to iterate and improve the application post-launch.',
  },
  {
    value: 9,
    title: 'Component-Driven Development',
    description: 'Build UIs with isolated, reusable components. Utilize tools like Storybook to develop, test, and document components in isolation, accelerating development and ensuring consistency.',
  },
  {
    value: 10,
    title: 'Micro-interactions & Animation',
    description: 'Enhance user experience with purposeful animations. Design subtle, feedback-driven micro-interactions that guide users, provide delight, and make the interface feel more responsive.',
  },
  {
    value: 11,
    title: 'API Integration & Data Management',
    description: 'Architect robust data fetching strategies. Choose between REST or GraphQL, and implement client-side caching with tools like React Query or SWR to create a fast, resilient application.',
  },
  {
    value: 12,
    title: 'A/B Testing & Iteration',
    description: 'Make data-driven design decisions. Set up A/B tests to validate hypotheses, measure the impact of changes, and continuously iterate on the user experience based on real-world usage data.',
  },
];
