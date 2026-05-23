import { useEffect, useRef, useState } from 'react';

const navItems = [
  { id: 'hero', label: 'Intro' },
  { id: 'ch1', label: '2021' },
  { id: 'ch2', label: 'Crucible' },
  { id: 'ch3', label: 'First Crown' },
  { id: 'ch4', label: 'The Return' },
  { id: 'ch5', label: 'Honours' },
  { id: 'ch6', label: 'The Present' },
  { id: 'gallery', label: 'Memories' },
  { id: 'letter', label: 'Letter' },
  { id: 'finale', label: 'Finale' }
];

const galleryItems = [
  { key: 'memory1', src: './Her Pictures/23fee02f-e552-48bd-a12f-efb529ea0537.JPG', label: 'Memory 1', caption: 'A moment from the journey' },
  { key: 'memory2', src: './Her Pictures/3c04e645-ee01-4f23-8537-12512d12ddfc.JPG', label: 'Memory 2', caption: 'A moment from the journey' },
  { key: 'memory3', src: './Her Pictures/5c9038a4-cee0-48da-8b5d-0dbd91d753c2.JPG', label: 'Memory 3', caption: 'A moment from the journey' },
  { key: 'memory4', src: './Her Pictures/c98498c6-4742-4154-9f8d-03a8b826225a.JPG', label: 'Memory 4', caption: 'A moment from the journey' },
  { key: 'memory5', src: './Her Pictures/cba10823-4418-4935-b5e7-a6b45641f775.JPG', label: 'Memory 5', caption: 'A moment from the journey' },
  { key: 'memory6', src: './Her Pictures/ddef480f-a8ce-4d9d-ab0d-a6618340ba41.JPG', label: 'Memory 6', caption: 'A moment from the journey' }
];

function App() {
  const grainRef = useRef(null);
  const pcanvasRef = useRef(null);
  const ccanvasRef = useRef(null);
  const [letterOpen, setLetterOpen] = useState(false);
  const [letterPaperOpen, setLetterPaperOpen] = useState(false);
  const [lightbox, setLightbox] = useState({ open: false, src: '' });

  useEffect(() => {
    const gt = grainRef.current;
    let gf = 0;
    let rafId;

    const grain = () => {
      if (!gt) return;
      if (++gf % 3 === 0) {
        gt.setAttribute('baseFrequency', (0.62 + Math.random() * 0.12).toFixed(3));
      }
      rafId = requestAnimationFrame(grain);
    };

    grain();
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const canvas = pcanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pts = [];
    let rafId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const mkPt = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      a: Math.random() * 0.55 + 0.08,
      da: (Math.random() - 0.5) * 0.005
    });

    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 80; i += 1) pts.push(mkPt());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.a += p.da;
        if (p.a < 0.06 || p.a > 0.72) p.da *= -1;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.a})`;
        ctx.fill();
      });
      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const selector = [
      '.cm', '.ch', '.cb', '.cq', '.pp', '.mi', '.g-h', '.g-s', '.gi', '.l-eye', '.env-wrap', '.f-cr', '.f-t', '.f-s', '.f-r', '.f-m'
    ].join(',');

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        let delay = 0;
        if (el.classList.contains('mi') || el.classList.contains('gi')) {
          delay = [...el.parentElement.children].indexOf(el) * (el.classList.contains('mi') ? 150 : 85);
        }
        setTimeout(() => el.classList.add('on'), delay);
        io.unobserve(el);
      });
    }, { threshold: 0.15 });

    document.querySelectorAll(selector).forEach(el => io.observe(el));

    const updateNav = () => {
      const mid = window.scrollY + window.innerHeight * 0.4;
      let current = 'hero';
      navItems.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) current = id;
      });
      document.querySelectorAll('.dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.s === current);
      });
    };

    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateNav);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = ccanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let conf = [];
    let rafId;

    const initCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const colors = ['#c9a84c', '#e8d48a', '#7a6230', '#fdfaf6', '#8b1a3a', '#f0ebe0', '#ffffff'];

    const launch = () => {
      initCanvas();
      for (let i = 0; i < 130; i += 1) {
        conf.push({
          x: Math.random() * canvas.width,
          y: -20 - Math.random() * 320,
          w: Math.random() * 9 + 4,
          h: Math.random() * 4 + 2,
          rot: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 2.2,
          vy: Math.random() * 3 + 1.5,
          vr: (Math.random() - 0.5) * 0.1,
          c: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      if (!rafId) animConf();
    };

    const animConf = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      conf = conf.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.vy += 0.04;
        if (p.y > canvas.height + 20) return false;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        return true;
      });
      if (conf.length) {
        rafId = requestAnimationFrame(animConf);
      } else {
        rafId = null;
      }
    };

    initCanvas();
    window.addEventListener('resize', initCanvas);

    const finaleEl = document.getElementById('finale');
    const fio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          launch();
          setTimeout(launch, 2200);
          setTimeout(launch, 5000);
        }
      });
    }, { threshold: 0.3 });

    if (finaleEl) fio.observe(finaleEl);

    return () => {
      window.removeEventListener('resize', initCanvas);
      fio.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const openLetter = () => {
    if (letterOpen) return;
    setLetterOpen(true);
    setTimeout(() => setLetterPaperOpen(true), 950);
  };

  const openLightbox = (src) => {
    if (!src) return;
    setLightbox({ open: true, src });
  };

  const closeLightbox = () => setLightbox({ open: false, src: '' });

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <svg id="grain" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <filter id="gf">
          <feTurbulence ref={grainRef} id="gt" type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#gf)" opacity="0.055" />
      </svg>

      <nav id="nav" aria-label="Sections">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`dot${item.id === 'hero' ? ' active' : ''}`}
            data-s={item.id}
            data-l={item.label}
            onClick={() => go(item.id)}
          />
        ))}
      </nav>

      <section id="hero">
        <canvas id="pcanvas" ref={pcanvasRef}></canvas>
        <div style={{ position: 'relative', zIndex: 1, padding: '0 1.5rem' }}>
          <p className="h-eye">A tribute · Rhulani for Refilwe Maduo</p>
          <h1 className="h-name">Refilwe <em>Maduo</em></h1>
          <p className="h-sub">"A story written in discipline. A legacy sealed in gold."</p>
          <p className="h-meta">Two degrees · One woman · Twice crowned</p>
          <button className="h-btn" type="button" onClick={() => go('ch1')}>
            <span>Begin her story</span>
          </button>
        </div>
        <div className="scroll-ind">
          <span>Scroll</span>
          <div />
        </div>
      </section>

      <div className="div" />

      <section id="ch1">
        <div className="wrap">
          <div className="cm">
            <span className="cm-n">Chapter I</span>
            <div className="cm-l" />
            <span className="cm-y">2021</span>
          </div>
          <div className="tc">
            <div>
              <h2 className="ch">The <em>Beginning</em></h2>
              <p className="cb">She walked into her first year carrying nothing but ambition and a quiet determination that most people would only recognise in hindsight. The road ahead was uncertain. She chose it anyway.</p>
              <blockquote className="cq">"Every great story starts with someone deciding they are worth the attempt."</blockquote>
            </div>
            <div>
              <div className="pp">
                <img src="./Her Pictures/The Beginning.JPG" alt="The Beginning" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ch2" style={{ background: 'var(--bg2)' }}>
        <div className="wrap">
          <div className="cm">
            <span className="cm-n">Chapter II</span>
            <div className="cm-l" />
            <span className="cm-y">2022 — 2023</span>
          </div>
          <h2 className="ch">The <em>Crucible</em></h2>
          <p className="cb">There were nights the weight felt unreasonable. Deadlines, doubt, and the pressure of becoming someone new while still figuring out who she was. She stayed anyway. She showed up the next morning anyway.</p>
          <div className="ml">
            <div className="mi">
              <div className="mi-y">2022</div>
              <div className="mi-t">First real test of character</div>
              <div className="mi-n"></div>
            </div>
            <div className="mi">
              <div className="mi-y">2022</div>
              <div className="mi-t">She kept showing up</div>
              <div className="mi-n"></div>
            </div>
            <div className="mi">
              <div className="mi-y">2023</div>
              <div className="mi-t">The year she found her footing</div>
              <div className="mi-n"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="ch3">
        <div className="wrap">
          <div className="cm">
            <span className="cm-n">Chapter III</span>
            <div className="cm-l" />
            <span className="cm-y">2024</span>
          </div>
          <div className="tc rev">
            <div>
              <h2 className="ch">The <em>First Crown</em></h2>
              <p className="cb">The day she walked across that stage was the day years of invisible effort became visible to the world. Nobody in that hall knew the full price she paid for that moment. You did.</p>
              <blockquote className="cq">"Consistency is a quiet form of genius. She proved this."</blockquote>
            </div>
            <div>
              <div className="pp">
                <img src="./Her Pictures/First Graduation.jpg" alt="First Graduation - First Crown" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ch4" style={{ background: 'var(--bg2)' }}>
        <div className="wrap">
          <div className="cm">
            <span className="cm-n">Chapter IV</span>
            <div className="cm-l" />
            <span className="cm-y">2024 — 2025</span>
          </div>
          <h2 className="ch">She Could Have <em>Stopped.</em></h2>
          <p className="cb">Most people would have called it done. A degree in Marketing, a foundation built on strategy and brilliance. But she saw further. She chose to return not for validation, but because she knew her own capacity. Honours in Marketing was not a next step — it was a choice only the truly intelligent make.</p>
          <blockquote className="cq" style={{ marginTop: '2.5rem' }}>
            "The ones who return are the ones who know they have more to show. Not to the world. To themselves."
          </blockquote>
        </div>
      </section>

      <section id="ch5">
        <div className="wrap">
          <div className="cm">
            <span className="cm-n">Chapter V</span>
            <div className="cm-l" />
            <span className="cm-y">2025</span>
          </div>
          <div className="tc">
            <div>
              <h2 className="ch">The <em>Second Crown</em></h2>
              <p className="cb">Honours in Marketing. It's not the easiest path—it demands a different kind of thinking. Strategic, analytical, creative, precise. She didn't just pass; she excelled. Because that's who she is. Not someone who settles. Not someone who stops when good enough arrives. Someone who builds excellence, twice.</p>
              <blockquote className="cq">"Smart women with vision don't get trophies. They get degrees that reflect how far they've climbed. Refilwe has both."</blockquote>
            </div>
            <div>
              <div className="pp">
                <img src="./Her Pictures/Second Graduation.JPG" alt="Second Graduation - Honours" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ch6" style={{ background: 'var(--bg2)' }}>
        <div className="wrap">
          <div className="cm">
            <span className="cm-n">Chapter VI</span>
            <div className="cm-l" />
            <span className="cm-y">2026 & Beyond</span>
          </div>
          <h2 className="ch">From <em>Theory to Impact</em></h2>
          <p className="cb">A Project Manager now. The kind of role that demands everything she's built: strategic thinking, leadership, the ability to see five steps ahead. She doesn't just manage projects—she orchestrates them with the precision of someone who knows what excellence looks like. And I believe in her completely. Every decision she makes, every goal she sets, every dream she has—I'm here, rooting for her with everything I have.</p>
          <blockquote className="cq">"The real work begins now. Not to prove something anymore. To build something that matters. And I'll be right here, believing in every step."</blockquote>
          <div className="ml" style={{ marginTop: '3.5rem' }}>
            <div className="mi">
              <div className="mi-y">2026</div>
              <div className="mi-t">Project Manager</div>
              <div className="mi-n">Turning strategy into reality, leading teams, delivering impact. Every project is a masterclass in execution. I'm proud of you every single day.</div>
            </div>
            <div className="mi">
              <div className="mi-y">Future Plans</div>
              <div className="mi-t">Master's Degree on the Horizon</div>
              <div className="mi-n">Whatever you decide, whenever you decide it. Your number one supporter will be in your corner, believing in your brilliance. There's nothing you can't do.</div>
            </div>
            <div className="mi">
              <div className="mi-y">Always</div>
              <div className="mi-t">My Belief in You</div>
              <div className="mi-n">This isn't just about achievements anymore. It's about knowing you. And knowing exactly how extraordinary you are. I see it. I've always seen it. Forever rooting for you.</div>
            </div>
          </div>
        </div>
      </section>

      <div className="div" />

      <section id="gallery">
        <div className="wrap">
          <h2 className="g-h">Moments Worth Keeping</h2>
          <p className="g-s">A few frames from the journey</p>
          <div className="gg">
            {galleryItems.map((item, index) => (
              <div key={item.key} className={`gi${item.src ? ' has-img' : ''}`} onClick={() => openLightbox(item.src)}>
                {item.src ? (
                  <img src={item.src} alt={item.caption || item.label} />
                ) : (
                  <div className="gi-ph">
                    <div style={{ fontSize: '1.4rem', opacity: '.25' }}>📷</div>
                    <span>{item.label}</span>
                  </div>
                )}
                <div className="gi-ov">
                  <span className="gi-cap">{item.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="lb" className={lightbox.open ? 'on' : ''} onClick={(e) => { if (e.target.id === 'lb') closeLightbox(); }}>
        <button id="lb-x" type="button" onClick={closeLightbox}>✕ Close</button>
        <img id="lb-img" src={lightbox.src} alt="Lightbox" />
      </div>

      <div className="div" />

      <section id="letter">
        <div className="wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p className={`l-eye${letterOpen ? ' on' : ''}`}>A private word</p>
          <div className={`env-wrap${letterOpen ? ' on' : ''}`} id="env-wrap">
            <div>
              <div className={`env${letterOpen ? ' open' : ''}`} id="env" onClick={openLetter}>
                <div className="env-flap">
                  <svg viewBox="0 0 280 120" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
                    <polygon points="0,0 280,0 140,120" fill="#141414" stroke="#3e3b38" strokeWidth="1" />
                  </svg>
                </div>
                <div className="env-seal">♡</div>
                <div className="env-body" />
              </div>
              <p className="env-hint" id="env-hint">{letterOpen ? '' : 'Tap to open'}</p>
            </div>
          </div>

          <div className={`l-con${letterPaperOpen ? ' open' : ''}`} id="l-con">
            <div className="l-paper">
              <p className="l-date"></p>
              <div className="l-text">
                <p>You are brilliant. Not just hardworking—brilliant. There's a difference. You don't just show up; you think differently. You see strategy where others see noise. That's not luck. That's the kind of mind that makes Marketing Honours meaningful.</p>
                <p>I watched you during the years when nobody was watching. The late nights with case studies and campaigns, rewriting until the idea was perfect. The questions you asked that made everyone else in the room stop and think. The way you'd explain something complex and suddenly it all made sense—because you'd already built the entire logic in your head.</p>
                <p>You knew your own standard, and you refused to meet it halfway. First degree, first class. Then you came back for Honours. Not because you had to. Because you knew you could. Because finishing well matters to you.</p>
                <p>Twice now, you've earned the right to stand on that stage. But I'm proudest of what happened between the degrees—the quiet certainty that you could do this differently, better, again.</p>
                <p>Refilwe, this is not your ceiling. The Marketing Honours is proof of what you already knew about yourself. The real achievement is who you've become in the building of it. Go change the world with that brilliant mind of yours.</p>
              </div>
              <div className="l-sig">— Rhulani</div>
            </div>
          </div>
        </div>
      </section>

      <div className="div" />

      <section id="finale">
        <canvas id="ccanvas" ref={ccanvasRef}></canvas>
        <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="f-cr">♛ &nbsp; ♛</div>
          <h2 className="f-t">Twice <em>Crowned.</em><br />Still Rising.</h2>
          <p className="f-s">"This is not your peak. It is your foundation."</p>
          <div className="f-r" />
          <p className="f-m">Refilwe Maduo · 2026 · Made with love by Rhulani</p>
        </div>
      </section>
    </>
  );
}

export default App;
