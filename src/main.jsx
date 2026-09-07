import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./auth.css";
import "./final-touch.css";
import "./usability.css";
import "./mobile-fix.css";

const images = {
  hero: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=88",
  hoodie:
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=85",
  jacket:
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=85",
  sweater:
    "https://images.unsplash.com/photo-1608234807905-4466023792f5?auto=format&fit=crop&w=800&q=85",
  track:
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85",
  shirt:
    "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=800&q=85",
  tee: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=85",
  pants:
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=85",
  varsity:
    "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=85",
  category1:
    "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=85",
  category2:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85",
  category3:
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",
  category4:
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85",
};

const items = [
  {
    id: "hoodie",
    title: "Oversized Hoodie",
    brand: "Nike",
    size: "M",
    condition: "Excellent",
    location: "Jorhat",
    distance: "3.2 km",
    value: 2800,
    image: images.hoodie,
    owner: "Rahul",
    category: "Streetwear",
    color: "Charcoal",
  },
  {
    id: "jacket",
    title: "Denim Trucker Jacket",
    brand: "Levi's",
    size: "L",
    condition: "Good",
    location: "Jorhat",
    distance: "4.8 km",
    value: 3200,
    image: images.jacket,
    owner: "Ananya",
    category: "Outerwear",
    color: "Blue",
  },
  {
    id: "sweater",
    title: "Soft Knit Sweater",
    brand: "Zara",
    size: "S",
    condition: "Like new",
    location: "Titabor",
    distance: "8.4 km",
    value: 1900,
    image: images.sweater,
    owner: "Sneha",
    category: "Women",
    color: "Cream",
  },
  {
    id: "track",
    title: "Track Jacket",
    brand: "Adidas",
    size: "M",
    condition: "Excellent",
    location: "Jorhat",
    distance: "5.1 km",
    value: 2400,
    image: images.track,
    owner: "Karthik",
    category: "Sportswear",
    color: "Olive",
  },
  {
    id: "shirt",
    title: "Linen Camp Shirt",
    brand: "Uniqlo",
    size: "M",
    condition: "Good",
    location: "Mariani",
    distance: "12 km",
    value: 2400,
    image: images.shirt,
    owner: "Pankaj",
    category: "Unisex",
    color: "White",
  },
  {
    id: "tee",
    title: "Graphic Oversized Tee",
    brand: "Stussy",
    size: "L",
    condition: "Excellent",
    location: "Jorhat",
    distance: "2.1 km",
    value: 2100,
    image: images.tee,
    owner: "Aman",
    category: "Streetwear",
    color: "White",
  },
  {
    id: "pants",
    title: "Relaxed Cargo Pants",
    brand: "Carhartt",
    size: "32",
    condition: "Good",
    location: "Cinnamara",
    distance: "6.2 km",
    value: 2700,
    image: images.pants,
    owner: "Priya",
    category: "Unisex",
    color: "Olive",
  },
  {
    id: "varsity",
    title: "Vintage Varsity Jacket",
    brand: "Champion",
    size: "M",
    condition: "Good",
    location: "Jorhat",
    distance: "3.9 km",
    value: 3600,
    image: images.varsity,
    owner: "Rahul",
    category: "Vintage",
    color: "Navy",
  },
];

const categories = [
  { name: "Streetwear", image: images.category1, count: "128 pieces" },
  { name: "Women", image: images.category2, count: "204 pieces" },
  { name: "Outerwear", image: images.category3, count: "86 pieces" },
  { name: "Vintage", image: images.category4, count: "74 pieces" },
];

function Icon({ name, size = 20, stroke = 1.7 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    heart: (
      <>
        <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.7Z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.8 20c.8-3.3 3.2-5 7.2-5s6.4 1.7 7.2 5" />
      </>
    ),
    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    message: (
      <>
        <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.2 8.2 0 0 1-3.1-.6L4 20l1.4-3.8A7.1 7.1 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h13M13 6l6 6-6 6" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    filter: (
      <>
        <path d="M4 6h16M7 12h10M10 18h4" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Z" />
        <path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" />
      </>
    ),
    ellipsis: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </>
    ),
    camera: (
      <>
        <path d="M4 7h3l1.5-2h7L17 7h3v12H4V7Z" />
        <circle cx="12" cy="13" r="3.5" />
      </>
    ),
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function Logo({ light = false }) {
  return (
    <a
      className={`logo ${light ? "logo-light" : ""}`}
      href="/"
      onClick={(e) => {
        e.preventDefault();
        window.history.pushState({}, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }}
    >
      <img className="logo-symbol" src="/logomark-transparent.png" alt="" />
      <span className="logo-word">homies wear</span>
    </a>
  );
}

function Header({ onList }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = window.location.pathname;
  const go = (path) => {
    setMenuOpen(false);
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`}>
          <button
            className={currentPath === "/" ? "active" : ""}
            aria-current={currentPath === "/" ? "page" : undefined}
            onClick={() => go("/")}
          >
            Home
          </button>
          <button
            className={
              currentPath === "/explore" ||
              currentPath.startsWith("/item/") ||
              currentPath.startsWith("/swap/request/")
                ? "active"
                : ""
            }
            aria-current={currentPath === "/explore" ? "page" : undefined}
            onClick={() => go("/explore")}
          >
            Explore
          </button>
          <button
            className={currentPath === "/how-it-works" ? "active" : ""}
            aria-current={currentPath === "/how-it-works" ? "page" : undefined}
            onClick={() => go("/how-it-works")}
          >
            How it works
          </button>
          <button
            className={currentPath === "/nearby" ? "active" : ""}
            aria-current={currentPath === "/nearby" ? "page" : undefined}
            onClick={() => go("/nearby")}
          >
            Nearby
          </button>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button search-trigger"
            aria-label="Search"
            onClick={() => go("/explore")}
          >
            <Icon name="search" />
          </button>
          <button
            className="icon-button desktop-only"
            aria-label="Messages"
            onClick={() => go("/messages")}
          >
            <Icon name="message" />
          </button>
          <button
            className="icon-button desktop-only notification-trigger"
            aria-label="Notifications"
            onClick={() => go("/dashboard")}
          >
            <Icon name="bell" />
            <i />
          </button>
          <button
            className="avatar-button"
            aria-label="Profile"
            onClick={() => go("/dashboard")}
          >
            <span>PB</span>
          </button>
          <button
            className="button button-dark header-list desktop-only"
            onClick={onList}
          >
            <Icon name="plus" size={17} /> List an item
          </button>
          <button
            className="menu-trigger"
            aria-label="Open menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}

function ProductCard({ item, favorites, toggleFavorite, onOpen }) {
  const favorite = favorites.includes(item.id);
  return (
    <article className="product-card" onClick={() => onOpen(item)}>
      <div className="product-image-wrap">
        <img src={item.image} alt={item.title} loading="lazy" />
        <button
          className={`heart-button ${favorite ? "is-favorite" : ""}`}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
        >
          <Icon name="heart" size={19} />
        </button>
        <span className="image-tag">{item.condition}</span>
      </div>
      <div className="product-info">
        <div className="product-title-row">
          <h3>{item.title}</h3>
          <span className="product-arrow">
            <Icon name="arrow" size={16} />
          </span>
        </div>
        <p>
          {item.brand} <b>·</b> {item.size} <b>·</b> {item.condition}
        </p>
        <div className="product-meta">
          <span>
            <Icon name="pin" size={13} />
            {item.location} · {item.distance}
          </span>
          <strong>₹{item.value.toLocaleString("en-IN")}</strong>
        </div>
      </div>
    </article>
  );
}

function Hero({ onExplore, onList }) {
  return (
    <section className="hero section-shell">
      <div className="hero-copy">
        <div className="eyebrow">
          <span /> Wear less. Swap more.
        </div>
        <h1>
          Your closet has <em>more stories</em> to tell.
        </h1>
        <p className="hero-subtitle">
          Swap clothes you no longer wear for pieces you’ll actually love. Discover
          fashion nearby and give great clothes a second life.
        </p>
        <div className="hero-actions">
          <button className="button button-dark button-large" onClick={onExplore}>
            Explore clothes <Icon name="arrow" size={17} />
          </button>
          <button className="text-button" onClick={onList}>
            List your clothes <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="hero-footnote">
          <span className="avatar-stack">
            <i>R</i>
            <i>A</i>
            <i>K</i>
          </span>
          <span>Join 2,400+ people swapping better</span>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-image-frame">
          <img src={images.hero} alt="Person wearing a neutral outfit in a sunlit room" />
          <div className="hero-note">
            <span className="note-line" />
            Good clothes.
            <br />
            <em>New stories.</em>
          </div>
          <div className="hero-location">
            <Icon name="pin" size={14} /> Assam, India
          </div>
        </div>
        <div className="hero-caption">
          <span>01 / 04</span>
          <span>Curated from closets nearby</span>
        </div>
      </div>
    </section>
  );
}

function ValueStrip() {
  const benefits = [
    ["01", "Direct swaps", "No unnecessary buying or selling."],
    ["02", "Local matching", "Find people with great clothes near you."],
    ["03", "Fairer exchanges", "Compare estimated values together."],
    ["04", "New stories", "Keep wearable pieces in circulation."],
  ];
  return (
    <section className="value-strip">
      <div className="section-shell value-grid">
        {benefits.map(([num, title, copy]) => (
          <div className="value-item" key={title}>
            <span className="value-number">{num}</span>
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedSection({ favorites, toggleFavorite, onOpen, onExplore }) {
  return (
    <section className="section-shell featured-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Curated nearby</span>
          <h2>
            Find something worth <em>swapping.</em>
          </h2>
          <p>Pieces with plenty of life left in them, offered by people around you.</p>
        </div>
        <button className="outline-link" onClick={onExplore}>
          View all pieces <Icon name="arrow" size={16} />
        </button>
      </div>
      <div className="product-grid featured-grid">
        {items.slice(0, 4).map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  );
}

function CategorySection({ onExplore }) {
  return (
    <section className="category-section">
      <div className="section-shell">
        <div className="section-heading compact">
          <div>
            <span className="eyebrow">Browse by mood</span>
            <h2>
              Find your <em>next layer.</em>
            </h2>
          </div>
          <button className="outline-link" onClick={onExplore}>
            Explore all <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="category-grid">
          {categories.map((cat, index) => (
            <button
              className={`category-card category-${index + 1}`}
              key={cat.name}
              onClick={onExplore}
            >
              <img src={cat.image} alt={cat.name} />
              <div className="category-overlay" />
              <div className="category-label">
                <span>{cat.count}</span>
                <strong>{cat.name}</strong>
                <Icon name="arrow" size={17} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function NearbySection({ onExplore }) {
  return (
    <section className="section-shell nearby-section">
      <div className="nearby-intro">
        <span className="eyebrow">Around you</span>
        <h2>
          Good finds are <em>closer</em> than you think.
        </h2>
        <p>
          Explore clothes being swapped by people around Jorhat. Less distance, more
          connection.
        </p>
        <button className="button button-dark" onClick={onExplore}>
          Explore nearby swaps <Icon name="arrow" size={17} />
        </button>
        <div className="nearby-stats">
          <div>
            <strong>12.4k</strong>
            <span>pieces in circulation</span>
          </div>
          <div>
            <strong>4.8/5</strong>
            <span>community rating</span>
          </div>
        </div>
      </div>
      <div className="map-card">
        <div className="map-grid" />
        <div className="map-label label-one">
          <span className="map-dot" />
          Jorhat <small>3.2 km</small>
        </div>
        <div className="map-label label-two">
          <span className="map-dot" />
          Titabor <small>8.4 km</small>
        </div>
        <div className="map-label label-three">
          <span className="map-dot" />
          Mariani <small>12 km</small>
        </div>
        <div className="map-center">
          <Icon name="pin" size={19} />
        </div>
        <div className="map-controls">
          <button>+</button>
          <button>−</button>
        </div>
        <span className="map-credit">Map illustration · approximate locations</span>
      </div>
    </section>
  );
}

function ImpactSection({ onHow }) {
  return (
    <section className="impact-section">
      <div className="section-shell impact-inner">
        <div className="impact-copy">
          <span className="eyebrow">A better way to wear</span>
          <h2>
            Small swaps.
            <br />
            <em>A bigger difference.</em>
          </h2>
          <p>
            The easiest way to make your wardrobe more sustainable is to keep great
            clothes in circulation. Homies Wear turns unused pieces into new
            possibilities.
          </p>
          <button className="text-button light-text" onClick={onHow}>
            See how it works <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="impact-numbers">
          <div className="impact-number">
            <strong>
              12<span>kg</span>
            </strong>
            <p>estimated textile waste avoided</p>
          </div>
          <div className="impact-number">
            <strong>6</strong>
            <p>trees equivalent through reuse</p>
          </div>
          <span className="impact-note">Based on demo community data</span>
        </div>
      </div>
    </section>
  );
}

function HowSection({ onExplore }) {
  const steps = [
    ["01", "List", "Upload clothes sitting unused in your wardrobe."],
    ["02", "Discover", "Find pieces offered by people around you."],
    ["03", "Propose", "Choose one of your own items and make a swap."],
    ["04", "Connect", "Chat, agree, and give it another story."],
  ];
  return (
    <section className="how-section section-shell">
      <div className="section-heading">
        <div>
          <span className="eyebrow">The simple way</span>
          <h2>
            From closet to <em>connection.</em>
          </h2>
        </div>
        <p className="heading-aside">
          A little less buying.
          <br />A lot more finding.
        </p>
      </div>
      <div className="steps-grid">
        {steps.map(([num, title, copy]) => (
          <button className="step-card" key={num} onClick={onExplore}>
            <span className="step-number">{num}</span>
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
            <span className="step-arrow">
              <Icon name="arrow" size={16} />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function FinalCta({ onExplore, onList }) {
  return (
    <section className="final-cta section-shell">
      <div className="final-rule" />
      <span className="eyebrow">Your wardrobe, reimagined</span>
      <h2>
        Your next favorite piece might already belong to someone <em>nearby.</em>
      </h2>
      <p>Swap something you own. Discover something new.</p>
      <div className="hero-actions">
        <button className="button button-dark" onClick={onExplore}>
          Explore clothes <Icon name="arrow" size={17} />
        </button>
        <button className="text-button" onClick={onList}>
          List an item <Icon name="arrow" size={16} />
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-inner">
        <div className="footer-brand">
          <Logo light />
          <p>Wear less. Swap more.</p>
        </div>
        <div className="footer-links">
          <div>
            <span>Discover</span>
            <a href="/explore">Explore clothes</a>
            <a href="/nearby">Nearby swaps</a>
            <a href="/how-it-works">How it works</a>
          </div>
          <div>
            <span>Homies Wear</span>
            <a href="/about">About us</a>
            <a href="/help">Help center</a>
            <a href="/privacy">Privacy & terms</a>
          </div>
          <div>
            <span>Follow along</span>
            <a href="/instagram">Instagram</a>
            <a href="/journal">The journal</a>
            <a href="/contact">Contact us</a>
          </div>
        </div>
      </div>
      <div className="section-shell footer-bottom">
        <span>© 2026 Homies Wear. All rights reserved.</span>
        <span>Made for better wardrobes.</span>
      </div>
    </footer>
  );
}

function Home({ favorites, toggleFavorite, onOpen, navigate, onList }) {
  return (
    <>
      <Header onList={onList} />
      <main>
        <Hero onExplore={() => navigate("/explore")} onList={onList} />
        <ValueStrip />
        <FeaturedSection
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          onOpen={onOpen}
          onExplore={() => navigate("/explore")}
        />
        <CategorySection onExplore={() => navigate("/explore")} />
        <NearbySection onExplore={() => navigate("/nearby")} />
        <ImpactSection onHow={() => navigate("/how-it-works")} />
        <HowSection onExplore={() => navigate("/explore")} />
        <FinalCta onExplore={() => navigate("/explore")} onList={onList} />
      </main>
      <Footer />
      <MobileNav navigate={navigate} onList={onList} />
    </>
  );
}

function HowPage({ navigate }) {
  return (
    <>
      <Header onList={() => navigate("/list")} />
      <main className="page-main how-page">
        <section className="editorial-hero section-shell">
          <span className="eyebrow">The Homies way</span>
          <h1>
            Good clothes.
            <br />
            <em>New connections.</em>
          </h1>
          <p>
            Swapping should feel simple, personal, and a little more exciting than
            shopping.
          </p>
        </section>
        <HowSection onExplore={() => navigate("/explore")} />
        <section className="how-callout section-shell">
          <div>
            <span className="eyebrow">Keep it moving</span>
            <h2>
              Every piece gets
              <br />
              <em>another story.</em>
            </h2>
            <p>
              List what you love but no longer wear. Find something that feels like you.
              Then make the exchange feel human.
            </p>
            <button className="button button-dark" onClick={() => navigate("/list")}>
              Give a piece a new home <Icon name="arrow" size={17} />
            </button>
          </div>
          <div className="how-callout-image">
            <img src={images.shirt} alt="A linen shirt ready for its next story" />
            <span>01 / 04</span>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav navigate={navigate} onList={() => navigate("/list")} />
    </>
  );
}

function NearbyPage({ favorites, toggleFavorite, onOpen, navigate }) {
  return (
    <>
      <Header onList={() => navigate("/list")} />
      <main className="page-main nearby-page">
        <section className="editorial-hero section-shell">
          <span className="eyebrow">Made for your radius</span>
          <h1>
            Good finds are
            <br />
            <em>closer than you think.</em>
          </h1>
          <p>
            Discover thoughtful pieces being swapped by people around Jorhat and the
            places around it.
          </p>
        </section>
        <NearbySection onExplore={() => navigate("/explore")} />
        <section className="section-shell nearby-pieces">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Around Jorhat</span>
              <h2>
                Worth the <em>short trip.</em>
              </h2>
            </div>
            <button className="outline-link" onClick={() => navigate("/explore")}>
              See all nearby <Icon name="arrow" size={16} />
            </button>
          </div>
          <div className="product-grid">
            {items.slice(1, 5).map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                onOpen={onOpen}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav navigate={navigate} onList={() => navigate("/list")} />
    </>
  );
}

function Explore({ favorites, toggleFavorite, onOpen, navigate }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All pieces");
  const [sort, setSort] = useState("Recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtered = items.filter(
    (item) =>
      (category === "All pieces" || item.category === category) &&
      `${item.title} ${item.brand} ${item.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const sorted = [...filtered].sort((a, b) =>
    sort === "Lowest value"
      ? a.value - b.value
      : sort === "Highest value"
        ? b.value - a.value
        : sort === "Nearest first"
          ? parseFloat(a.distance) - parseFloat(b.distance)
          : 0,
  );
  return (
    <>
      <Header onList={() => navigate("/list")} />
      <main className="page-main">
        <section className="explore-hero section-shell">
          <div>
            <span className="eyebrow">The community closet</span>
            <h1>
              Explore <em>clothes.</em>
            </h1>
            <p>Discover unique pieces from people around you.</p>
          </div>
          <div className="explore-count">
            <strong>{filtered.length}</strong>
            <span>
              pieces ready
              <br />
              for a new story
            </span>
          </div>
        </section>
        <section className="explore-content section-shell">
          <div className="explore-toolbar">
            <div className="search-box">
              <Icon name="search" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search clothes, brands, styles..."
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort pieces"
            >
              <option>Recommended</option>
              <option>Nearest first</option>
              <option>Recently added</option>
              <option>Highest value</option>
              <option>Lowest value</option>
            </select>
            <button
              className="filter-toggle"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <Icon name="filter" size={17} /> Filters{" "}
              <span>{filtersOpen ? "−" : "+"}</span>
            </button>
          </div>
          <div className={`filter-row ${filtersOpen ? "is-open" : ""}`}>
            {[
              "All pieces",
              "Streetwear",
              "Outerwear",
              "Women",
              "Unisex",
              "Vintage",
              "Sportswear",
            ].map((filter) => (
              <button
                className={category === filter ? "active" : ""}
                key={filter}
                onClick={() => {
                  setCategory(filter);
                  setFiltersOpen(false);
                }}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="explore-result-head">
            <p>
              <strong>{filtered.length}</strong> pieces near you
            </p>
            <span>
              <Icon name="pin" size={14} /> Jorhat, Assam
            </span>
          </div>
          <div className="product-grid explore-grid">
            {sorted.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                onOpen={onOpen}
              />
            ))}
          </div>
          {!filtered.length && (
            <div className="empty-state">
              <span>
                <Icon name="search" />
              </span>
              <h3>Nothing quite like that yet.</h3>
              <p>Try a different search or browse all pieces.</p>
              <button
                className="button button-dark"
                onClick={() => {
                  setQuery("");
                  setCategory("All pieces");
                }}
              >
                Show all pieces
              </button>
            </div>
          )}
        </section>
      </main>
      <MobileNav navigate={navigate} onList={() => navigate("/list")} />
    </>
  );
}

function ItemDetail({ item, favorites, toggleFavorite, navigate }) {
  const [activeImage, setActiveImage] = useState(item.image);
  const favorite = favorites.includes(item.id);
  return (
    <>
      <Header onList={() => navigate("/list")} />
      <main className="page-main detail-page">
        <div className="section-shell breadcrumb">
          <button onClick={() => navigate("/explore")}>Explore</button>
          <Icon name="chevron" size={14} />
          <span>{item.title}</span>
        </div>
        <section className="section-shell detail-layout">
          <div className="detail-gallery">
            <div className="detail-main-image">
              <img src={activeImage} alt={item.title} />
            </div>
            <div className="thumb-row">
              {[item.image, images.hero, images.tee].map((img, i) => (
                <button
                  className={activeImage === img ? "active" : ""}
                  key={img}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`${item.title} view ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="detail-copy">
            <div className="detail-topline">
              <span className="eyebrow">
                {item.category} · {item.condition}
              </span>
              <button
                className={`heart-button detail-heart ${favorite ? "is-favorite" : ""}`}
                onClick={() => toggleFavorite(item.id)}
              >
                <Icon name="heart" size={20} />
              </button>
            </div>
            <h1>{item.title}</h1>
            <p className="detail-subtitle">
              {item.brand} · {item.size} · Unisex
            </p>
            <div className="rating">
              <span>★</span> 4.8 <i>·</i> 12 successful swaps
            </div>
            <div className="detail-price">
              <span>Estimated swap value</span>
              <strong>₹{item.value.toLocaleString("en-IN")}</strong>
              <small>Values are a friendly guide, not a price tag.</small>
            </div>
            <div className="detail-location">
              <Icon name="pin" size={17} />
              <div>
                <strong>{item.location}, Assam</strong>
                <span>{item.distance} away · approximate location</span>
              </div>
            </div>
            <p className="detail-description">
              An easy everyday piece in lovely condition. Worn only a few times and well
              cared for. No stains, tears, or visible damage.
            </p>
            <div className="detail-actions">
              <button
                className="button button-dark button-large"
                onClick={() => navigate(`/swap/request/${item.id}`)}
              >
                Request a swap <Icon name="arrow" size={17} />
              </button>
              <button
                className="button button-light button-large"
                onClick={() => navigate("/messages")}
              >
                <Icon name="message" size={17} /> Message owner
              </button>
            </div>
            <div className="owner-card">
              <div className="owner-avatar">{item.owner.slice(0, 1)}</div>
              <div>
                <strong>{item.owner}</strong>
                <span>Member since 2024 · 80% response rate</span>
              </div>
              <Icon name="chevron" size={17} />
            </div>
            <div className="detail-specs">
              <div>
                <span>Brand</span>
                <strong>{item.brand}</strong>
              </div>
              <div>
                <span>Condition</span>
                <strong>{item.condition}</strong>
              </div>
              <div>
                <span>Color</span>
                <strong>{item.color}</strong>
              </div>
              <div>
                <span>Listed</span>
                <strong>2 days ago</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MobileNav navigate={navigate} onList={() => navigate("/list")} />
    </>
  );
}

function SwapRequest({ item, navigate }) {
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <>
        <Header onList={() => navigate("/list")} />
        <main className="center-page">
          <div className="success-card">
            <div className="success-mark">
              <Icon name="check" size={29} />
            </div>
            <span className="eyebrow">Request sent</span>
            <h1>It’s on its way to {item.owner}.</h1>
            <p>
              We’ll let you know when they respond. In the meantime, keep exploring the
              good stuff nearby.
            </p>
            <button className="button button-dark" onClick={() => navigate("/explore")}>
              Keep exploring <Icon name="arrow" size={17} />
            </button>
            <button className="text-button" onClick={() => navigate("/swap-requests")}>
              View my requests
            </button>
          </div>
        </main>
      </>
    );
  return (
    <>
      <Header onList={() => navigate("/list")} />
      <main className="page-main swap-page">
        <div className="section-shell breadcrumb">
          <button onClick={() => navigate(`/item/${item.id}`)}>Item</button>
          <Icon name="chevron" size={14} />
          <span>Request a swap</span>
        </div>
        <section className="section-shell swap-layout">
          <div className="swap-intro">
            <span className="eyebrow">A good match</span>
            <h1>
              Request <em>a swap.</em>
            </h1>
            <p>Choose something from your closet to offer in exchange for this piece.</p>
            <div className="swap-visual">
              <div className="swap-item">
                <img src={images.shirt} alt="Your linen shirt" />
                <span>Your item</span>
                <strong>Uniqlo Linen Shirt</strong>
                <small>M · Good · ₹2,400</small>
              </div>
              <div className="swap-symbol">⇄</div>
              <div className="swap-item">
                <img src={item.image} alt={item.title} />
                <span>Their item</span>
                <strong>{item.title}</strong>
                <small>
                  {item.size} · {item.condition} · ₹{item.value.toLocaleString("en-IN")}
                </small>
              </div>
            </div>
          </div>
          <div className="swap-form">
            <label>
              Choose your item{" "}
              <select>
                <option>Uniqlo Linen Shirt · M · ₹2,400</option>
                <option>Graphic Oversized Tee · L · ₹2,100</option>
              </select>
            </label>
            <div className="value-compare">
              <div>
                <span>Your item</span>
                <strong>₹2,400</strong>
              </div>
              <div>
                <span>Their item</span>
                <strong>₹{item.value.toLocaleString("en-IN")}</strong>
              </div>
              <div className="difference">
                <span>Difference</span>
                <strong>₹{Math.abs(item.value - 2400).toLocaleString("en-IN")}</strong>
              </div>
            </div>
            <p className="form-note">
              <Icon name="sparkle" size={15} /> Swap values are estimates. Both people
              decide whether the exchange feels fair.
            </p>
            <label>
              Message {item.owner}
              <textarea
                placeholder={`Hey! I’d love to swap my linen shirt for this ${item.title.toLowerCase()}.`}
              />
            </label>
            <button
              className="button button-dark button-large full-width"
              onClick={() => setSent(true)}
            >
              Send swap request <Icon name="arrow" size={17} />
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

function ListPage({ navigate }) {
  const [published, setPublished] = useState(false);
  return (
    <>
      <Header onList={() => navigate("/list")} />
      <main className="page-main list-page">
        <section className="section-shell list-layout">
          <div className="list-intro">
            <span className="eyebrow">Give it another story</span>
            <h1>
              List <em>an item.</em>
            </h1>
            <p>
              Share something good from your wardrobe with someone who’ll love it next.
            </p>
            <div className="list-tip">
              <Icon name="sparkle" size={17} />
              <span>
                <strong>Good photos get more swaps.</strong>
                <br />
                Use natural light and show the piece from a few angles.
              </span>
            </div>
          </div>
          <div className="listing-form">
            <label className="photo-upload">
              <input type="file" hidden />
              <span>
                <Icon name="camera" size={24} />
                <strong>Add up to 6 photos</strong>
                <small>JPG, PNG · max 10MB each</small>
              </span>
            </label>
            <label>
              Item name
              <input placeholder="e.g. Oversized denim jacket" />
            </label>
            <div className="form-two">
              <label>
                Category
                <select>
                  <option>Choose a category</option>
                  <option>Streetwear</option>
                  <option>Outerwear</option>
                  <option>Vintage</option>
                </select>
              </label>
              <label>
                Size
                <select>
                  <option>Choose size</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
              </label>
            </div>
            <div className="form-two">
              <label>
                Brand
                <input placeholder="e.g. Nike" />
              </label>
              <label>
                Condition
                <select>
                  <option>Choose condition</option>
                  <option>Like new</option>
                  <option>Excellent</option>
                  <option>Good</option>
                </select>
              </label>
            </div>
            <label>
              Description
              <textarea placeholder="Tell people a little about the fit, feel and story of this piece..." />
            </label>
            <div className="estimated-value">
              <div>
                <span>Estimated swap value</span>
                <strong>₹2,400</strong>
              </div>
              <small>
                Based on brand, category and condition. The final value is always decided
                together.
              </small>
            </div>
            <button
              className="button button-dark button-large full-width"
              onClick={() => setPublished(true)}
            >
              Publish listing <Icon name="arrow" size={17} />
            </button>
            {published && (
              <div className="inline-success">
                <Icon name="check" size={16} /> Your piece is ready for a new story.
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

function Messages({ navigate }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState([]);
  return (
    <>
      <Header onList={() => navigate("/list")} />
      <main className="page-main messages-page">
        <section className="section-shell messages-shell">
          <aside className="conversation-list">
            <div className="messages-heading">
              <div>
                <span className="eyebrow">Your inbox</span>
                <h1>Messages</h1>
              </div>
              <button className="icon-button">
                <Icon name="plus" size={18} />
              </button>
            </div>
            <div className="message-search">
              <Icon name="search" size={16} />
              <input placeholder="Search conversations" />
            </div>
            {[
              ["Rahul", "I’d love to see the hoodie in person.", "2m", "R"],
              ["Ananya", "That sounds like a lovely swap.", "1h", "A"],
              ["Karthik", "The jacket is still available!", "Yesterday", "K"],
            ].map((chat, i) => (
              <button className={`conversation ${i === 0 ? "active" : ""}`} key={chat[0]}>
                <span className="conversation-avatar">{chat[3]}</span>
                <span>
                  <strong>{chat[0]}</strong>
                  <small>{chat[1]}</small>
                </span>
                <time>{chat[2]}</time>
              </button>
            ))}
          </aside>
          <section className="chat-window">
            <div className="chat-header">
              <div className="owner-avatar">R</div>
              <div>
                <strong>Rahul</strong>
                <span>
                  <i /> Online · 3.2 km away
                </span>
              </div>
              <button className="icon-button">
                <Icon name="ellipsis" size={19} />
              </button>
            </div>
            <div className="chat-body">
              <div className="chat-date">Today</div>
              <div className="bubble bubble-them">
                Hey! I’m interested in your hoodie.
              </div>
              <div className="bubble bubble-me">
                That’s great! Which item are you offering?
              </div>
              <div className="bubble bubble-them">
                I have a Levi’s denim jacket. It’s in really good shape.
              </div>
              <div className="swap-proposal">
                <div className="proposal-label">
                  Swap proposal <span>Pending</span>
                </div>
                <div className="proposal-items">
                  <div>
                    <img src={images.shirt} alt="Linen shirt" />
                    <span>Your item</span>
                    <strong>Uniqlo Linen Shirt</strong>
                    <small>₹2,400</small>
                  </div>
                  <b>⇄</b>
                  <div>
                    <img src={images.hoodie} alt="Nike hoodie" />
                    <span>Their item</span>
                    <strong>Nike Hoodie</strong>
                    <small>₹2,800</small>
                  </div>
                </div>
                <div className="proposal-actions">
                  <button
                    className="button button-dark"
                    onClick={() => navigate("/swap-requests")}
                  >
                    Accept
                  </button>
                  <button className="button button-light">Counter offer</button>
                </div>
              </div>
              {sent.map((text, i) => (
                <div className="bubble bubble-me" key={i}>
                  {text}
                </div>
              ))}
            </div>
            <form
              className="composer"
              onSubmit={(e) => {
                e.preventDefault();
                if (message.trim()) {
                  setSent([...sent, message]);
                  setMessage("");
                }
              }}
            >
              <button type="button" className="icon-button">
                <Icon name="plus" size={19} />
              </button>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button className="send-button" aria-label="Send message">
                <Icon name="arrow" size={18} />
              </button>
            </form>
          </section>
        </section>
      </main>
      <MobileNav navigate={navigate} onList={() => navigate("/list")} />
    </>
  );
}

function Dashboard({ navigate }) {
  return (
    <>
      <Header onList={() => navigate("/list")} />
      <main className="page-main dashboard-page">
        <section className="section-shell dashboard-layout">
          <aside className="dashboard-side">
            <div className="dashboard-user">
              <div className="profile-avatar">PB</div>
              <strong>Pankaj Borah</strong>
              <span>Jorhat, Assam</span>
            </div>
            {[
              "Dashboard",
              "My listings",
              "Incoming requests",
              "Sent requests",
              "Swap history",
              "Messages",
              "Profile",
              "Settings",
            ].map((link, i) => (
              <button
                className={i === 0 ? "active" : ""}
                key={link}
                onClick={() => link === "Messages" && navigate("/messages")}
              >
                {link}
                <>{link === "Incoming requests" && <b>3</b>}</>
              </button>
            ))}
            <button className="side-logout">Log out</button>
          </aside>
          <div className="dashboard-content">
            <div className="dashboard-heading">
              <div>
                <span className="eyebrow">Your wardrobe, in motion</span>
                <h1>
                  Welcome back, <em>Pankaj.</em>
                </h1>
                <p>Here’s what’s happening with your wardrobe.</p>
              </div>
              <button className="button button-dark" onClick={() => navigate("/list")}>
                <Icon name="plus" size={17} /> List an item
              </button>
            </div>
            <div className="stats-grid">
              {[
                ["08", "Active listings"],
                ["03", "Pending requests"],
                ["12", "Successful swaps"],
                ["24", "People reached"],
              ].map(([number, label]) => (
                <div className="stat-card" key={label}>
                  <strong>{number}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="dashboard-section-heading">
              <h2>My listings</h2>
              <button className="outline-link" onClick={() => navigate("/explore")}>
                See all <Icon name="arrow" size={15} />
              </button>
            </div>
            <div className="mini-listings">
              {items.slice(0, 3).map((item) => (
                <button
                  className="mini-listing"
                  key={item.id}
                  onClick={() => navigate(`/item/${item.id}`)}
                >
                  <img src={item.image} alt={item.title} />
                  <span>
                    <strong>{item.title}</strong>
                    <small>
                      {item.brand} · ₹{item.value.toLocaleString("en-IN")}
                    </small>
                  </span>
                  <em>Available</em>
                  <Icon name="chevron" size={17} />
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <MobileNav navigate={navigate} onList={() => navigate("/list")} />
    </>
  );
}

function AuthPage({ mode, navigate }) {
  const isRegister = mode === "register";
  const [submitted, setSubmitted] = useState(false);
  return (
    <>
      <Header onList={() => navigate("/list")} />
      <main className="auth-page">
        <div className="auth-image">
          <img src={images.hero} alt="A curated wardrobe in warm natural light" />
          <div>
            <Logo light />
            <p>
              Wear less.
              <br />
              <em>Swap more.</em>
            </p>
          </div>
        </div>
        <div className="auth-panel">
          <div className="auth-form">
            <span className="eyebrow">Homies Wear</span>
            <h1>
              {isRegister ? (
                <>
                  Join <em>the closet.</em>
                </>
              ) : (
                <>
                  Welcome <em>back.</em>
                </>
              )}
            </h1>
            <p>
              {isRegister
                ? "Turn clothes you don’t wear into something someone else will love."
                : "Sign in to continue your swapping journey."}
            </p>
            {submitted ? (
              <div className="auth-success">
                <div className="success-mark">
                  <Icon name="check" size={24} />
                </div>
                <h2>{isRegister ? "You’re on the list." : "Welcome back."}</h2>
                <button
                  className="button button-dark"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to dashboard <Icon name="arrow" size={17} />
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                {isRegister && (
                  <label>
                    Name
                    <input required placeholder="Your name" />
                  </label>
                )}
                <label>
                  Email
                  <input required type="email" placeholder="you@example.com" />
                </label>
                <label>
                  Password
                  <input required type="password" placeholder="At least 8 characters" />
                </label>
                {isRegister && (
                  <label>
                    Location
                    <input placeholder="Jorhat, Assam" />
                  </label>
                )}
                {!isRegister && (
                  <button type="button" className="forgot-link">
                    Forgot password?
                  </button>
                )}
                <button
                  className="button button-dark button-large full-width"
                  type="submit"
                >
                  {isRegister ? "Create account" : "Sign in"}{" "}
                  <Icon name="arrow" size={17} />
                </button>
                <div className="auth-divider">
                  <span />
                  or continue with
                  <span />
                </div>
                <button type="button" className="social-button">
                  Continue with Google
                </button>
                <p className="auth-switch">
                  {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => navigate(isRegister ? "/login" : "/register")}
                  >
                    {isRegister ? "Sign in" : "Sign up"}
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function GenericPage({ type, navigate }) {
  const content = {
    "/how-it-works": [
      "How it works",
      "A better way to find your next favorite piece.",
      "List something good, discover something unexpected, and make the exchange feel personal.",
    ],
    "/nearby": [
      "Nearby swaps",
      "Good finds are closer than you think.",
      "Explore pieces being offered around Jorhat and meet the people giving them a second story.",
    ],
    "/swap-requests": [
      "Swap requests",
      "Keep every exchange in view.",
      "Your requests, conversations, and completed swaps all in one calm place.",
    ],
    "/favorites": [
      "Saved pieces",
      "The ones you want to remember.",
      "Keep an eye on pieces that feel like they belong in your wardrobe.",
    ],
    "/history": [
      "Swap history",
      "A record of better choices.",
      "See the pieces you have passed on and the new stories they found.",
    ],
    "/about": [
      "About Homies Wear",
      "Your closet has more stories to tell.",
      "Homies Wear helps people give unused clothing a second life by exchanging it with people who actually want it.",
    ],
  }[type] || [
    "Coming soon",
    "There’s more good stuff on the way.",
    "We’re shaping this part of Homies Wear with the same care as the rest of the closet.",
  ];
  return (
    <>
      <Header onList={() => navigate("/list")} />
      <main className="center-page generic-page">
        <span className="eyebrow">Homies Wear</span>
        <h1>{content[0]}</h1>
        <h2>{content[1]}</h2>
        <p>{content[2]}</p>
        <button className="button button-dark" onClick={() => navigate("/explore")}>
          Explore clothes <Icon name="arrow" size={17} />
        </button>
      </main>
      <Footer />
    </>
  );
}

function MobileNav({ navigate, onList }) {
  const currentPath = window.location.pathname;
  const isExplore =
    currentPath === "/explore" ||
    currentPath.startsWith("/item/") ||
    currentPath.startsWith("/swap/request/");
  return (
    <nav className="mobile-nav">
      <button
        className={currentPath === "/" ? "active" : ""}
        aria-current={currentPath === "/" ? "page" : undefined}
        onClick={() => navigate("/")}
      >
        <span>⌂</span>Home
      </button>
      <button
        className={isExplore ? "active" : ""}
        aria-current={isExplore ? "page" : undefined}
        onClick={() => navigate("/explore")}
      >
        <Icon name="search" size={18} />
        Explore
      </button>
      <button className="mobile-add" aria-label="List an item" onClick={onList}>
        <Icon name="plus" size={22} />
      </button>
      <button
        className={currentPath === "/messages" ? "active" : ""}
        onClick={() => navigate("/messages")}
      >
        <Icon name="message" size={18} />
        Messages
      </button>
      <button
        className={currentPath === "/dashboard" ? "active" : ""}
        onClick={() => navigate("/dashboard")}
      >
        <Icon name="user" size={18} />
        Profile
      </button>
    </nav>
  );
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState("");
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const navigate = (next) => {
    window.history.pushState({}, "", next);
    setPath(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
    setToast(
      favorites.includes(id) ? "Removed from saved pieces" : "Saved to your pieces",
    );
    window.setTimeout(() => setToast(""), 2200);
  };
  const openItem = (item) => navigate(`/item/${item.id}`);
  const selected = items.find((item) => path.endsWith(item.id)) || items[0];
  let content;
  if (path === "/")
    content = (
      <Home
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        onOpen={openItem}
        navigate={navigate}
        onList={() => navigate("/list")}
      />
    );
  else if (path === "/explore")
    content = (
      <Explore
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        onOpen={openItem}
        navigate={navigate}
      />
    );
  else if (path.startsWith("/item/"))
    content = (
      <ItemDetail
        item={selected}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        navigate={navigate}
      />
    );
  else if (path.startsWith("/swap/request/"))
    content = <SwapRequest item={selected} navigate={navigate} />;
  else if (path === "/list") content = <ListPage navigate={navigate} />;
  else if (path === "/messages") content = <Messages navigate={navigate} />;
  else if (path === "/dashboard") content = <Dashboard navigate={navigate} />;
  else if (path === "/login" || path === "/register")
    content = <AuthPage mode={path.slice(1)} navigate={navigate} />;
  else if (path === "/how-it-works") content = <HowPage navigate={navigate} />;
  else if (path === "/nearby")
    content = (
      <NearbyPage
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        onOpen={openItem}
        navigate={navigate}
      />
    );
  else content = <GenericPage type={path} navigate={navigate} />;
  return (
    <>
      {content}
      {toast && (
        <div className="toast">
          <Icon name="check" size={16} />
          {toast}
        </div>
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
