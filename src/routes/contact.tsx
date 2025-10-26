import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/contact')({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="contact-page">
      <h1>Contact</h1>
      <p>You can reach us at radio@sistermidnight.org</p>
      <p>Please remember we are a volunteer run organisation and so may not always be able to respond quickly to messages</p>
    </div>
  );
}
