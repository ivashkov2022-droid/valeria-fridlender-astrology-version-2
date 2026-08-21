"use client";

/* eslint-disable @next/next/no-img-element */

import { FormEvent, useEffect, useMemo, useState } from "react";

type Sphere = {
  id: string;
  symbol: string;
  title: string;
  note: string;
  intro: string;
  questions: string[];
};

const spheres: Sphere[] = [
  { id: "relationships", symbol: "♀", title: "Отношения и любовь", note: "близость · совместимость", intro: "Когда важно понять не только другого человека, но и то, что происходит между вами.", questions: ["Что происходит между нами сейчас?", "Как устроена наша совместимость?", "Почему сценарий отношений повторяется?"] },
  { id: "career", symbol: "♃", title: "Карьера и работа", note: "роль · реализация", intro: "Когда прежняя роль стала тесной, а следующий профессиональный шаг ещё неочевиден.", questions: ["В каком деле раскрываются мои сильные стороны?", "Подходящий ли сейчас момент для перемен?", "Почему я не чувствую себя на своём месте?"] },
  { id: "business", symbol: "♄", title: "Бизнес и деньги", note: "ресурсы · партнёрство", intro: "Когда решение затрагивает ресурсы, партнёров и будущее проекта.", questions: ["Почему рост остановился именно сейчас?", "Подходим ли мы друг другу как партнёры?", "Какой период выбрать для нового запуска?"] },
  { id: "change", symbol: "☊", title: "Переезд и перемены", note: "маршрут · новый этап", intro: "Когда меняется город, работа или привычный уклад — и хочется увидеть маршрут целиком.", questions: ["Что я на самом деле ищу в переменах?", "Как подготовиться к новому этапу?", "Что сейчас мешает мне решиться?"] },
  { id: "family", symbol: "☽", title: "Семья и дети", note: "понимание · поколения", intro: "Когда важно лучше понимать близких и выйти из повторяющегося семейного сценария.", questions: ["Почему дома повторяется один конфликт?", "Как лучше понимать потребности ребёнка?", "Что создаёт напряжение между поколениями?"] },
  { id: "self", symbol: "☉", title: "О себе и развитии", note: "выбор · внутренняя опора", intro: "Когда главный вопрос не о событии, а о собственных желаниях, ритме и внутренней опоре.", questions: ["Чего я хочу на самом деле?", "Почему мне сложно сделать выбор?", "На что я могу опереться сейчас?"] },
];

const formats = [
  { code: "01", symbol: "✦", title: "Один вопрос", text: "Точечный персональный разбор ситуации, которая требует ясности сейчас." },
  { code: "02", symbol: "☌", title: "Совместимость", text: "Отношения, сексуальная совместимость или деловое партнёрство двух людей." },
  { code: "03", symbol: "◷", title: "Важная дата", text: "Период, запуск, переезд или событие, для которого важно выбрать верный момент." },
  { code: "04", symbol: "◎", title: "Большой разбор", text: "Целостная карта личности, повторяющихся сценариев и точек развития." },
];

const fontPairs = [
  { id: "prata", name: "Prata × Manrope", note: "Строго и редакционно" },
  { id: "cormorant", name: "Cormorant × Manrope", note: "Мягко и атмосферно" },
  { id: "forum", name: "Forum × Onest", note: "Тонко и свободно" },
  { id: "tenor", name: "Tenor Sans × Manrope", note: "Современно и спокойно" },
] as const;

const zodiacSigns = [
  ["♈", "Овен", "21.03 — 20.04"], ["♉", "Телец", "21.04 — 21.05"],
  ["♊", "Близнецы", "22.05 — 21.06"], ["♋", "Рак", "22.06 — 22.07"],
  ["♌", "Лев", "23.07 — 23.08"], ["♍", "Дева", "24.08 — 22.09"],
  ["♎", "Весы", "23.09 — 23.10"], ["♏", "Скорпион", "24.10 — 22.11"],
  ["♐", "Стрелец", "23.11 — 21.12"], ["♑", "Козерог", "22.12 — 20.01"],
  ["♒", "Водолей", "21.01 — 18.02"], ["♓", "Рыбы", "19.02 — 20.03"],
] as const;

const testimonials = [
  { quote: "Я пришла с одним вопросом об отношениях, а увидела всю систему — почему выбираю именно таких людей и где могу поступить иначе.", name: "Мария", theme: "Отношения" },
  { quote: "После разбора стало понятно, почему прежняя работа больше не подходит и какой следующий шаг действительно мой.", name: "Анна", theme: "Карьера" },
  { quote: "Это был не прогноз ради прогноза. Я получила ясную картину партнёрства и смогла спокойно принять решение.", name: "Елена", theme: "Бизнес" },
];

const articles = [
  { number: "01", sign: "♀ × ♂", meta: "Отношения · 7 минут", title: "Совместимость — больше, чем ответ «подходим ли мы друг другу»" },
  { number: "02", sign: "?", meta: "Практика · 5 минут", title: "Как сформулировать вопрос, чтобы получить полезный разбор" },
  { number: "03", sign: "♃", meta: "Бизнес · 9 минут", title: "Что стоит увидеть до начала нового партнёрства" },
];

const monthNames = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"] as const;
const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;
type DatePickerTarget = "one" | "two";

function getDateCode(value: string) {
  let result = value.replace(/\D/g, "").split("").reduce((sum, digit) => sum + Number(digit), 0);
  while (result > 9) result = String(result).split("").reduce((sum, digit) => sum + Number(digit), 0);
  return result;
}

function formatDate(value: string) {
  if (!value) return "";
  if (value.includes(".")) return value;
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}

function formatBirthDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join(".");
}

function getCompatibilityRhythm(codeOne: number, codeTwo: number) {
  const gap = Math.abs(codeOne - codeTwo);
  if (gap === 0) return { title: "Зеркальный ритм", text: "Вы тонко считываете реакции друг друга. Сила такой пары — в узнаваемости, а задача — оставлять место различиям." };
  if (gap <= 2) return { title: "Созвучный ритм", text: "Ваши способы двигаться и принимать решения близки. Договорённости обычно рождаются легко, если ожидания названы вслух." };
  if (gap <= 4) return { title: "Дополняющий ритм", text: "Вы по-разному смотрите на ситуацию, и именно это может стать ресурсом пары. Важно не превращать различие в борьбу ролей." };
  return { title: "Контрастный ритм", text: "Между вами много энергии различий. Притяжение может быть сильным, а устойчивость появляется через ясные границы и договорённости." };
}

export default function Home() {
  const assetBase = import.meta.env.BASE_URL ?? "/";
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalId, setModalId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState(spheres[0].id);
  const [question, setQuestion] = useState(spheres[0].questions[0]);
  const [sent, setSent] = useState(false);
  const [compatibilityReady, setCompatibilityReady] = useState(false);
  const [dateOne, setDateOne] = useState("");
  const [dateTwo, setDateTwo] = useState("");
  const [datePickerTarget, setDatePickerTarget] = useState<DatePickerTarget | null>(null);
  const [pickerDay, setPickerDay] = useState(1);
  const [pickerMonth, setPickerMonth] = useState(0);
  const [pickerYear, setPickerYear] = useState(1990);
  const [compatibilityFocus, setCompatibilityFocus] = useState("Отношения");
  const [askStep, setAskStep] = useState(1);
  const [askName, setAskName] = useState("");
  const [askContact, setAskContact] = useState("");
  const [fontPair, setFontPair] = useState("prata");
  const [fontPanelOpen, setFontPanelOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const modalSphere = useMemo(() => spheres.find((item) => item.id === modalId) ?? null, [modalId]);
  const codeOne = getDateCode(dateOne);
  const codeTwo = getDateCode(dateTwo);
  const compatibilityRhythm = getCompatibilityRhythm(codeOne, codeTwo);
  const daysInPickerMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
  const pickerMonthOffset = (new Date(pickerYear, pickerMonth, 1).getDay() + 6) % 7;

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 800);
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalSphere || mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalSphere, mobileOpen]);

  function goToQuestion(value: string, sphereId?: string) {
    if (sphereId) setActiveId(sphereId);
    setQuestion(value);
    setAskStep(1);
    setModalId(null);
    window.setTimeout(() => document.querySelector("#ask")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function submitGuide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    goToQuestion(String(data.get("guideQuestion") ?? ""));
  }

  function prepareCompatibility(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCompatibilityReady(true);
  }

  function openDatePicker(target: DatePickerTarget) {
    const value = target === "one" ? dateOne : dateTwo;
    const [day, month, year] = value.split(".").map(Number);
    if (day && month && year) {
      setPickerDay(day);
      setPickerMonth(Math.max(0, Math.min(11, month - 1)));
      setPickerYear(year);
    } else {
      setPickerDay(1);
      setPickerMonth(0);
      setPickerYear(1990);
    }
    setDatePickerTarget(target);
  }

  function choosePickerMonth(month: number) {
    setPickerMonth(month);
    setPickerDay((day) => Math.min(day, new Date(pickerYear, month + 1, 0).getDate()));
  }

  function applyPickedDate() {
    const value = `${String(pickerDay).padStart(2, "0")}.${String(pickerMonth + 1).padStart(2, "0")}.${pickerYear}`;
    if (datePickerTarget === "one") setDateOne(value);
    if (datePickerTarget === "two") setDateTwo(value);
    setDatePickerTarget(null);
  }

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  const nav = (
    <>
      <a href="#directions" onClick={() => setMobileOpen(false)}>Темы</a>
      <a href="#formats" onClick={() => setMobileOpen(false)}>Разборы</a>
      <a href="#compatibility" onClick={() => setMobileOpen(false)}>Совместимость</a>
      <a href="#about" onClick={() => setMobileOpen(false)}>О Валерии</a>
    </>
  );

  return (
    <main id="top" data-font={fontPair} className={`astralla-page ${loaded ? "is-loaded" : ""}`}>
      <div className={`astralla-preloader ${loaded ? "is-hidden" : ""}`} aria-hidden="true"><i>✦</i><i>✧</i><i>✦</i></div>

      <div className={`font-lab ${fontPanelOpen ? "is-open" : ""}`}>
        <button className="font-lab-toggle" type="button" aria-expanded={fontPanelOpen} onClick={() => setFontPanelOpen((value) => !value)}><span>Aa</span><small>Шрифты</small></button>
        <aside aria-label="Конструктор шрифтов">
          <div className="font-lab-heading"><span>Примерить типографику</span><button type="button" aria-label="Закрыть конструктор" onClick={() => setFontPanelOpen(false)}>×</button></div>
          <p>Выберите пару — весь сайт изменится сразу.</p>
          {fontPairs.map((pair) => <button className={fontPair === pair.id ? "is-active" : ""} type="button" key={pair.id} onClick={() => setFontPair(pair.id)}><b>{pair.name}</b><small>{pair.note}</small></button>)}
        </aside>
      </div>

      <header className={`astralla-header ${scrolled ? "is-sticky" : ""}`}>
        <a className="astralla-wordmark" href="#top" aria-label="Валерия Фридлендер — главная"><strong>VALERIA</strong><small>ФРИДЛЕНДЕР</small></a>
        <nav aria-label="Основная навигация"><a className="is-current" href="#top">Главная</a>{nav}</nav>
        <a className="astralla-appointment" href="#ask"><span>Записаться</span></a>
        <button className="constellation-menu" type="button" aria-label="Открыть меню" aria-expanded={mobileOpen} onClick={() => setMobileOpen((value) => !value)}><i /><i /><i /><i /></button>
        <div className={`mobile-navigation ${mobileOpen ? "is-open" : ""}`}><a href="#top" onClick={() => setMobileOpen(false)}>Главная</a>{nav}<a href="#ask" onClick={() => setMobileOpen(false)}>Задать вопрос</a></div>
      </header>

      <section className="astralla-hero" aria-labelledby="hero-title" style={{ backgroundImage: `url(${assetBase}images/valeria-direct-gaze-hero-v2.png)` }}>
        <span className="hero-star hero-star-one" aria-hidden="true">✦</span><span className="hero-star hero-star-two" aria-hidden="true">✧</span><span className="hero-star hero-star-three" aria-hidden="true">✦</span>
        <div className="astralla-hero-copy">
          <p>Астрология · Нумерология · Цифровая психология</p>
          <h1 id="hero-title">Ответ на ваш<br />жизненный вопрос</h1>
          <p className="astralla-hero-lead">Индивидуальный разбор отношений, карьеры, денег, переезда или семьи — по дате рождения и контексту вашей ситуации.</p>
          <a className="astralla-button" href="#ask"><span>Задать вопрос</span></a>
        </div>
        <div className="astralla-hero-meta"><span>Валерия Фридлендер</span><span>Санкт-Петербург · онлайн по всему миру</span></div>
      </section>

      <section className="guide-section" aria-labelledby="guide-title">
        <div className="guide-orbit" aria-hidden="true"><i /><i /><i /><span>☉</span></div>
        <div className="guide-copy"><p className="eyebrow">Начните с главного</p><h2 id="guide-title">Какой вопрос<br /><em>не даёт вам покоя?</em></h2><p>Не нужно выбирать готовый гороскоп. Опишите ситуацию своими словами — вопрос станет центром персонального разбора.</p></div>
        <form className="guide-form" onSubmit={submitGuide}><label><span>Ваш вопрос</span><textarea name="guideQuestion" rows={3} placeholder="Например: почему отношения повторяются по одному сценарию?" required /></label><div className="guide-form-row"><label><span>Дата рождения</span><input name="birthDate" type="date" required /></label><button type="submit"><span>Продолжить</span></button></div><small>Ответ готовит Валерия лично — это не автоматическая расшифровка.</small></form>
      </section>

      <section className="life-flow" aria-labelledby="life-flow-title">
        <div className="life-flow-intro"><p className="eyebrow">Сферы жизни</p><h2 id="life-flow-title">Вопрос редко живёт<br /><em>только в одной точке</em></h2><p>Работа влияет на отношения, отношения — на выбор, выбор — на ощущение своего пути. Поэтому мы смотрим на ситуацию целиком.</p></div>
        <div className="life-flow-list">{spheres.slice(0, 4).map((sphere, index) => <button type="button" key={sphere.id} onClick={() => setModalId(sphere.id)}><span className="life-flow-sign" aria-hidden="true"><i /><b>{sphere.symbol}</b></span><small>0{index + 1}</small><span className="life-flow-copy"><strong>{sphere.title}</strong><em>{sphere.note}</em></span><span className="life-flow-arrow">↗</span></button>)}</div>
      </section>

      <section className="formats" id="formats" aria-labelledby="formats-title">
        <div className="section-heading centered"><p className="eyebrow">Персональный формат</p><h2 id="formats-title">Один путь к ясности.<br /><em>Разные точки входа.</em></h2></div>
        <div className="format-river">{formats.map((item, index) => <article key={item.code}><div className="format-river-art" aria-hidden="true"><i /><i /><span>{item.symbol}</span></div><small>{item.code} / разбор</small><div><h3>{item.title}</h3><p>{item.text}</p></div><a href="#ask" aria-label={`Узнать формат: ${item.title}`}><span>узнать</span><b>↗</b></a><em aria-hidden="true">0{index + 1}</em></article>)}</div>
      </section>

      <section className="path-banner" aria-label="Персональный подход"><div className="path-stars" aria-hidden="true"><i>✦</i><i>✧</i><i>✦</i></div><p>Дата рождения · контекст ситуации</p><h2>Личный вопрос.<br />Личный ответ.</h2><a className="astralla-button" href="#ask"><span>Обсудить ситуацию</span></a></section>

      <section className="zodiac-atlas" aria-labelledby="zodiac-title">
        <div className="zodiac-mist zodiac-mist-one" aria-hidden="true" /><div className="zodiac-mist zodiac-mist-two" aria-hidden="true" />
        <div className="zodiac-heading"><p className="eyebrow">Зодиакальный атлас</p><h2 id="zodiac-title">Двенадцать знаков.<br /><em>Один неповторимый человек.</em></h2><p>Знак — не готовый ответ и не ярлык. Это только одна линия в более сложной персональной карте.</p></div>
        <div className="zodiac-orbit" aria-label="Двенадцать знаков зодиака">{zodiacSigns.map(([symbol, title, dates], index) => <button type="button" key={title} onClick={() => goToQuestion(`Хочу узнать, как знак ${title} проявляется в моей персональной карте.`)}><span className="zodiac-drawing" aria-hidden="true"><i /><i /><i /><b>{symbol}</b></span><strong>{title}</strong><small>{dates}</small><em>0{index + 1}</em></button>)}</div>
      </section>

      <section className="directions" id="directions" aria-labelledby="directions-title">
        <div className="section-heading"><div><p className="eyebrow">Карта вопросов</p><h2 id="directions-title">Найдите свою<br /><em>сферу жизни</em></h2></div><p>Выберите тему. Внутри — примеры вопросов, с которыми можно прийти на персональный разбор.</p></div>
        <div className="sphere-flow">{spheres.map((sphere, index) => <button type="button" key={sphere.id} onClick={() => setModalId(sphere.id)}><span className="sphere-flow-number">0{index + 1}</span><span className="sphere-flow-art" aria-hidden="true"><i /><i /><b>{sphere.symbol}</b></span><span className="sphere-flow-copy"><h3>{sphere.title}</h3><p>{sphere.note}</p></span><span className="sphere-flow-arrow">→</span></button>)}</div>
      </section>

      <section className="compatibility" id="compatibility" aria-labelledby="compatibility-title">
        <div className="compatibility-aura" aria-hidden="true"><span>♀</span><i /><b>♂</b></div>
        <div className="compatibility-copy"><p className="eyebrow light">Можно попробовать сейчас</p><h2 id="compatibility-title">Совместимость<br /><em>партнёров</em></h2><p>Введите две даты рождения и сразу получите первый ориентир о ритме вашей пары. Для глубокого ответа Валерия разберёт вашу ситуацию индивидуально.</p><ul><li><span>A</span> что создаёт притяжение</li><li><span>B</span> где рождается напряжение</li><li><span>C</span> на что может опереться пара</li></ul></div>
        <div className={`compatibility-tool compatibility-tool-v2 ${compatibilityReady ? "is-result" : ""}`}>
          <div className="tool-header compatibility-tool-header"><span>ЭКСПРЕСС-СОВМЕСТИМОСТЬ</span><span>01 — 02</span></div>
          {compatibilityReady ? (
            <div className="compatibility-result compatibility-result-v2" role="status">
              <p>Ваш первый результат</p>
              <div className="compatibility-codes" aria-label={`Ваш код ${codeOne}, код партнёра ${codeTwo}`}>
                <span><small>Ваш код</small><b>{codeOne}</b></span><i>×</i><span><small>Код партнёра</small><b>{codeTwo}</b></span>
              </div>
              <h3>{compatibilityRhythm.title}</h3>
              <p className="compatibility-result-lead">{compatibilityRhythm.text}</p>
              <dl><div><dt>Вы</dt><dd>{formatDate(dateOne)}</dd></div><div><dt>Партнёр</dt><dd>{formatDate(dateTwo)}</dd></div><div><dt>Фокус</dt><dd>{compatibilityFocus}</dd></div></dl>
              <small className="compatibility-disclaimer">Это экспресс-ориентир по числовым кодам дат, а не полный разбор совместимости.</small>
              <button type="button" onClick={() => goToQuestion(`Хочу получить персональный разбор совместимости. Фокус: ${compatibilityFocus}. Моя дата: ${dateOne}. Дата партнёра: ${dateTwo}.`, "relationships")}>Получить персональный разбор <span>→</span></button>
              <button className="tool-reset" type="button" onClick={() => setCompatibilityReady(false)}>Проверить другие даты</button>
            </div>
          ) : (
            <form className="compatibility-form compatibility-form-v2" onSubmit={prepareCompatibility}>
              <p className="compatibility-invitation">Введите свою дату и дату партнёра — первый результат появится сразу.</p>
              <div className="partner-pair partner-pair-soft">
                <article className="partner-card partner-card-self">
                  <span className="partner-number">01</span>
                  <div className="partner-card-heading"><strong>Вы</strong></div>
                  <div className="partner-date-entry"><label htmlFor="date-one">Дата рождения</label><div className="partner-date-control"><input id="date-one" aria-label="Ваша дата рождения" type="text" inputMode="numeric" autoComplete="bday" placeholder="ДД.ММ.ГГГГ" pattern="[0-9]{2}[.][0-9]{2}[.][0-9]{4}" maxLength={10} value={dateOne} onChange={(event) => setDateOne(formatBirthDateInput(event.target.value))} required /><button className="partner-calendar" type="button" aria-label="Выбрать вашу дату рождения в календаре" aria-expanded={datePickerTarget === "one"} onClick={() => openDatePicker("one")}><i aria-hidden="true" /><span>Выбрать</span></button></div></div>
                </article>
                <span className="partner-cross" aria-hidden="true">и</span>
                <article className="partner-card partner-card-other">
                  <span className="partner-number">02</span>
                  <div className="partner-card-heading"><strong>Ваш партнёр</strong></div>
                  <div className="partner-date-entry"><label htmlFor="date-two">Дата рождения</label><div className="partner-date-control"><input id="date-two" aria-label="Дата рождения вашего партнёра" type="text" inputMode="numeric" autoComplete="off" placeholder="ДД.ММ.ГГГГ" pattern="[0-9]{2}[.][0-9]{2}[.][0-9]{4}" maxLength={10} value={dateTwo} onChange={(event) => setDateTwo(formatBirthDateInput(event.target.value))} required /><button className="partner-calendar" type="button" aria-label="Выбрать дату рождения партнёра в календаре" aria-expanded={datePickerTarget === "two"} onClick={() => openDatePicker("two")}><i aria-hidden="true" /><span>Выбрать</span></button></div></div>
                </article>
              </div>
              {datePickerTarget && <div className="date-picker-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDatePickerTarget(null); }}><div className="date-picker" role="dialog" aria-modal="true" aria-labelledby="date-picker-title"><div className="date-picker-heading"><div><small>{datePickerTarget === "one" ? "Ваша дата" : "Дата партнёра"}</small><h3 id="date-picker-title">Выберите дату рождения</h3></div><button type="button" aria-label="Закрыть календарь" onClick={() => setDatePickerTarget(null)}>×</button></div><div className="date-picker-year"><button type="button" aria-label="Предыдущий год" onClick={() => setPickerYear((year) => Math.max(1930, year - 1))}>−</button><label><span>Год</span><input type="number" min="1930" max={new Date().getFullYear()} value={pickerYear} onChange={(event) => setPickerYear(Math.max(1930, Math.min(new Date().getFullYear(), Number(event.target.value))))} /></label><button type="button" aria-label="Следующий год" onClick={() => setPickerYear((year) => Math.min(new Date().getFullYear(), year + 1))}>+</button></div><div className="date-picker-months" aria-label="Месяц">{monthNames.map((month, index) => <button type="button" className={pickerMonth === index ? "is-active" : ""} aria-pressed={pickerMonth === index} key={month} onClick={() => choosePickerMonth(index)}>{month}</button>)}</div><div className="date-picker-week" aria-hidden="true">{weekDays.map((day) => <span key={day}>{day}</span>)}</div><div className="date-picker-days">{Array.from({ length: pickerMonthOffset }, (_, index) => <span key={`empty-${index}`} />)}{Array.from({ length: daysInPickerMonth }, (_, index) => index + 1).map((day) => <button type="button" className={pickerDay === day ? "is-active" : ""} aria-pressed={pickerDay === day} key={day} onClick={() => setPickerDay(day)}>{day}</button>)}</div><div className="date-picker-footer"><span>{String(pickerDay).padStart(2, "0")}.{String(pickerMonth + 1).padStart(2, "0")}.{pickerYear}</span><button type="button" onClick={applyPickedDate}>Выбрать дату <b>→</b></button></div></div></div>}
              <fieldset className="compatibility-focus"><legend>Что хотите понять?</legend><div>{["Отношения", "Близость", "Деловое партнёрство"].map((focus) => <button key={focus} type="button" className={compatibilityFocus === focus ? "is-active" : ""} aria-pressed={compatibilityFocus === focus} onClick={() => setCompatibilityFocus(focus)}>{focus}</button>)}</div></fieldset>
              <button className="compatibility-submit" type="submit"><span>Получить первый результат</span><b>→</b></button>
              <small className="compatibility-promise">Займёт меньше минуты. Результат появится сразу на этой странице.</small>
            </form>
          )}
        </div>
      </section>

      <section className="testimonials" aria-labelledby="testimonials-title"><div className="section-heading centered"><p className="eyebrow">После разбора</p><h2 id="testimonials-title">Когда связи становятся<br /><em>видимыми</em></h2></div><div className="testimonial-slider"><button type="button" aria-label="Предыдущий отзыв" onClick={() => setTestimonialIndex((testimonialIndex - 1 + testimonials.length) % testimonials.length)}>←</button><figure key={testimonialIndex}><span aria-hidden="true">“</span><blockquote>{testimonials[testimonialIndex].quote}</blockquote><figcaption><b>{testimonials[testimonialIndex].name}</b><small>0{testimonialIndex + 1} · {testimonials[testimonialIndex].theme}</small></figcaption></figure><button type="button" aria-label="Следующий отзыв" onClick={() => setTestimonialIndex((testimonialIndex + 1) % testimonials.length)}>→</button></div><div className="testimonial-dots" aria-label="Выбрать отзыв">{testimonials.map((item,index) => <button type="button" className={testimonialIndex === index ? "is-active" : ""} aria-label={`Отзыв ${index + 1}: ${item.name}`} key={item.name} onClick={() => setTestimonialIndex(index)} />)}</div></section>

      <section className="about about-immersive" id="about" aria-labelledby="about-title"><div className="about-portrait"><img className="about-portrait-primary" src={`${assetBase}images/valeria-about-close-original-v3.jpg`} alt="Валерия Фридлендер" /><img className="about-portrait-secondary" src={`${assetBase}images/valeria-about-hover-original-v3.jpg`} alt="" aria-hidden="true" /><div className="about-photo-sign"><span>Валерия Фридлендер</span><small>Астрология · Нумерология · Цифровая психология</small></div></div><div className="about-copy"><p className="eyebrow">О Валерии</p><h2 id="about-title">Расчёт — только начало.<br /><em>В центре всегда человек.</em></h2><p className="about-lead">Валерия соединяет астрологию, нумерологию и цифровую психологию. Поэтому разговор начинается не с абстрактного описания характера, а с ситуации, которая требует решения сейчас.</p><blockquote>«Моя задача — не решить за вас, а показать связи, которые трудно заметить изнутри ситуации».</blockquote><dl><div><dt>01</dt><dd><b>Лично</b><span>Каждый запрос Валерия изучает сама.</span></dd></div><div><dt>02</dt><dd><b>Предметно</b><span>В центре — конкретный вопрос, а не набор характеристик.</span></dd></div><div><dt>03</dt><dd><b>Понятно</b><span>Выводы переводятся в ясный человеческий язык.</span></dd></div></dl><a className="text-link" href="#ask">Обсудить свою ситуацию</a></div></section>

      <section className="journal" id="journal" aria-labelledby="journal-title"><div className="section-heading"><div><p className="eyebrow">Материалы</p><h2 id="journal-title">Жизненные вопросы.<br /><em>Без мистического тумана.</em></h2></div><p>Конкретные темы помогают заранее понять подход Валерии и точнее сформулировать собственный запрос.</p></div><div className="article-grid">{articles.map((article) => <a href="#ask" key={article.number}><span>{article.number}</span><i aria-hidden="true">{article.sign}</i><small>{article.meta}</small><h3>{article.title}</h3><b>Читать материал →</b></a>)}</div></section>

      <section className="ask" id="ask" aria-labelledby="ask-title">
        <div className="ask-copy"><p className="eyebrow light">Персональный запрос</p><h2 id="ask-title">Задайте вопрос<br /><em>Валерии</em></h2><p>Не анкета и не тест. Три коротких шага, чтобы Валерия поняла вашу ситуацию и предложила подходящий формат разбора.</p><div><span>CONFIDENTIAL</span><small>Данные используются только для ответа на ваш запрос.</small></div></div>
        {sent ? <div className="sent-state" role="status"><span>✓</span><p>Вопрос принят</p><h3>Спасибо.<br />Начало положено.</h3><small>Валерия ознакомится с вашим вопросом и свяжется с вами по указанному контакту.</small><button type="button" onClick={() => { setSent(false); setAskStep(1); }}>Задать другой вопрос</button></div> : (
          <form className="ask-form ask-dialogue" onSubmit={submitQuestion}>
            <input type="hidden" name="sphere" value={activeId} /><input type="hidden" name="name" value={askName} /><input type="hidden" name="question" value={question} />
            <div className="ask-form-progress"><span>0{askStep}</span><i><b style={{ width: `${askStep * 33.333}%` }} /></i><small>03</small></div>
            {askStep === 1 && <div className="ask-step" key="ask-name"><p>Начнём с простого</p><h3>Как к вам<br />обращаться?</h3><label className="ask-dialogue-field"><span>Ваше имя</span><input value={askName} onChange={(event) => setAskName(event.target.value)} placeholder="Напишите имя" /></label><button className="ask-next" type="button" disabled={!askName.trim()} onClick={() => setAskStep(2)}>Продолжить <span>→</span></button></div>}
            {askStep === 2 && <div className="ask-step" key="ask-question"><p>{askName}, теперь о главном</p><h3>Что вы хотите<br />понять?</h3><label className="ask-dialogue-field"><span>Ваш вопрос</span><textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Опишите ситуацию так, как чувствуете" rows={3} /></label><button className="ask-next" type="button" disabled={!question.trim()} onClick={() => setAskStep(3)}>Продолжить <span>→</span></button></div>}
            {askStep === 3 && <div className="ask-step" key="ask-contact"><p>Остался последний шаг</p><h3>Куда отправить<br />ответ?</h3><label className="ask-dialogue-field"><span>Telegram, WhatsApp или e-mail</span><input value={askContact} onChange={(event) => setAskContact(event.target.value)} placeholder="Укажите удобный контакт" required /></label><label className="consent"><input type="checkbox" required /><span>Я согласен(на) на обработку данных для ответа на мой запрос</span></label><button className="form-button ask-submit" type="submit">Передать вопрос Валерии <span>→</span></button></div>}
            {askStep > 1 && <button className="ask-back" type="button" onClick={() => setAskStep((step) => Math.max(1, step - 1))}>← Вернуться</button>}
          </form>
        )}
      </section>

      <footer className="site-footer"><div className="footer-intro"><a className="footer-brand-lockup" href="#top" aria-label="Валерия Фридлендер — наверх"><strong>VALERIA</strong><small>ФРИДЛЕНДЕР</small></a><p>Ваш вопрос заслуживает не общего прогноза, а внимательного персонального разбора.</p></div><div className="footer-columns"><div><h3>Темы</h3><a href="#directions">Отношения</a><a href="#directions">Карьера</a><a href="#directions">Бизнес и деньги</a><a href="#directions">Семья и дети</a></div><div><h3>Информация</h3><a href="#about">О Валерии</a><a href="#formats">Форматы разбора</a><a href="#journal">Материалы</a><a href="#ask">Задать вопрос</a></div><div><h3>Контакты</h3><a href="tel:+79111284444">+7 911 128-44-44</a><a href="mailto:valeryafridlender@gmail.com">E-mail</a><a href="https://t.me/Valeria_Fridlender" target="_blank" rel="noreferrer">Telegram ↗</a><a href="https://wa.me/79111284444" target="_blank" rel="noreferrer">WhatsApp ↗</a></div><div><h3>Подписка</h3><p>Получайте новые материалы Валерии.</p><form onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="Email*" aria-label="Email" /><button type="submit">Подписаться</button></form></div></div><div className="footer-nav"><span>© 2026 Валерия Фридлендер</span><div><a href="https://ivashkov2022-droid.github.io/valerya-fridlender-redesign-preview/privacy-policy">Политика конфиденциальности</a><a href="https://ivashkov2022-droid.github.io/valerya-fridlender-redesign-preview/personal-data-consent">Согласие на обработку данных</a></div><a href="#top">Наверх ↑</a></div></footer>

      {modalSphere && <div className="sphere-modal" role="dialog" aria-modal="true" aria-labelledby="sphere-modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalId(null); }}><div className="sphere-modal-card"><button className="modal-close" type="button" aria-label="Закрыть" onClick={() => setModalId(null)}>×</button><div className="modal-sign"><span aria-hidden="true">{modalSphere.symbol}</span><h3>{modalSphere.title}</h3><p>{modalSphere.note}</p><button type="button" onClick={() => goToQuestion("", modalSphere.id)}>Задать свой вопрос</button></div><div className="modal-content"><p className="eyebrow">Возможно, ваш вопрос звучит так</p><h2 id="sphere-modal-title">{modalSphere.intro}</h2>{modalSphere.questions.map((item) => <button type="button" key={item} onClick={() => goToQuestion(item, modalSphere.id)}><span>{item}</span><i>→</i></button>)}</div></div></div>}
    </main>
  );
}
