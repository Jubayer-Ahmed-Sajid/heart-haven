"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type Vent = {
  _id: string;
  alias: string;
  body: string;
  mood: string;
  createdAt: string;
};

type Resource = {
  _id: string;
  name: string;
  type: string;
  location: string;
  phone?: string;
  website?: string;
  note?: string;
};

type FundingOption = {
  name: string;
  status: string;
  channel: string;
};

type Streak = {
  _id: string;
  sessionId: string;
  streakDays: number;
  lastContactAt?: string | null;
  lastCheckInAt?: string | null;
};

type SupportMessage = {
  _id: string;
  conversationId: string;
  senderAlias: string;
  body: string;
  createdAt: string;
};

type ConversationSession = {
  token: string;
  alias: string;
  conversationId: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const comfortLines = [
  "আজ একটু কষ্ট লাগলেও, শ্বাসটা ধীরে নিলে মন একটু নরম হয়।",
  "ভেঙে যাওয়া মানে শেষ নয় — একটু একটু করে গড়ে ওঠার শুরু।",
  "একাই পার হতে হবে না; ছোট্ট একধাপও progress.",
];

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function Home() {
  const [health, setHealth] = useState<{ ok: boolean; service: string } | null>(null);
  const [vents, setVents] = useState<Vent[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [funding, setFunding] = useState<FundingOption[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [comfortQuote, setComfortQuote] = useState(comfortLines[0]);
  const [sessionId, setSessionId] = useState("");
  const [ventAlias, setVentAlias] = useState("Anonymous");
  const [ventMood, setVentMood] = useState("heavy");
  const [ventBody, setVentBody] = useState("");
  const [checkContacted, setCheckContacted] = useState(false);
  const [loadingVents, setLoadingVents] = useState(false);
  const [loadingStreak, setLoadingStreak] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [supportAlias, setSupportAlias] = useState("Anonymous");
  const [supportRoomKey, setSupportRoomKey] = useState("heart-haven-support");
  const [supportState, setSupportState] = useState<ConversationSession | null>(null);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [supportDraft, setSupportDraft] = useState("");
  const [supportStatus, setSupportStatus] = useState("Offline");

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("heart-haven-support-session");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as ConversationSession;
      if (parsed?.token && parsed?.conversationId && parsed?.alias) {
        setSupportState(parsed);
        setSupportAlias(parsed.alias);
      }
    } catch {
      window.localStorage.removeItem("heart-haven-support-session");
    }
  }, []);

  useEffect(() => {
    let alive = true;

    async function bootstrap() {
      try {
        const [healthData, ventData, resourceData, fundingData] = await Promise.all([
          fetchJson<{ ok: boolean; service: string }>("/api/health"),
          fetchJson<{ items: Vent[] }>("/api/vents"),
          fetchJson<{ items: Resource[] }>("/api/resources"),
          fetchJson<{ items: FundingOption[] }>("/api/funding/mock"),
        ]);

        if (!alive) return;
        setHealth(healthData);
        setVents(ventData.items);
        setResources(resourceData.items);
        setFunding(fundingData.items);
      } catch (error) {
        if (alive) setNotice(error instanceof Error ? error.message : "Failed to load initial data");
      }
    }

    bootstrap();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("heart-haven-session-id");
    const nextSession = stored || `hh-${window.crypto.randomUUID().slice(0, 8)}`;
    if (!stored) window.localStorage.setItem("heart-haven-session-id", nextSession);
    setSessionId(nextSession);
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    let alive = true;
    async function loadStreak() {
      try {
        setLoadingStreak(true);
        const data = await fetchJson<{ item: Streak }>(`/api/no-contact/${sessionId}`);
        if (!alive) return;
        setStreak(data.item);
      } catch (error) {
        if (alive) setNotice(error instanceof Error ? error.message : "Failed to load streak");
      } finally {
        if (alive) setLoadingStreak(false);
      }
    }

    loadStreak();
    return () => {
      alive = false;
    };
  }, [sessionId]);

  useEffect(() => {
    if (!supportState?.token || !supportState.conversationId) return;

    const socket = io(apiBase, {
      transports: ["websocket"],
      auth: { token: supportState.token },
    });

    socket.on("connect", () => {
      setSupportStatus("Connected");
      socket.emit("support:join", { conversationId: supportState.conversationId });
    });

    socket.on("disconnect", () => setSupportStatus("Disconnected"));
    socket.on("support:message:new", (message: SupportMessage) => {
      setSupportMessages((current) =>
        current.some((item) => item._id === message._id) ? current : [...current, message]
      );
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [supportState?.token, supportState?.conversationId]);

  useEffect(() => {
    if (!supportState?.token || !supportState.conversationId) return;

    let alive = true;
    fetchJson<{ items: SupportMessage[] }>(`/api/support/conversations/${supportState.conversationId}/messages`, {
      headers: {
        Authorization: `Bearer ${supportState.token}`,
      },
    })
      .then((response) => {
        if (alive) {
          setSupportMessages(response.items);
        }
      })
      .catch((error) => {
        if (alive) {
          setNotice(error instanceof Error ? error.message : "Could not restore support chat");
        }
      });

    return () => {
      alive = false;
    };
  }, [supportState?.token, supportState?.conversationId]);

  const latestQuote = useMemo(() => streak?.streakDays ? comfortQuote : comfortLines[0], [streak?.streakDays, comfortQuote]);

  async function submitVent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ventBody.trim()) return;

    try {
      setLoadingVents(true);
      const response = await fetchJson<{ item: Vent }>("/api/vents", {
        method: "POST",
        body: JSON.stringify({
          alias: ventAlias,
          body: ventBody,
          mood: ventMood,
        }),
      });

      setVents((current) => [response.item, ...current].slice(0, 20));
      setVentBody("");
      setNotice("Your Moner Kotha was saved.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save vent");
    } finally {
      setLoadingVents(false);
    }
  }

  async function checkIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!sessionId) return;

    try {
      setLoadingStreak(true);
      const response = await fetchJson<{ item: Streak; quote: string | null }>(
        `/api/no-contact/${sessionId}/check-in`,
        {
          method: "POST",
          body: JSON.stringify({ contactedEx: checkContacted }),
        }
      );

      setStreak(response.item);
      if (response.quote) setComfortQuote(response.quote);
      setNotice(checkContacted ? "Streak reset. Be gentle with yourself." : "Streak updated. Keep going.");
      setCheckContacted(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not update streak");
    } finally {
      setLoadingStreak(false);
    }
  }

  async function refreshComfortQuote() {
    try {
      const response = await fetchJson<{ quote: string }>(`/api/no-contact/${sessionId || "heart-haven"}/weak`);
      setComfortQuote(response.quote);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load quote");
    }
  }

  async function enterSupportRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetchJson<{ item: { _id: string }; token: string; alias: string }>(
        "/api/auth/session",
        {
          method: "POST",
          body: JSON.stringify({
            roomKey: supportRoomKey,
            alias: supportAlias,
            topic: "breakup-support",
          }),
        }
      );

      const conversationId = response.item._id;
      const session: ConversationSession = {
        token: response.token,
        alias: response.alias,
        conversationId,
      };

      setSupportState(session);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("heart-haven-support-session", JSON.stringify(session));
      }

      const messageData = await fetchJson<{ items: SupportMessage[] }>(`/api/support/conversations/${conversationId}/messages`, {
        headers: {
          Authorization: `Bearer ${response.token}`,
        },
      });
      setSupportMessages(messageData.items);
      setSupportStatus("Connecting...");
      setNotice("Support room is ready.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not open support room");
    }
  }

  async function sendSupportMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supportDraft.trim() || !supportState) return;

    const body = supportDraft;
    setSupportDraft("");

    try {
      const socket = socketRef.current;
      if (socket?.connected) {
        socket.emit(
          "support:message",
          {
            conversationId: supportState.conversationId,
            body,
            senderAlias: supportState.alias,
          },
          (ack: { ok: boolean; error?: string }) => {
            if (!ack.ok) setNotice(ack.error || "Message failed");
          }
        );
        return;
      }

      const response = await fetchJson<{ item: SupportMessage }>("/api/support/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supportState.token}`,
        },
        body: JSON.stringify({
          conversationId: supportState.conversationId,
          body,
        }),
      });
      setSupportMessages((current) => [...current, response.item]);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not send support message");
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 font-semibold text-rose-700">
            Heart-Haven
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{health ? health.service : "Loading service"}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{sessionId ? `Session ${sessionId.slice(-6)}` : "Preparing session"}</span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              A quiet digital sanctuary for healing after heartbreak.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Mobile-first, anonymous, and made for Bangladesh — with Moner Kotha, no-contact streaks,
              private support rooms, and local resources in one calm place.
            </p>
            <div className="flex flex-wrap gap-3">
              <a className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white" href="#modules">
                Explore modules
              </a>
              <a className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700" href="#support">
                Join support chat
              </a>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-lg sm:p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Today’s comfort note</p>
            <p className="mt-3 text-lg leading-8 text-slate-100">{latestQuote}</p>
            <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
              <span>No-contact streak</span>
              <span className="font-semibold text-white">{streak?.streakDays ?? 0} days</span>
            </div>
          </div>
        </div>
      </section>

      {notice ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {notice}
        </div>
      ) : null}

      <section id="modules" className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Moner Kotha", "Anonymous vent feed for letting the pain out safely."],
          ["No-Contact Engine", "Track your streak and get gentle Bengali comfort quotes."],
          ["Support Chat", "Private support rooms with JWT + Socket.io."],
          ["Resource Directory", "Mental health support in Dhaka and across Bangladesh."],
        ].map(([title, text]) => (
          <article key={title} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Moner Kotha</h2>
              <p className="text-sm text-slate-500">Say it once, breathe out, move forward.</p>
            </div>
            <button
              type="button"
              onClick={() => setVents((current) => current)}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
            >
              Live feed
            </button>
          </div>

          <form onSubmit={submitVent} className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={ventAlias}
                onChange={(event) => setVentAlias(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-0 transition focus:border-rose-300"
                placeholder="Alias"
                maxLength={40}
              />
              <select
                value={ventMood}
                onChange={(event) => setVentMood(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-rose-300"
              >
                <option value="heavy">Heavy</option>
                <option value="quiet">Quiet</option>
                <option value="hopeful">Hopeful</option>
                <option value="angry">Angry</option>
              </select>
            </div>
            <textarea
              value={ventBody}
              onChange={(event) => setVentBody(event.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-rose-300"
              placeholder="Write what you want to release..."
              maxLength={1200}
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">Anonymous by design. Be kind to yourself.</p>
              <button
                type="submit"
                disabled={loadingVents}
                className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loadingVents ? "Saving..." : "Post vent"}
              </button>
            </div>
          </form>

          <div className="mt-5 space-y-3">
            {vents.map((vent) => (
              <article key={vent._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span>
                    {vent.alias} · {vent.mood}
                  </span>
                  <span>{formatDate(vent.createdAt)}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{vent.body}</p>
              </article>
            ))}
          </div>
        </article>

        <div className="space-y-4">
          <article className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-semibold text-slate-950">No-Contact Engine</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Keep one streak, one check-in, one healing day at a time.
            </p>
            <form onSubmit={checkIn} className="mt-4 space-y-3">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={checkContacted}
                  onChange={(event) => setCheckContacted(event.target.checked)}
                />
                I contacted my ex today
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={loadingStreak}
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {loadingStreak ? "Updating..." : "Check in"}
                </button>
                <button
                  type="button"
                  onClick={refreshComfortQuote}
                  className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                >
                  New comfort quote
                </button>
              </div>
            </form>

            <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-950">
              <p className="font-semibold">Current streak</p>
              <p className="mt-1 text-2xl font-semibold">{streak?.streakDays ?? 0} days</p>
              <p className="mt-2 leading-6">{comfortQuote}</p>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-semibold text-slate-950">Future funding rails</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Mock payment scaffolds are ready for testing product flows.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {funding.map((item) => (
                <span key={item.name} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {item.name}
                </span>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold text-slate-950">Bangladesh support directory</h2>
          <div className="mt-4 space-y-3">
            {resources.map((resource) => (
              <div key={resource._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-950">{resource.name}</h3>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{resource.type}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">{resource.location}</span>
                </div>
                {resource.note ? <p className="mt-2 text-sm leading-6 text-slate-600">{resource.note}</p> : null}
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  {resource.phone ? <span className="text-slate-700">☎ {resource.phone}</span> : null}
                  {resource.website ? (
                    <a href={resource.website} target="_blank" rel="noreferrer" className="font-semibold text-rose-700">
                      Visit site
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article id="support" className="rounded-3xl border border-slate-200/80 bg-slate-950 p-5 text-white shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Private support room</h2>
              <p className="mt-1 text-sm text-slate-300">JWT session + Socket.io chat scaffold.</p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">{supportStatus}</span>
          </div>

          <form onSubmit={enterSupportRoom} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={supportAlias}
              onChange={(event) => setSupportAlias(event.target.value)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
              placeholder="Your alias"
            />
            <input
              value={supportRoomKey}
              onChange={(event) => setSupportRoomKey(event.target.value)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
              placeholder="Room key"
            />
            <button
              type="submit"
              className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 sm:col-span-2"
            >
              Enter room
            </button>
          </form>

          <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Room</p>
            <p className="mt-1 break-all text-slate-300">
              {supportState?.conversationId ? `Conversation ${supportState.conversationId}` : "No room joined yet"}
            </p>
            {supportState ? (
              <button
                type="button"
                onClick={() => {
                  setSupportState(null);
                  setSupportMessages([]);
                  setSupportDraft("");
                  setSupportStatus("Offline");
                  if (typeof window !== "undefined") {
                    window.localStorage.removeItem("heart-haven-support-session");
                  }
                }}
                className="mt-3 rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white"
              >
                Leave room
              </button>
            ) : null}
          </div>

          <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
            {supportMessages.map((message) => (
              <div key={message._id} className="rounded-2xl bg-white/8 px-4 py-3">
                <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                  <span>{message.senderAlias}</span>
                  <span>{formatDate(message.createdAt)}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-100">{message.body}</p>
              </div>
            ))}
          </div>

          <form onSubmit={sendSupportMessage} className="mt-4 flex gap-3">
            <input
              value={supportDraft}
              onChange={(event) => setSupportDraft(event.target.value)}
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
              placeholder="Write a supportive message..."
            />
            <button
              type="submit"
              className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950"
            >
              Send
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
