import { useEffect, useRef } from 'react';
import { PageHeader } from '../shared/PageHeader';
import './ChatroomPage.css';

const CHAT_EMBED_URL =
  'https://app.radiocult.fm/embed/chat/sister-midnight-fm?theme=custom&primaryColor=%23C2B9B0&corners=rounded&playerDisplay=metadata&ptc=%23ffffff&stc=%23fffaf7&bc=%23342924&inmc=%23C2B9B0&outmc=%23C2B9B0&stationmc=%23C2B9B0&sepc=%23C2B9B0';

// Breathing room left below the chat so the footer hints at more page below
const BOTTOM_GAP = 24;

// How far the element sits from the top of the page, independent of how far
// whichever ancestor is doing the scrolling (window or .main-content) is scrolled
function getUnscrolledTop(el: HTMLElement): number {
  let scrolled = window.scrollY;
  for (let node = el.parentElement; node; node = node.parentElement) {
    scrolled += node.scrollTop;
  }
  return el.getBoundingClientRect().top + scrolled;
}

export function ChatroomPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  // Size the chat to whatever viewport height is left below the page title,
  // rather than guessing with a fixed calc(). Adapts to short laptops, tall
  // phones, mobile browser chrome appearing/disappearing, and panel resizes.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const update = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const available = viewportHeight - getUnscrolledTop(el) - BOTTOM_GAP;
      el.style.setProperty('--chatroom-height', `${Math.round(available)}px`);
    };

    update();

    const observer = new ResizeObserver(update);
    // The title block above can reflow (font loading, wrapping) and shift us down
    if (el.parentElement) observer.observe(el.parentElement);

    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    window.visualViewport?.addEventListener('resize', update);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="chatroom-page">
      <PageHeader
        title="CHATROOM"
        iconSrc="/Images/Star1_Dark.webp"
      />

      <div className="chatroom-page__content" ref={contentRef}>
        <iframe
          className="chatroom-page__embed"
          title="Sister Midnight FM chat room"
          src={CHAT_EMBED_URL}
          scrolling="no"
          frameBorder="0"
          allowTransparency
        />
      </div>
    </div>
  );
}
