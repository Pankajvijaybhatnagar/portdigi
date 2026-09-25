"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CONFIG } from "@/lib/config";

const SERVICE_OPTIONS = [...CONFIG.services.map((s) => s.title), "Something else"];
const TIMELINE_OPTIONS = ["As soon as possible", "Within a month", "In 2–3 months", "Just exploring"];

const PLACEHOLDERS = {
  name: "Type your name…",
  about: "A line or two about your business…",
  contact: "Email or phone number…",
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function isValidContact(v) {
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const phone = v.replace(/[^\d]/g, "").length >= 10;
  return email || phone;
}

function buildMessage(d) {
  return [
    "Hi Digi1Xprt! 👋",
    "",
    `Name: ${d.name}`,
    `Services: ${d.services.join(", ")}`,
    `Project: ${d.about || "—"}`,
    `Start: ${d.timeline}`,
    `Contact: ${d.contact}`,
  ].join("\n");
}

function BotAvatar({ size = "w-8 h-8 text-sm" }) {
  return (
    <span className={`${size} rounded-full bg-ink flex items-center justify-center font-display font-extrabold text-orange flex-shrink-0`}>
      1
    </span>
  );
}

export default function CTA() {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState(null); // name | services | about | timeline | contact | done
  const [data, setData] = useState({ name: "", services: [], about: "", timeline: "", contact: "" });
  const [picked, setPicked] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  const sectionRef = useRef(null);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const session = useRef(0); // bumps on restart so stale bot replies are dropped
  const nextId = useRef(0);

  const push = useCallback((msg) => {
    setMessages((m) => [...m, { id: nextId.current++, ...msg }]);
  }, []);

  // Bot "types" each line, then hands control to the next step
  const botSay = useCallback(
    async (lines, next) => {
      const token = session.current;
      setStep(null);
      for (const line of lines) {
        setTyping(true);
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        await wait(reduced ? 150 : Math.min(1400, 550 + line.length * 12));
        if (token !== session.current) return;
        setTyping(false);
        push({ from: "bot", text: line });
        await wait(180);
        if (token !== session.current) return;
      }
      setStep(next);
    },
    [push]
  );

  const start = useCallback(() => {
    botSay(
      [
        "Hey there! I'm Xpert, the Digi1Xprt assistant.",
        "I'll grab a few quick details so our team can get back to you within 24 hours. What's your name?",
      ],
      "name"
    );
  }, [botSay]);

  // Say hello once the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setStarted(true);
          start();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [start]);

  // Keep the newest message in view (scrolls the chat only, never the page)
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });
  }, [messages, typing, step]);

  // Focus the box whenever the bot is waiting for typed input
  useEffect(() => {
    // Skip on touch screens until the visitor has replied once — otherwise the
    // keyboard would pop up just from scrolling past the section
    const touch = !window.matchMedia("(pointer: fine)").matches;
    const hasReplied = messages.some((m) => m.from === "user");
    if (PLACEHOLDERS[step] && inputRef.current && started && (!touch || hasReplied)) {
      inputRef.current.focus({ preventScroll: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, started]);

  const answer = (text) => push({ from: "user", text });

  const handleText = (e) => {
    e.preventDefault();
    const v = input.trim();
    if (!v || !PLACEHOLDERS[step]) return;

    if (step === "contact" && !isValidContact(v)) {
      setError("Hmm, that doesn't look like an email or phone number.");
      return;
    }
    setError("");
    setInput("");
    answer(v);

    if (step === "name") {
      const name = v.split(" ")[0];
      setData((d) => ({ ...d, name: v }));
      botSay([`Nice to meet you, ${name}! What can we help you with? Pick all that apply.`], "services");
    } else if (step === "about") {
      setData((d) => ({ ...d, about: v }));
      botSay(["Love it. When would you like to get started?"], "timeline");
    } else if (step === "contact") {
      setData((d) => ({ ...d, contact: v }));
      botSay([`Thanks, ${data.name.split(" ")[0]}! Here's your project summary.`], "done");
    }
  };

  const confirmServices = () => {
    if (!picked.length) return;
    answer(picked.join(", "));
    setData((d) => ({ ...d, services: picked }));
    botSay(["Great choice. Tell us a little about your business or project."], "about");
  };

  const skipAbout = () => {
    answer("I'll share details on the call");
    botSay(["No problem. When would you like to get started?"], "timeline");
  };

  const pickTimeline = (t) => {
    answer(t);
    setData((d) => ({ ...d, timeline: t }));
    botSay(["Almost done! What's the best email or phone number to reach you?"], "contact");
  };

  const restart = () => {
    session.current += 1;
    setMessages([]);
    setTyping(false);
    setData({ name: "", services: [], about: "", timeline: "", contact: "" });
    setPicked([]);
    setInput("");
    setError("");
    start();
  };

  const summary = buildMessage(data);
  const waLink = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(summary)}`;
  const mailLink = `mailto:${CONFIG.email}?subject=${encodeURIComponent(
    `New project enquiry — ${data.name}`
  )}&body=${encodeURIComponent(summary)}`;

  // 5 answers complete the brief
  const answered = messages.filter((m) => m.from === "user").length;
  const progress = step === "done" ? 1 : Math.min(answered, 5) / 5;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-white overflow-hidden"
    >
      {/* soft animated glow */}
      <div className="blob-float absolute w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle,rgba(245,166,35,0.12),transparent_70%)] -top-40 -left-40 pointer-events-none" />
      <div
        className="blob-float absolute w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(26,26,92,0.08),transparent_70%)] -bottom-40 -right-32 pointer-events-none"
        style={{ animationDelay: "-6s" }}
      />

      <div className="relative max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,470px)] gap-12 lg:gap-16 items-center">
        {/* Copy + direct contact */}
        <div className="text-center lg:text-left">
          <div className="eyebrow center lg:!text-left">Ready?</div>
          <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink mb-4">
            Let&apos;s Build Something
            <br />
            <span className="text-orange">Big Together.</span>
          </h2>
          <p className="text-[17px] text-muted leading-[1.8] max-w-[500px] mx-auto lg:mx-0 mb-10">
            Tell us about your project and we&apos;ll get back to you within 24
            hours.
          </p>

          <div className="flex gap-3.5 justify-center lg:justify-start flex-wrap">
            <a
              href={`mailto:${CONFIG.email}`}
              className="inline-flex items-center gap-2 bg-orange text-white px-8 py-4 rounded-full font-semibold text-[15px] transition-all hover:bg-orange-dk hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(245,166,35,0.7)]"
            >
              Email Us Now
            </a>
            <a
              href={`https://wa.me/${CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-silver bg-white text-ink px-8 py-3.5 rounded-full font-semibold text-[15px] transition-all hover:border-ink hover:-translate-y-0.5"
            >
              WhatsApp Chat
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-2.5 sm:gap-4 mt-9 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-muted">
              📧{" "}
              <a href={`mailto:${CONFIG.email}`} className="text-ink hover:text-orange transition-colors">
                {CONFIG.email}
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-muted">
              📱{" "}
              <a
                href={`https://wa.me/${CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-orange transition-colors"
              >
                WhatsApp
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-muted">📍 {CONFIG.location}</div>
          </div>
        </div>

        {/* Chatbot */}
        <div className="relative w-full max-w-[470px] mx-auto">
          <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-orange/25 via-transparent to-navy/15 blur-2xl pointer-events-none" />
          <div className="relative bg-white rounded-[24px] border border-silver shadow-[0_30px_80px_-30px_rgba(17,17,24,0.35)] overflow-hidden flex flex-col h-[560px]">
            {/* header */}
            <div className="relative bg-ink px-5 py-4 flex items-center gap-3">
              <span className="relative">
                <span className="bot-ring absolute inset-0 rounded-full bg-orange" />
                <span className="relative w-11 h-11 rounded-full bg-orange flex items-center justify-center font-display font-extrabold text-ink text-lg">
                  1
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#25D366] border-2 border-ink" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-extrabold text-white">
                  Xpert <span className="text-white/40 font-semibold">· Digi1Xprt</span>
                </div>
                <div className="text-[12px] text-white/50">{typing ? "typing…" : "Online · replies in seconds"}</div>
              </div>
              <button
                type="button"
                onClick={restart}
                className="text-[12px] font-bold text-white/50 hover:text-orange transition-colors"
                aria-label="Restart chat"
              >
                ↻ Restart
              </button>
              {/* progress */}
              <div className="absolute left-0 bottom-0 h-[3px] w-full bg-white/10">
                <div className="h-full bg-orange transition-all duration-500" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>

            {/* messages */}
            <div
              ref={bodyRef}
              className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 flex flex-col gap-3 bg-[radial-gradient(circle_at_1px_1px,rgba(17,17,24,0.06)_1px,transparent_0)] [background-size:18px_18px]"
              aria-live="polite"
            >
              <div className="self-center text-[11px] font-semibold text-muted bg-cloud rounded-full px-3 py-1 mb-1">
                Today
              </div>

              {messages.map((m, idx) =>
                m.from === "bot" ? (
                  <div key={m.id} className="msg-left flex items-end gap-2 max-w-[88%]">
                    <BotAvatar />
                    <div className="bg-cloud text-ink rounded-[18px] rounded-bl-[6px] px-4 py-2.5 text-[14px] leading-[1.55]">
                      {idx === 0 && <span className="wave-hand mr-1">👋</span>}
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div
                    key={m.id}
                    className="msg-right self-end max-w-[80%] bg-orange text-white rounded-[18px] rounded-br-[6px] px-4 py-2.5 text-[14px] font-semibold leading-[1.5] break-words"
                  >
                    {m.text}
                  </div>
                )
              )}

              {typing && (
                <div className="msg-left flex items-end gap-2">
                  <BotAvatar />
                  <div className="bg-cloud rounded-[18px] rounded-bl-[6px] px-4 py-3.5 flex gap-1.5" aria-label="Xpert is typing">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="typing-dot w-2 h-2 rounded-full bg-muted" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* quick replies */}
              {step === "services" && (
                <div className="pl-10 flex flex-col gap-2.5">
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_OPTIONS.map((s, i) => {
                      const on = picked.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setPicked((p) => (on ? p.filter((x) => x !== s) : [...p, s]))}
                          aria-pressed={on}
                          className={`chip-pop text-[13px] font-semibold rounded-full border-[1.5px] px-3.5 py-1.5 transition-colors ${
                            on ? "bg-orange border-orange text-white" : "bg-white border-orange/50 text-ink hover:border-orange"
                          }`}
                          style={{ animationDelay: `${i * 60}ms` }}
                        >
                          {on ? "✓ " : ""}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={confirmServices}
                    disabled={!picked.length}
                    className="chip-pop self-start text-[13px] font-bold rounded-full bg-ink text-white px-4 py-2 disabled:opacity-30 transition-opacity"
                    style={{ animationDelay: `${SERVICE_OPTIONS.length * 60}ms` }}
                  >
                    Continue →
                  </button>
                </div>
              )}

              {step === "about" && (
                <div className="pl-10">
                  <button
                    type="button"
                    onClick={skipAbout}
                    className="chip-pop text-[13px] font-semibold rounded-full border-[1.5px] border-silver bg-white text-muted px-3.5 py-1.5 hover:border-orange hover:text-ink transition-colors"
                  >
                    Skip — I&apos;ll share on the call
                  </button>
                </div>
              )}

              {step === "timeline" && (
                <div className="pl-10 flex flex-wrap gap-2">
                  {TIMELINE_OPTIONS.map((t, i) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => pickTimeline(t)}
                      className="chip-pop text-[13px] font-semibold rounded-full border-[1.5px] border-orange/50 bg-white text-ink px-3.5 py-1.5 hover:bg-orange hover:border-orange hover:text-white transition-colors"
                      style={{ animationDelay: `${i * 70}ms` }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}

              {step === "done" && (
                <div className="msg-left ml-10 bg-white border-[1.5px] border-orange/40 rounded-[18px] p-4 shadow-[0_14px_36px_-18px_rgba(245,166,35,0.6)]">
                  <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-muted mb-2.5">Project summary</div>
                  <dl className="grid grid-cols-[76px_1fr] gap-x-3 gap-y-1.5 text-[13px]">
                    {[
                      ["Name", data.name],
                      ["Services", data.services.join(", ")],
                      ["Project", data.about || "—"],
                      ["Start", data.timeline],
                      ["Contact", data.contact],
                    ].map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-muted font-semibold">{k}</dt>
                        <dd className="text-ink font-semibold break-words">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="text-[12px] text-muted mt-3">Send it our way and we&apos;ll reply within 24 hours.</p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center text-[13px] font-bold rounded-full bg-[#25D366] text-white px-3 py-2.5 hover:bg-[#20BD5A] transition-colors"
                    >
                      Send on WhatsApp
                    </a>
                    <a
                      href={mailLink}
                      className="text-center text-[13px] font-bold rounded-full bg-orange text-white px-3 py-2.5 hover:bg-orange-dk transition-colors"
                    >
                      Send by Email
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* composer */}
            <form onSubmit={handleText} className="border-t border-silver px-3 py-3 bg-white">
              {error && <div className="text-[12px] font-semibold text-[#C8372D] px-2 pb-2">{error}</div>}
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode={step === "contact" ? "email" : "text"}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={!PLACEHOLDERS[step]}
                  placeholder={
                    PLACEHOLDERS[step] ||
                    (step === "done" ? "All set — send your summary above" : typing ? "Xpert is typing…" : "Choose an option above")
                  }
                  aria-label="Your reply"
                  className="flex-1 min-w-0 bg-cloud rounded-full px-4 py-3 text-[14px] text-ink placeholder:text-muted/70 outline-none border-[1.5px] border-transparent focus:border-orange/60 disabled:opacity-60 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!PLACEHOLDERS[step] || !input.trim()}
                  aria-label="Send"
                  className="w-11 h-11 rounded-full bg-orange text-white flex items-center justify-center flex-shrink-0 transition-all hover:bg-orange-dk active:scale-90 disabled:bg-silver disabled:text-muted"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
