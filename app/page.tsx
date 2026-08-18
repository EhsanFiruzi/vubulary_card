"use client";

import React, {
  JSX,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toPng } from "html-to-image";

interface Palette {
  name: string;
  label: string;
  value: string;
  glow: string;
  surface: string;
}

interface CardData {
  id?: number;
  word: string;
  meanings: string[];
  example: string;
  notes: string;
  color: string;
}

const palettes: Palette[] = [
  {
    name: "violet",
    label: "بنفش",
    value: "#7c5cff",
    glow: "rgba(124, 92, 255, .38)",
    surface: "#1b1730",
  },
  {
    name: "ocean",
    label: "آبی",
    value: "#2f9bff",
    glow: "rgba(47, 155, 255, .34)",
    surface: "#10243a",
  },
  {
    name: "mint",
    label: "سبز",
    value: "#39c9a2",
    glow: "rgba(57, 201, 162, .30)",
    surface: "#122b26",
  },
  {
    name: "sunset",
    label: "نارنجی",
    value: "#ff7a59",
    glow: "rgba(255, 122, 89, .32)",
    surface: "#301c1a",
  },
  {
    name: "gold",
    label: "طلایی",
    value: "#f5b73b",
    glow: "rgba(245, 183, 59, .30)",
    surface: "#302617",
  },
];

const starter: CardData = {
  word: "resilient",
  meanings: [
    "توانایی بازیابی سریع بعد از سختی",
    "قوی ماندن بعد از یک دوره دشوار",
  ],
  example: "She stayed resilient after a difficult week.",
  notes: "یادآوری: بعد از هر سختی دوباره برمی‌گردد و تسلیم نمی‌شود.",
  color: palettes[0].name,
};

type IconName =
  | "sparkles"
  | "plus"
  | "trash"
  | "download"
  | "share"
  | "check"
  | "book"
  | "type"
  | "wand"
  | "history"
  | "chevron"
  | "x";

interface IconProps {
  name: IconName;
  size?: number;
}

function Icon({ name, size = 18 }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const icons: Record<IconName, JSX.Element> = {
    sparkles: (
      <>
        <path d="M12 3l1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
        <path d="M19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z" />
        <path d="M5 14l.6 1.8L7.5 16l-1.9.6L5 18.5l-.6-1.9L2.5 16l1.9-.2L5 14Z" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M9 7V4h6v3" />
        <path d="M6 7l1 13h10l1-13" />
        <path d="M10 11v5M14 11v5" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 20h14" />
      </>
    ),
    share: (
      <>
        <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
        <path d="m16 6-4-4-4 4" />
        <path d="M12 2v12" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
        <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
      </>
    ),
    type: (
      <>
        <path d="M4 6V4h16v2M12 4v16M8 20h8" />
      </>
    ),
    wand: (
      <>
        <path d="m15 4 5 5" />
        <path d="m13 6 5 5" />
        <path d="M4 20 14 10" />
        <path d="m4 14 6 6" />
      </>
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    x: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

interface WordMeaningsProps {
  meanings: string[];
  setMeanings: React.Dispatch<React.SetStateAction<string[]>>;
}

function WordMeanings({
  meanings,
  setMeanings,
}: WordMeaningsProps) {
  const update = (index: number, value: string) => {
    const next = [...meanings];
    next[index] = value;
    setMeanings(next);
  };

  const add = () => {
    setMeanings([...meanings, ""]);
  };

  const remove = (index: number) => {
    if (meanings.length <= 1) return;
    setMeanings(meanings.filter((_, i) => i !== index));
  };

  return (
    <div className="meaning-list">
      {meanings.map((meaning, index) => (
        <div className="meaning-row" key={index}>
          <span className="meaning-index">{index + 1}</span>

          <input
            value={meaning}
            onChange={(e) => update(index, e.target.value)}
            placeholder={
              index === 0
                ? "مثلاً: توانمند در بازگشت بعد از سختی"
                : "یک معنی دیگر..."
            }
            aria-label={`معنی ${index + 1}`}
          />

          {meanings.length > 1 && (
            <button
              type="button"
              className="icon-button"
              onClick={() => remove(index)}
              aria-label={`حذف معنی ${index + 1}`}
              title="حذف معنی"
            >
              <Icon name="trash" size={15} />
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        className="add-meaning"
        onClick={add}
      >
        <Icon name="plus" size={15} />
        افزودن معنی دیگر
      </button>
    </div>
  );
}

interface CardPreviewProps {
  data: CardData;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

function CardPreview({
  data,
  cardRef,
}: CardPreviewProps) {
  const palette =
    palettes.find((p) => p.name === data.color) || palettes[0];

  const cardStyle = {
    "--accent": palette.value,
    "--glow": palette.glow,
    "--card-surface": palette.surface,
  } as React.CSSProperties;

  const validMeanings = data.meanings.filter(Boolean);

  return (
    <div
      className="card-export"
      ref={cardRef}
      style={cardStyle}
    >
      <div className="card-noise" />

      <div className="card-topline">
        <span>VOCABULARY CARD</span>
        <span>
          #
          {data.word.trim()
            ? data.word.trim().slice(0, 1).toUpperCase()
            : "V"}
        </span>
      </div>

      <div className="card-word-wrap">
        <div className="card-word">
          {data.word || "Your word"}
        </div>

        <div className="card-tag">
          ENGLISH WORD • PERSIAN MEANING
        </div>
      </div>

      <div className="card-divider" />

      <div className="card-section">
        <span className="card-label">معنی فارسی</span>

        <div className="card-meanings">
          {validMeanings.length > 0 ? (
            validMeanings.map((meaning, i) => (
              <div
                key={i}
                className="card-meaning"
              >
                <span>{i + 1}</span>
                <div>{meaning}</div>
              </div>
            ))
          ) : (
            <div className="empty-copy">
              معنی فارسی کلمه را اضافه کنید.
            </div>
          )}
        </div>
      </div>

      {data.example.trim() && (
        <div className="card-section card-example">
          <span className="card-label">
            EXAMPLE SENTENCE
          </span>
          <p>“{data.example}”</p>
        </div>
      )}

      {data.notes.trim() && (
        <div className="card-note">
          <span>↳</span>
          {data.notes}
        </div>
      )}

      <div className="card-footer">
        <span>
          یاد بگیر. استفاده کن. به خاطر بسپار.
        </span>
        <span className="accent-dot" />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="brand">
        <div className="brand-mark">
          <Icon name="book" size={18} />
        </div>

        <span>
          Vocabulary <b>Card Maker</b>
        </span>
      </div>

      <div className="header-pill">
        <span className="status-dot" />
        Built for better recall
      </div>
    </header>
  );
}

export default function Home() {
  const [word, setWord] = useState<string>(
    starter.word
  );

  const [meanings, setMeanings] = useState<string[]>(
    starter.meanings
  );

  const [example, setExample] = useState<string>(
    starter.example
  );

  const [notes, setNotes] = useState<string>(
    starter.notes
  );

  const [color, setColor] = useState<string>(
    starter.color
  );

  const [saved, setSaved] = useState<CardData[]>([]);
  const [toast, setToast] = useState("");
  const [toastAction, setToastAction] = useState<
    (() => void) | null
  >(null);

  const [isSharing, setIsSharing] =
    useState(false);

  const [showAdvanced, setShowAdvanced] =
    useState(false);

  const [showCollection, setShowCollection] =
    useState(false);

  const [wordError, setWordError] =
    useState("");

  const [meaningError, setMeaningError] =
    useState("");

  const cardRef = useRef<HTMLDivElement>(null);
  const wordInputRef =
    useRef<HTMLInputElement>(null);

  const data: CardData = useMemo(
    () => ({
      word,
      meanings,
      example,
      notes,
      color,
    }),
    [word, meanings, example, notes, color]
  );

  const canCreate =
    word.trim().length > 0 &&
    meanings.some((meaning) => meaning.trim());

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("vcm-cards") || "[]"
      );

      if (Array.isArray(stored)) {
        setSaved(stored);
      }
    } catch {
      // ignore invalid localStorage
    }
  }, []);

  useEffect(() => {
    if (!toast) return;

    const id = window.setTimeout(() => {
      setToast("");
      setToastAction(null);
    }, 3200);

    return () => window.clearTimeout(id);
  }, [toast]);

  const notify = (
    message: string,
    action?: () => void
  ) => {
    setToast(message);
    setToastAction(() => action || null);
  };

  const validate = () => {
    let valid = true;

    if (!word.trim()) {
      setWordError("اول یک کلمه انگلیسی وارد کن.");
      valid = false;
    } else {
      setWordError("");
    }

    if (!meanings.some((meaning) => meaning.trim())) {
      setMeaningError("حداقل یک معنی وارد کن.");
      valid = false;
    } else {
      setMeaningError("");
    }

    return valid;
  };

  const saveCard = () => {
    if (!validate()) return;

    const newCard: CardData = {
      ...data,
      id: Date.now(),
    };

    const next = [newCard, ...saved].slice(0, 18);

    setSaved(next);
    localStorage.setItem(
      "vcm-cards",
      JSON.stringify(next)
    );

    notify("کارت در مجموعه‌ات ذخیره شد.");
  };

  const loadCard = (card: CardData) => {
    setWord(card.word);
    setMeanings(
      card.meanings?.length
        ? card.meanings
        : [""]
    );
    setExample(card.example || "");
    setNotes(card.notes || "");
    setColor(card.color || palettes[0].name);

    setWordError("");
    setMeaningError("");
    setShowAdvanced(
      Boolean(card.example || card.notes)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    notify("کارت بارگذاری شد.");
  };

  const createCard = () => {
    if (!validate()) {
      wordInputRef.current?.focus();
      return;
    }

    notify("کارت آماده است ✨");
  };

  const exportCard = async () => {
    if (!cardRef.current) return;

    if (!validate()) {
      return;
    }

    try {
      const dataUrl = await toPng(
        cardRef.current,
        {
          pixelRatio: 2.4,
          cacheBust: true,
          backgroundColor: "#0b0912",
        }
      );

      const link =
        document.createElement("a");

      const safeWord =
        word
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") ||
        "vocabulary-card";

      link.download = `${safeWord}-vocabulary-card.png`;
      link.href = dataUrl;
      link.click();

      notify("تصویر کارت دانلود شد.");
    } catch (error) {
      console.error(error);
      notify("ساخت تصویر با مشکل مواجه شد.");
    }
  };

  const shareCard = async () => {
    if (!cardRef.current || isSharing) {
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSharing(true);

    try {
      const dataUrl = await toPng(
        cardRef.current,
        {
          pixelRatio: 2.4,
          cacheBust: true,
          backgroundColor: "#0b0912",
        }
      );

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      const safeWord =
        word
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") ||
        "vocabulary-card";

      const file = new File(
        [blob],
        `${safeWord}-vocabulary-card.png`,
        {
          type: "image/png",
        }
      );

      if (
        typeof navigator.share !== "function"
      ) {
        notify(
          "اشتراک‌گذاری مستقیم در این مرورگر فعال نیست."
        );
        return;
      }

      if (
        typeof navigator.canShare ===
          "function" &&
        !navigator.canShare({
          files: [file],
        })
      ) {
        notify(
          "این مرورگر اشتراک‌گذاری مستقیم عکس را پشتیبانی نمی‌کند."
        );
        return;
      }

      await navigator.share({
        title: `${word || "Vocabulary"} — کارت لغت`,
        text: "یک کارت لغت برای یادگیری انگلیسی ساختم.",
        files: [file],
      });

      notify("کارت آماده اشتراک‌گذاری است.");
    } catch (error: unknown) {
      const err = error as Error;

      if (err?.name === "AbortError") {
        return;
      }

      console.error(
        "Share failed:",
        error
      );

      notify(
        "اشتراک‌گذاری انجام نشد. می‌توانی تصویر را دانلود کنی."
      );
    } finally {
      setIsSharing(false);
    }
  };

  const clearAll = () => {
    const previous: CardData = {
      ...data,
    };

    setWord("");
    setMeanings([""]);
    setExample("");
    setNotes("");
    setColor(palettes[0].name);

    setWordError("");
    setMeaningError("");
    setShowAdvanced(false);

    notify(
      "فرم پاک شد.",
      () => {
        setWord(previous.word);
        setMeanings(previous.meanings);
        setExample(previous.example);
        setNotes(previous.notes);
        setColor(previous.color);
      }
    );

    requestAnimationFrame(() => {
      wordInputRef.current?.focus();
    });
  };

  const hasContent =
    Boolean(word.trim()) ||
    meanings.some((x) => x.trim()) ||
    Boolean(example.trim()) ||
    Boolean(notes.trim());

  return (
    <main className="app-shell">
      <div
        className="ambient ambient-one"
        aria-hidden="true"
      />
      <div
        className="ambient ambient-two"
        aria-hidden="true"
      />

      <Header />

      <section className="hero">
        <div>
          <div className="eyebrow">
            <Icon name="sparkles" size={14} />
            یک کلمه را به چیزی تبدیل کن که یادت بماند.
          </div>

          <h1>
            کلمات انگلیسی را{" "}
            <span>به خاطر بسپار.</span>
          </h1>

          <p>
            کلمه را وارد کن، معنی‌اش را بنویس و در چند
            ثانیه یک کارت زیبا برای مرور و اشتراک‌گذاری
            بساز.
          </p>
        </div>

        <div className="hero-tip">
          <Icon name="wand" size={17} />

          <div>
            <b>نکته یادگیری</b>

            <span>
              یک جمله واقعی، کلمه را از یک تعریف خشک به
              چیزی قابل یادآوری تبدیل می‌کند.
            </span>
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="editor-panel panel">
          <div className="panel-heading">
            <div>
              <span className="step">01</span>

              <div>
                <h2>کارتت را بساز</h2>
                <p>
                  فقط اطلاعاتی را اضافه کن که به یادآوری
                  کمک می‌کنند.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={clearAll}
              disabled={!hasContent}
            >
              شروع جدید
            </button>
          </div>

          <label className="field-label">
            <span>
              کلمه انگلیسی
              <em className="required-mark">
                ضروری
              </em>
            </span>

            <small>
              کلمه‌ای را وارد کن که می‌خواهی یاد بگیری.
            </small>
          </label>

          <div
            className={`word-input-wrap ${
              wordError ? "has-error" : ""
            }`}
          >
            <Icon name="type" size={19} />

            <input
              ref={wordInputRef}
              className="word-input"
              value={word}
              onChange={(e) => {
                setWord(e.target.value);

                if (e.target.value.trim()) {
                  setWordError("");
                }
              }}
              placeholder="مثلاً resilient"
              autoCapitalize="none"
              autoComplete="off"
              spellCheck={false}
              aria-invalid={Boolean(wordError)}
              aria-describedby={
                wordError
                  ? "word-error"
                  : undefined
              }
            />
          </div>

          {wordError && (
            <div
              id="word-error"
              className="field-error"
            >
              {wordError}
            </div>
          )}

          <label className="field-label gap">
            <span>
              معنی فارسی
              <em className="required-mark">
                ضروری
              </em>
            </span>

            <small>
              برای یک کلمه می‌توانی چند معنی مرتبط بنویسی.
            </small>
          </label>

          <WordMeanings
            meanings={meanings}
            setMeanings={(value) => {
              setMeanings(value);

              const next =
                typeof value === "function"
                  ? value(meanings)
                  : value;

              if (
                Array.isArray(next) &&
                next.some((item) =>
                  item.trim()
                )
              ) {
                setMeaningError("");
              }
            }}
          />

          {meaningError && (
            <div className="field-error">
              {meaningError}
            </div>
          )}

          <button
            type="button"
            className="advanced-toggle"
            onClick={() =>
              setShowAdvanced((prev) => !prev)
            }
            aria-expanded={showAdvanced}
          >
            <span>
              گزینه‌های بیشتر
              <small>
                جمله نمونه، یادداشت و رنگ
              </small>
            </span>

            <span
              className={
                showAdvanced
                  ? "chevron open"
                  : "chevron"
              }
            >
              <Icon name="chevron" size={16} />
            </span>
          </button>

          {showAdvanced && (
            <div className="advanced-fields">
              <label className="field-label">
                <span>
                  جمله نمونه <em>اختیاری</em>
                </span>

                <small>
                  کلمه را در یک جمله واقعی به کار ببر.
                </small>
              </label>

              <textarea
                value={example}
                onChange={(e) =>
                  setExample(e.target.value)
                }
                rows={3}
                placeholder="مثلاً: She stayed resilient after a difficult week."
              />

              <label className="field-label">
                <span>
                  توضیحات بیشتر <em>اختیاری</em>
                </span>

                <small>
                  تلفظ، مترادف، نکته حفظی یا هر چیز مفید.
                </small>
              </label>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                rows={2}
                placeholder="مثلاً: تلفظ /rɪˈzɪliənt/ یا مترادف strong"
              />

              <div className="color-section">
                <div className="field-label">
                  <span>رنگ کارت</span>
                  <small>
                    رنگی را انتخاب کن که راحت‌تر یادت بماند.
                  </small>
                </div>

                <div
                  className="palette-row"
                  role="radiogroup"
                  aria-label="انتخاب رنگ کارت"
                >
                  {palettes.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      className={`swatch ${
                        color === item.name
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setColor(item.name)
                      }
                      aria-label={`انتخاب رنگ ${item.label}`}
                      aria-pressed={
                        color === item.name
                      }
                      style={
                        {
                          "--swatch":
                            item.value,
                        } as React.CSSProperties
                      }
                    >
                      <span
                        style={{
                          background:
                            item.value,
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="editor-actions">
            <button
              type="button"
              className="primary-button"
              onClick={shareCard}
              disabled={
                !canCreate || isSharing
              }
              aria-busy={isSharing}
            >
              <Icon
                name="share"
                size={17}
              />

              {isSharing
                ? "در حال آماده‌سازی..."
                : "اشتراک‌گذاری کارت"}
            </button>

            <div className="secondary-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={saveCard}
                disabled={!canCreate}
              >
                <Icon name="check" size={16} />
                ذخیره
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={exportCard}
                disabled={!canCreate}
              >
                <Icon
                  name="download"
                  size={16}
                />
                دانلود PNG
              </button>
            </div>
          </div>

          <div className="action-note">
            <span className="action-note-dot" />
            کارتت را بساز و بعد هرجا خواستی آن را به
            اشتراک بگذار.
          </div>
        </div>

        <div className="preview-panel">
          <div className="preview-heading">
            <div>
              <span className="step">02</span>

              <div>
                <h2>پیش‌نمایش زنده</h2>
                <p>
                  تغییراتت همین لحظه روی کارت دیده می‌شوند.
                </p>
              </div>
            </div>
          </div>

          <div className="preview-stage">
            <CardPreview
              data={data}
              cardRef={cardRef}
            />
          </div>

          <div className="preview-actions">
            <button
              type="button"
              className="preview-share"
              onClick={shareCard}
              disabled={!canCreate || isSharing}
            >
              <Icon name="share" size={16} />
              {isSharing
                ? "در حال آماده‌سازی..."
                : "اشتراک‌گذاری کارت"}
            </button>

            <button
              type="button"
              className="preview-download"
              onClick={exportCard}
              disabled={!canCreate}
            >
              <Icon
                name="download"
                size={16}
              />
              دانلود PNG
            </button>
          </div>

          <div className="share-hint">
            <div className="hint-icon">
              <Icon name="share" size={16} />
            </div>

            <div>
              <b>روی موبایل، Share Sheet باز می‌شود</b>

              <span>
                در مرورگرهای پشتیبانی‌شده، تصویر کارت مستقیماً
                وارد منوی اشتراک‌گذاری گوشی می‌شود.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="collection-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow muted-eyebrow">
              <Icon name="history" size={14} />
              مجموعه من
            </div>

            <h2>
              کارت‌هایی که ساخته‌ای.
            </h2>
          </div>

          {saved.length > 0 && (
            <div className="collection-meta">
              <span className="count-pill">
                {saved.length} کارت
              </span>

              {saved.length > 9 && (
                <button
                  type="button"
                  className="collection-toggle"
                  onClick={() =>
                    setShowCollection(
                      (prev) => !prev
                    )
                  }
                >
                  {showCollection
                    ? "نمایش کمتر"
                    : "مشاهده همه"}
                </button>
              )}
            </div>
          )}
        </div>

        {saved.length ? (
          <div className="saved-grid">
            {(showCollection
              ? saved
              : saved.slice(0, 9)
            ).map((card) => (
              <button
                type="button"
                key={card.id}
                className="saved-card"
                onClick={() =>
                  loadCard(card)
                }
              >
                <span
                  className="saved-accent"
                  style={{
                    background:
                      palettes.find(
                        (p) =>
                          p.name ===
                          card.color
                      )?.value ||
                      palettes[0].value,
                  }}
                />

                <div className="saved-card-top">
                  <strong>
                    {card.word ||
                      "بدون عنوان"}
                  </strong>

                  <span className="saved-open">
                    باز کردن
                  </span>
                </div>

                <span className="saved-meaning">
                  {card.meanings
                    .filter(Boolean)
                    .slice(0, 1)
                    .join(" · ") ||
                    "هنوز معنی ندارد"}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-collection">
            <div className="empty-icon">
              <Icon name="book" size={20} />
            </div>

            <div>
              <b>
                هنوز کارتی ذخیره نکرده‌ای.
              </b>

              <span>
                اولین کارتت را بساز و بعداً از همین‌جا
                دوباره بازش کن.
              </span>
            </div>
          </div>
        )}
      </section>

      <footer className="site-footer">
        <span>
          Vocabulary Card Maker
        </span>

        <span>
          برای یادگیری انگلیسی، نه فقط شناختن کلمه.
        </span>
      </footer>

      {toast && (
        <div
          className="toast"
          role="status"
          aria-live="polite"
        >
          <Icon name="check" size={16} />

          <span>{toast}</span>

          {toastAction && (
            <button
              type="button"
              className="toast-action"
              onClick={() => {
                toastAction();
                setToast("");
                setToastAction(null);
              }}
            >
              بازگردانی
            </button>
          )}
        </div>
      )}
    </main>
  );
}