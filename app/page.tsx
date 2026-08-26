"use client";

import React, {
  JSX,
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
  word: string;
  meanings: string[];
  familyWords: string[];
  wordType: string;
  example: string;
  notes: string;
  color: string;
}

const wordTypes = [
  { value: "noun", label: "اسم (Noun)", short: "n" },
  { value: "verb", label: "فعل (Verb)", short: "v" },
  {
    value: "adjective",
    label: "صفت (Adjective)",
    short: "adj",
  },
  {
    value: "adverb",
    label: "قید (Adverb)",
    short: "adv",
  },
  {
    value: "pronoun",
    label: "ضمیر (Pronoun)",
    short: "pron",
  },
  {
    value: "preposition",
    label: "حرف اضافه (Preposition)",
    short: "prep",
  },
  {
    value: "conjunction",
    label: "حرف ربط (Conjunction)",
    short: "conj",
  },
  {
    value: "interjection",
    label: "حرف ندا (Interjection)",
    short: "interj",
  },
  {
    value: "determiner",
    label: "تعیین‌کننده (Determiner)",
    short: "det",
  },
];

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

type IconName =
  | "share"
  | "download"
  | "plus"
  | "trash"
  | "book"
  | "type"
  | "check"
  | "chevron";

interface IconProps {
  name: IconName;
  size?: number;
}

function Icon({
  name,
  size = 18,
}: IconProps) {
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
    share: (
      <>
        <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
        <path d="m16 6-4-4-4 4" />
        <path d="M12 2v12" />
      </>
    ),

    download: (
      <>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 20h14" />
      </>
    ),

    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
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

    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
        <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
      </>
    ),

    type: (
      <>
        <path d="M4 6V4h16v2" />
        <path d="M12 4v16" />
        <path d="M8 20h8" />
      </>
    ),

    check: <path d="m5 12 4 4L19 6" />,

    chevron: <path d="m6 9 6 6 6-6" />,
  };

  return <svg {...common}>{icons[name]}</svg>;
}

interface MeaningListProps {
  meanings: string[];
  setMeanings: React.Dispatch<React.SetStateAction<string[]>>;
}

function MeaningList({
  meanings,
  setMeanings,
}: MeaningListProps) {
  const updateMeaning = (
    index: number,
    value: string
  ) => {
    setMeanings((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const addMeaning = () => {
    setMeanings((current) => [...current, ""]);
  };

  const removeMeaning = (index: number) => {
    setMeanings((current) => {
      if (current.length === 1) {
        return [""];
      }

      return current.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="meaning-list">
      {meanings.map((meaning, index) => (
        <div
          className="meaning-row"
          key={index}
        >
          <span className="meaning-number">
            {index + 1}
          </span>

          <input
            value={meaning}
            onChange={(event) =>
              updateMeaning(
                index,
                event.target.value
              )
            }
            placeholder={
              index === 0
                ? "مثلاً: مقاوم و توانمند در بازگشت"
                : "یک معنی دیگر..."
            }
            aria-label={`معنی ${index + 1}`}
            dir="rtl"
            autoComplete="off"
          />

          {meanings.length > 1 && (
            <button
              type="button"
              className="remove-button"
              onClick={() =>
                removeMeaning(index)
              }
              aria-label={`حذف معنی ${index + 1}`}
            >
              <Icon
                name="trash"
                size={15}
              />
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        className="add-meaning"
        onClick={addMeaning}
      >
        <Icon
          name="plus"
          size={15}
        />
        افزودن معنی
      </button>
    </div>
  );
}

interface FamilyWordsProps {
  familyWords: string[];
  setFamilyWords: React.Dispatch<
    React.SetStateAction<string[]>
  >;
}

function FamilyWords({
  familyWords,
  setFamilyWords,
}: FamilyWordsProps) {
  const updateFamilyWord = (
    index: number,
    value: string
  ) => {
    setFamilyWords((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  return (
    <div className="family-list">
      {familyWords.map(
        (familyWord, index) => (
          <input
            key={index}
            value={familyWord}
            onChange={(event) =>
              updateFamilyWord(
                index,
                event.target.value
              )
            }
            placeholder={`هم‌خانواده ${index + 1}`}
            aria-label={`هم‌خانواده ${index + 1}`}
            dir="ltr"
            autoComplete="off"
            spellCheck={false}
          />
        )
      )}
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
    palettes.find(
      (item) => item.name === data.color
    ) || palettes[0];

  const meanings = data.meanings.filter(
    (meaning) => meaning.trim()
  );

  const familyWords =
    data.familyWords.filter(
      (familyWord) => familyWord.trim()
    );

  const wordType =
    wordTypes.find(
      (item) =>
        item.value === data.wordType
    );

  const cardStyle =
    {
      "--accent": palette.value,
      "--glow": palette.glow,
      "--surface": palette.surface,

      /*
       * مهم:
       * هیچ height ثابتی برای کارت تعیین نشده.
       * کارت بر اساس محتوا رشد می‌کند.
       */
      height: "auto",
      minHeight: "320px",
    } as React.CSSProperties;

  return (
    <div
      ref={cardRef}
      className="card-export"
      style={cardStyle}
    >
      <div className="card-glow" />

      <div
        className="card-main"
        dir="ltr"
        style={{
          height: "auto",
          minHeight: "0",
        }}
      >
        <div
          className="card-word-row"
          dir="ltr"
        >
          <div
            className="card-word"
            dir="ltr"
          >
            {data.word.trim() ||
              "Your word"}
          </div>

          {wordType && (
            <span
              className="card-word-type"
              title={wordType.label}
            >
              {wordType.short}
            </span>
          )}
        </div>

        {familyWords.length > 0 && (
          <div
            className="card-family"
            dir="ltr"
          >
            {familyWords.join(" / ")}
          </div>
        )}

        <div className="card-divider" />

        {data.example.trim() && (
          <div className="card-section">
            <span
              className="card-label"
              dir="ltr"
            >
              EXAMPLE
            </span>

            <p
              className="card-example"
              dir="ltr"
              style={{
                marginBottom: 0,
              }}
            >
              “{data.example.trim()}”
            </p>
          </div>
        )}

        <div className="card-section">
          <span
            className="card-label"
            dir="rtl"
          >
            معنی فارسی
          </span>

          {meanings.length > 0 ? (
            <div
              className="card-meaning-inline"
              dir="rtl"
            >
              {meanings.join(" / ")}
            </div>
          ) : (
            <div
              className="card-empty"
              dir="rtl"
            >
              معنی کلمه اینجا نمایش داده
              می‌شود.
            </div>
          )}
        </div>

        {data.notes.trim() && (
          <div
            className="card-note"
            dir="rtl"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 20,
              overflow: "hidden",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            <span>↳</span>

            <div
              dir="rtl"
              style={{
                whiteSpace: "pre-line",
              }}
            >
              {data.notes.trim()}
            </div>
          </div>
        )}
      </div>

      <div
        className="card-bottom"
        dir="rtl"
      >
        

        <span className="card-dot" />
      </div>
    </div>
  );
}

export default function Home() {
  const [word, setWord] =
    useState("");

  const [meanings, setMeanings] =
    useState<string[]>([""]);

  const [familyWords, setFamilyWords] =
    useState<string[]>([
      "",
      "",
      "",
    ]);

  const [wordType, setWordType] =
    useState("");

  const [example, setExample] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [color, setColor] =
    useState("violet");

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [isSharing, setIsSharing] =
    useState(false);

  const [toast, setToast] =
    useState("");

  const cardRef =
    useRef<HTMLDivElement>(null);

  const data = useMemo<CardData>(
    () => ({
      word,
      meanings,
      familyWords,
      wordType,
      example,
      notes,
      color,
    }),
    [
      word,
      meanings,
      familyWords,
      wordType,
      example,
      notes,
      color,
    ]
  );

  /*
   * تمام فیلدهای ضروری
   */
  const hasWord =
    Boolean(word.trim());

  const hasMeaning =
    meanings.some(
      (meaning) =>
        meaning.trim().length > 0
    );

  const hasWordType =
    Boolean(wordType.trim());

  const hasExample =
    Boolean(example.trim());

  /*
   * فعال شدن CTA فقط زمانی که
   * همه‌ی فیلدهای ضروری کامل باشند.
   */
  const canShare =
    hasWord &&
    hasMeaning &&
    hasWordType &&
    hasExample;

  /*
   * جزئیات دیگر اختیاری هستند.
   */
  const hasDetails =
    Boolean(
      familyWords.some(
        (familyWord) =>
          familyWord.trim()
      ) ||
        notes.trim() ||
        color !== "violet"
    );

  const showToast = (
    message: string
  ) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2500);
  };

  const validate = () => {
    if (!hasWord) {
      showToast(
        "اول کلمه انگلیسی را وارد کن."
      );
      return false;
    }

    if (!hasMeaning) {
      showToast(
        "حداقل یک معنی وارد کن."
      );
      return false;
    }

    if (!hasWordType) {
      showToast(
        "نوع کلمه را انتخاب کن."
      );
      return false;
    }

    if (!hasExample) {
      showToast(
        "مثال را در یک جمله وارد کن."
      );
      return false;
    }

    return true;
  };

  const createPng = async () => {
    if (!cardRef.current) {
      throw new Error(
        "Card reference is missing."
      );
    }

    /*
     * قبل از export یک frame صبر می‌کنیم
     * تا layout نهایی DOM کامل شود.
     */
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() =>
        resolve()
      )
    );

    return toPng(
      cardRef.current,
      {
        pixelRatio: 2.4,
        cacheBust: true,
        backgroundColor: "#0b0912",
      }
    );
  };

  const exportCard = async () => {
    if (!validate()) {
      return;
    }

    if (!cardRef.current) {
      showToast(
        "کارت آماده نیست."
      );
      return;
    }

    try {
      const dataUrl =
        await createPng();

      const link =
        document.createElement("a");

      const safeWord =
        word
          .trim()
          .toLowerCase()
          .replace(
            /[^a-z0-9]+/g,
            "-"
          ) ||
        "vocabulary-card";

      link.download =
        `${safeWord}-vocabulary-card.png`;

      link.href = dataUrl;
      link.click();

      showToast(
        "تصویر کارت دانلود شد."
      );
    } catch (error) {
      console.error(error);

      showToast(
        "ساخت تصویر انجام نشد."
      );
    }
  };

  const shareCard = async () => {
  if (!cardRef.current || isSharing) {
    return;
  }

  if (!validate()) {
    return;
  }

  if (typeof navigator.share !== "function") {
    showToast(
      "اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود."
    );
    return;
  }

  setIsSharing(true);

  try {
    // ساخت تصویر فقط در حافظه
    const dataUrl = await createPng();

    // تبدیل Data URL به Blob در حافظه
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const safeWord =
      word
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") ||
      "vocabulary-card";

    // فایل موقت فقط برای Web Share API
    const file = new File(
      [blob],
      `${safeWord}-vocabulary-card.png`,
      {
        type: "image/png",
      }
    );

    // بررسی پشتیبانی مرورگر از اشتراک‌گذاری فایل
    if (
      typeof navigator.canShare === "function" &&
      !navigator.canShare({
        files: [file],
      })
    ) {
      showToast(
        "اشتراک‌گذاری عکس در این مرورگر پشتیبانی نمی‌شود."
      );
      return;
    }

    /*
     * مهم:
     * اینجا هیچ دانلود یا ذخیره‌ای انجام نمی‌شود.
     *
     * فایل فقط به Share Sheet سیستم‌عامل
     * تحویل داده می‌شود.
     */
    await navigator.share({
      title: `${word.trim()} — کارت لغت`,
      files: [file],
    });
  } catch (error: unknown) {
    const err = error as Error;

    // کاربر Share Sheet را بسته است.
    if (err?.name === "AbortError") {
      return;
    }

    console.error(
      "Share failed:",
      error
    );

    showToast(
      "اشتراک‌گذاری انجام نشد."
    );
  } finally {
    setIsSharing(false);
  }
};

  return (
    <main className="app">
      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <Icon
              name="book"
              size={17}
            />
          </div>

          <span>
            Vocabulary Card
          </span>
        </div>
      </header>

      <section className="creator">
        <div className="editor">
          <div className="editor-title">
            <h1>
              کارت لغت بساز
            </h1>

            <span>
              سریع و ساده
            </span>
          </div>

          {/* ========================= */}
          {/* REQUIRED FIELDS            */}
          {/* ========================= */}

          <div className="field">
            <label htmlFor="word">
              کلمه انگلیسی
              <span
                className="required-mark"
                aria-hidden="true"
              >
                *
              </span>
            </label>

            <div className="input-wrap">
              <Icon
                name="type"
                size={18}
              />

              <input
                id="word"
                value={word}
                onChange={(event) =>
                  setWord(
                    event.target.value
                  )
                }
                placeholder="مثلاً resilient"
                autoCapitalize="none"
                autoComplete="off"
                spellCheck={false}
                aria-required="true"
              />
            </div>
          </div>

          <div className="field">
            <label>
              معنی فارسی
              <span
                className="required-mark"
                aria-hidden="true"
              >
                *
              </span>
            </label>

            <MeaningList
              meanings={meanings}
              setMeanings={
                setMeanings
              }
            />
          </div>

          {/* نوع کلمه از بخش جزئیات خارج شد */}
          <div className="field">
            <label
              htmlFor="wordType"
            >
              نوع کلمه
              <span
                className="required-mark"
                aria-hidden="true"
              >
                *
              </span>
            </label>

            <div className="select-wrap">
              <select
                id="wordType"
                value={wordType}
                onChange={(event) =>
                  setWordType(
                    event.target.value
                  )
                }
                required
                aria-required="true"
              >
                <option value="">
                  انتخاب نوع کلمه
                </option>

                {wordTypes.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  )
                )}
              </select>

              <Icon
                name="chevron"
                size={15}
              />
            </div>
          </div>

          {/* مثال هم فیلد اصلی است */}
          <div className="field">
            <label htmlFor="example">
              مثال در جمله
              <span
                className="required-mark"
                aria-hidden="true"
              >
                *
              </span>

              <span className="field-hint">
                یک جمله واقعی و کوتاه
              </span>
            </label>

            <textarea
              id="example"
              value={example}
              onChange={(event) =>
                setExample(
                  event.target.value
                )
              }
              placeholder="مثلاً: She stayed resilient after a difficult week."
              rows={3}
              dir="ltr"
              spellCheck
              required
              aria-required="true"
            />
          </div>

          {/* ========================= */}
          {/* OPTIONAL DETAILS           */}
          {/* ========================= */}

          <button
            type="button"
            className={`details-toggle ${
              detailsOpen
                ? "open"
                : ""
            }`}
            onClick={() =>
              setDetailsOpen(
                (current) =>
                  !current
              )
            }
            aria-expanded={
              detailsOpen
            }
          >
            <span className="details-left">
              <span className="details-title">
                جزئیات بیشتر
              </span>

              <span className="details-subtitle">
                هم‌خانواده، توضیحات و رنگ کارت

                <span
                  className={`detail-status ${
                    hasDetails
                      ? "filled"
                      : ""
                  }`}
                >
                  {hasDetails
                    ? "تکمیل شده"
                    : "اختیاری"}
                </span>
              </span>
            </span>

            <span className="details-chevron">
              <Icon
                name="chevron"
                size={16}
              />
            </span>
          </button>

          {detailsOpen && (
            <div className="details-content">
              <div className="detail-field">
                <label>
                  هم‌خانواده‌ها
                  <span>
                    حداکثر ۳ مورد
                  </span>
                </label>

                <FamilyWords
                  familyWords={
                    familyWords
                  }
                  setFamilyWords={
                    setFamilyWords
                  }
                />
              </div>

              {/* توضیحات با محدودیت 5 خط */}
              <div className="detail-field">
                <label htmlFor="notes">
                  توضیحات بیشتر
                  <span>
                    حداکثر ۵ خط
                  </span>
                </label>

                <textarea
                  id="notes"
                  value={notes}
                  onChange={(event) =>
                    setNotes(
                      event.target.value
                    )
                  }
                  placeholder="مثلاً تلفظ، مترادف یا یک نکته برای به خاطر سپردن..."
                  rows={5}
                  maxLength={500}
                  dir="rtl"
                  style={{
                    minHeight:
                      "140px",
                  }}
                />

                <div className="character-counter">
                  {notes.length}/500
                </div>
              </div>

              <div className="color-field">
                <div>
                  <label>
                    رنگ کارت
                  </label>

                  <span>
                    برای شخصی‌سازی کارت
                  </span>
                </div>

                <div
                  className="palette"
                  role="radiogroup"
                  aria-label="رنگ کارت"
                >
                  {palettes.map(
                    (item) => (
                      <button
                        key={item.name}
                        type="button"
                        className={`swatch ${
                          color ===
                          item.name
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          setColor(
                            item.name
                          )
                        }
                        aria-label={`انتخاب رنگ ${item.label}`}
                        aria-pressed={
                          color ===
                          item.name
                        }
                        title={
                          item.label
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
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================= */}
        {/* PREVIEW                    */}
        {/* ========================= */}

        <div className="preview">
          <div className="preview-header">
            <span>
              پیش‌نمایش
            </span>

            <span className="live">
              <i />
              زنده
            </span>
          </div>

          <div
            className="preview-stage"
            style={{
              alignItems: "flex-start",
              paddingTop: "24px",
              paddingBottom: "24px",
            }}
          >
            <CardPreview
              data={data}
              cardRef={cardRef}
            />
          </div>
        </div>

        {/* ========================= */}
        {/* ACTIONS                    */}
        {/* ========================= */}

        <button
          type="button"
          className="share-button"
          disabled={
            !canShare ||
            isSharing
          }
          onClick={
            shareCard
          }
        >
          <Icon
            name="share"
            size={18}
          />

          <span>
            {isSharing
              ? "در حال آماده‌سازی..."
              : "اشتراک‌گذاری کارت"}
          </span>
        </button>

        <button
          type="button"
          className="download-button"
          disabled={!canShare}
          onClick={
            exportCard
          }
        >
          <Icon
            name="download"
            size={16}
          />

          دانلود PNG
        </button>

        {!canShare && (
          <p className="required-hint">
            برای ساخت کارت، کلمه، معنی، نوع
            کلمه و مثال را کامل کن.
          </p>
        )}
      </section>

      {toast && (
        <div
          className="toast"
          role="status"
          aria-live="polite"
        >
          <Icon
            name="check"
            size={15}
          />

          {toast}
        </div>
      )}
    </main>
  );
}