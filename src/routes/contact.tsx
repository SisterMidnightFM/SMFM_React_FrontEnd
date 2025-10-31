import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../components/shared/PageHeader';

export const Route = createFileRoute('/contact')({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="contact-page">
      <PageHeader
        title="Contact"
        iconSrc="/Images/Speaker_Dark.webp"
      />
      <p>You can reach us at radio@sistermidnight.org</p>
      <p>Please remember we are a volunteer run organisation and so may not always be able to respond quickly to messages</p>
    </div>
  );
}
