"use client";

export function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: wire up newsletter signup API
      }}
      className="flex w-full max-w-sm gap-2"
    >
      <input
        type="email"
        placeholder="Your email address"
        className="flex-1 rounded-full border-0 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-maroon-300 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-maroon-800 transition hover:bg-maroon-50"
      >
        Subscribe
      </button>
    </form>
  );
}
