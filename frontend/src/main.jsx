import React, { useEffect, useState, useCallback, useRef } from "react";
import { createRoot } from "react-dom/client";
import { api, getSocket, getToken, getStoredUser, clearAuthSession } from "./api.js";
import "./styles.css";
import "./auth.css";
import "./final-touch.css";
import "./usability.css";
import "./mobile-fix.css";
import "./visual-refresh.css";

const fallbackImages = {
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

const categories = [
  { name: "Streetwear", image: fallbackImages.category1, count: "128 pieces" },
  { name: "Women", image: fallbackImages.category2, count: "204 pieces" },
  { name: "Outerwear", image: fallbackImages.category3, count: "86 pieces" },
  { name: "Vintage", image: fallbackImages.category4, count: "74 pieces" },
];

const DEFAULT_ITEMS = [
  {
    id: "hoodie",
    title: "Oversized Hoodie",
    brand: "Nike",
    size: "M",
    condition: "Excellent",
    location: "Jorhat",
    distance: "3.2 km",
    value: 2800,
    image: fallbackImages.hoodie,
    owner: "Rahul",
    category: "Streetwear",
    color: "Charcoal",
    status: "AVAILABLE",
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
    image: fallbackImages.jacket,
    owner: "Ananya",
    category: "Outerwear",
    color: "Blue",
    status: "AVAILABLE",
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
    image: fallbackImages.sweater,
    owner: "Sneha",
    category: "Women",
    color: "Cream",
    status: "AVAILABLE",
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
    image: fallbackImages.track,
    owner: "Karthik",
    category: "Sportswear",
    color: "Olive",
    status: "AVAILABLE",
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
    image: fallbackImages.shirt,
    owner: "Pankaj",
    category: "Unisex",
    color: "White",
    status: "AVAILABLE",
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
    image: fallbackImages.tee,
    owner: "Aman",
    category: "Streetwear",
    color: "White",
    status: "AVAILABLE",
  },
  {
    id: "pants",
    title: "Pleated Wide Trousers",
    brand: "Cos",
    size: "32",
    condition: "Like new",
    location: "Jorhat",
    distance: "3.7 km",
    value: 3400,
    image: fallbackImages.pants,
    owner: "Pooja",
    category: "Women",
    color: "Black",
    status: "AVAILABLE",
  },
  {
    id: "varsity",
    title: "Wool Varsity Jacket",
    brand: "Vintage",
    size: "XL",
    condition: "Good",
    location: "Golaghat",
    distance: "24 km",
    value: 4500,
    image: fallbackImages.varsity,
    owner: "Debojit",
    category: "Vintage",
    color: "Forest Green",
    status: "AVAILABLE",
  },
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
      <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.7Z" />
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
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.2 8.2 0 0 1-3.1-.6L4 20l1.4-3.8A7.1 7.1 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="M5 12h13M13 6l6 6-6 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    filter: <path d="M4 6h16M7 12h10M10 18h4" />,
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
  return <svg {...common}>{paths[name] || null}</svg>;
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

function Header({ onList, currentUser, unreadCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = window.location.pathname;
  const go = (path) => {
    setMenuOpen(false);
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const userInitials =
    currentUser?.avatar ||
    (currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "HB");

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
            onClick={() => go(currentUser ? "/messages" : "/login")}
          >
            <Icon name="message" />
          </button>
          <button
            className="icon-button desktop-only notification-trigger"
            aria-label="Notifications"
            onClick={() => go(currentUser ? "/dashboard" : "/login")}
          >
            <Icon name="bell" />
            {unreadCount > 0 && <i />}
          </button>
          <button
            className="avatar-button"
            aria-label="Profile"
            onClick={() => go(currentUser ? "/dashboard" : "/login")}
            title={currentUser ? currentUser.name : "Sign In"}
          >
            <span>{currentUser ? userInitials : <Icon name="user" size={17} />}</span>
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

function ProductCard({ item, favorites = [], toggleFavorite, onOpen }) {
  if (!item) return null;
  const isFav = Array.isArray(favorites) && item.id ? favorites.includes(item.id) : false;
  const displayImage =
    item.image || (item.images && item.images[0]) || fallbackImages.hoodie;
  const displayValue = (item.value != null ? item.value : item.estimatedValue) ?? 2400;

  return (
    <article className="product-card" onClick={() => onOpen(item)}>
      <div className="product-image-wrap">
        <img src={displayImage} alt={item.title} loading="lazy" />
        <button
          className={`heart-button ${isFav ? "is-favorite" : ""}`}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
        >
          <Icon name="heart" size={19} />
        </button>
        <span className="image-tag">{item.condition || "Good"}</span>
        {item.status && item.status !== "AVAILABLE" && (
          <span className="status-overlay-tag">{item.status.toLowerCase()}</span>
        )}
      </div>
      <div className="product-info">
        <div className="product-title-row">
          <h3>{item.title}</h3>
          <span className="product-arrow">
            <Icon name="arrow" size={16} />
          </span>
        </div>
        <p>
          {item.brand || "Homie"} <b>·</b> {item.size || "M"} <b>·</b>{" "}
          {item.condition || "Good"}
        </p>
        <div className="product-meta">
          <span>
            <Icon name="pin" size={13} />
            {item.location || "Jorhat"} {item.distance ? `· ${item.distance}` : ""}
          </span>
          <strong>₹{displayValue.toLocaleString("en-IN")}</strong>
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
          <img
            src={fallbackImages.hero}
            alt="Person wearing a neutral outfit in a sunlit room"
          />
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

function FeaturedSection({ items = [], favorites, toggleFavorite, onOpen, onExplore }) {
  const displayItems = items.slice(0, 4);

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
        {displayItems.map((item) => (
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
        <iframe
          title="Google Map showing clothing swaps near Jorhat, Assam"
          src="https://www.google.com/maps?q=Jorhat%2C%20Assam&z=12&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
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
          <span className="impact-note">Based on active community data</span>
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

function Home({
  items,
  favorites,
  toggleFavorite,
  onOpen,
  navigate,
  onList,
  currentUser,
  unreadCount,
}) {
  return (
    <>
      <Header onList={onList} currentUser={currentUser} unreadCount={unreadCount} />
      <main>
        <Hero onExplore={() => navigate("/explore")} onList={onList} />
        <ValueStrip />
        <FeaturedSection
          items={items}
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
      <MobileNav navigate={navigate} onList={onList} currentUser={currentUser} />
    </>
  );
}

function HowPage({ navigate, currentUser, unreadCount }) {
  return (
    <>
      <Header
        onList={() => navigate("/list")}
        currentUser={currentUser}
        unreadCount={unreadCount}
      />
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
            <img
              src={fallbackImages.shirt}
              alt="A linen shirt ready for its next story"
            />
            <span>01 / 04</span>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav
        navigate={navigate}
        onList={() => navigate("/list")}
        currentUser={currentUser}
      />
    </>
  );
}

function NearbyPage({
  favorites,
  toggleFavorite,
  onOpen,
  navigate,
  currentUser,
  unreadCount,
}) {
  const [nearbyItems, setNearbyItems] = useState(DEFAULT_ITEMS.slice(0, 4));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.items
      .nearby({ radius: 25 })
      .then((data) => {
        if (data && data.length > 0) setNearbyItems(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header
        onList={() => navigate("/list")}
        currentUser={currentUser}
        unreadCount={unreadCount}
      />
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
            {nearbyItems.map((item) => (
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
      <MobileNav
        navigate={navigate}
        onList={() => navigate("/list")}
        currentUser={currentUser}
      />
    </>
  );
}

function Explore({
  favorites,
  toggleFavorite,
  onOpen,
  navigate,
  currentUser,
  unreadCount,
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All pieces");
  const [sort, setSort] = useState("Recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [itemsList, setItemsList] = useState(DEFAULT_ITEMS);
  const [totalCount, setTotalCount] = useState(DEFAULT_ITEMS.length);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(() => {
    setLoading(true);
    api.items
      .list({
        q: query,
        category: category === "All pieces" ? "" : category,
        sort,
      })
      .then((res) => {
        if (res.items && res.items.length > 0) {
          setItemsList(res.items);
          setTotalCount(res.meta?.total ?? res.items.length);
        } else if (!query && category === "All pieces") {
          setItemsList(DEFAULT_ITEMS);
          setTotalCount(DEFAULT_ITEMS.length);
        } else {
          setItemsList(res.items || []);
          setTotalCount(res.meta?.total ?? 0);
        }
      })
      .catch((err) => console.error("Error loading items:", err))
      .finally(() => setLoading(false));
  }, [query, category, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  return (
    <>
      <Header
        onList={() => navigate("/list")}
        currentUser={currentUser}
        unreadCount={unreadCount}
      />
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
            <strong>{totalCount}</strong>
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
              <strong>{totalCount}</strong> pieces available
            </p>
            <span>
              <Icon name="pin" size={14} /> Jorhat, Assam
            </span>
          </div>
          <div className="product-grid explore-grid">
            {itemsList.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                onOpen={onOpen}
              />
            ))}
          </div>
          {!loading && itemsList.length === 0 && (
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
      <MobileNav
        navigate={navigate}
        onList={() => navigate("/list")}
        currentUser={currentUser}
      />
    </>
  );
}

function ItemDetail({
  item: initialItem,
  favorites,
  toggleFavorite,
  navigate,
  currentUser,
  unreadCount,
}) {
  const fallbackItem =
    DEFAULT_ITEMS.find((d) => d.id === initialItem?.id) ||
    initialItem ||
    DEFAULT_ITEMS[0];
  const [item, setItem] = useState(fallbackItem);
  const [activeImage, setActiveImage] = useState(
    fallbackItem.image || fallbackItem.images?.[0] || fallbackImages.hoodie,
  );

  useEffect(() => {
    if (initialItem?.id) {
      const foundDefault = DEFAULT_ITEMS.find((d) => d.id === initialItem.id);
      if (foundDefault) {
        setItem(foundDefault);
        setActiveImage(foundDefault.image || fallbackImages.hoodie);
      }
      api.items
        .get(initialItem.id)
        .then((data) => {
          if (data && data.id) {
            setItem(data);
            setActiveImage(data.image || data.images?.[0] || fallbackImages.hoodie);
          }
        })
        .catch(() => {});
    }
  }, [initialItem?.id]);

  const isFavorite = favorites.includes(item?.id);
  const ownerName = item?.ownerDetails?.name || item?.owner || "Homie";
  const ownerAvatar = item?.ownerDetails?.avatar || ownerName.slice(0, 1);
  const ownerRating = item?.ownerDetails?.rating ?? item?.ownerRating ?? 4.9;
  const ownerSwaps = item?.ownerDetails?.successfulSwaps ?? item?.ownerSwaps ?? 12;

  const isAvailable = item?.status === "AVAILABLE";

  return (
    <>
      <Header
        onList={() => navigate("/list")}
        currentUser={currentUser}
        unreadCount={unreadCount}
      />
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
              {(item.images && item.images.length > 0
                ? item.images
                : [item.image, fallbackImages.hero, fallbackImages.tee]
              ).map((img, i) => (
                <button
                  className={activeImage === img ? "active" : ""}
                  key={i}
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
                className={`heart-button detail-heart ${isFavorite ? "is-favorite" : ""}`}
                onClick={() => toggleFavorite(item.id)}
              >
                <Icon name="heart" size={20} />
              </button>
            </div>
            <h1>{item.title}</h1>
            <p className="detail-subtitle">
              {item.brand} · {item.size} · {item.color}
            </p>
            <div className="rating">
              <span>★</span> {ownerRating} <i>·</i> {ownerSwaps} successful swaps
            </div>
            <div className="detail-price">
              <span>Estimated swap value</span>
              <strong>
                ₹{(item.value ?? item.estimatedValue ?? 2400).toLocaleString("en-IN")}
              </strong>
              <small>
                Values are a friendly guide to support fair exchanges, not a price tag.
              </small>
            </div>
            <div className="detail-location">
              <Icon name="pin" size={17} />
              <div>
                <strong>{item.location || "Jorhat, Assam"}</strong>
                <span>{item.distance || "Nearby"} · approximate radius</span>
              </div>
            </div>
            <p className="detail-description">
              {item.description ||
                "An easy everyday piece in lovely condition. Worn with care and ready for its next story."}
            </p>
            <div className="detail-actions">
              {isAvailable ? (
                <button
                  className="button button-dark button-large"
                  onClick={() => {
                    if (!currentUser) navigate("/login");
                    else navigate(`/swap/request/${item.id}`);
                  }}
                >
                  Request a swap <Icon name="arrow" size={17} />
                </button>
              ) : (
                <button
                  className="button button-dark button-large"
                  disabled
                  style={{ opacity: 0.6 }}
                >
                  Item is {item.status.toLowerCase()}
                </button>
              )}
              <button
                className="button button-light button-large"
                onClick={() => navigate(currentUser ? "/messages" : "/login")}
              >
                <Icon name="message" size={17} /> Message owner
              </button>
            </div>
            <div
              className="owner-card"
              onClick={() => item.ownerId && navigate(`/profile/${item.ownerId}`)}
            >
              <div className="owner-avatar">{ownerAvatar}</div>
              <div>
                <strong>{ownerName}</strong>
                <span>
                  Member · {item.ownerDetails?.responseRate ?? 95}% response rate
                </span>
              </div>
              <Icon name="chevron" size={17} />
            </div>
            <div className="detail-specs">
              <div>
                <span>Brand</span>
                <strong>{item.brand || "Unbranded"}</strong>
              </div>
              <div>
                <span>Condition</span>
                <strong>{item.condition || "Good"}</strong>
              </div>
              <div>
                <span>Color</span>
                <strong>{item.color || "Multi"}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{item.status || "AVAILABLE"}</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MobileNav
        navigate={navigate}
        onList={() => navigate("/list")}
        currentUser={currentUser}
      />
    </>
  );
}

function SwapRequest({ item, navigate, currentUser, unreadCount }) {
  const [myItems, setMyItems] = useState([]);
  const [selectedMyItemId, setSelectedMyItemId] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser?.id) {
      api.items
        .list({ ownerId: currentUser.id, status: "AVAILABLE" })
        .then((res) => {
          setMyItems(res.items);
          if (res.items.length > 0) {
            setSelectedMyItemId(res.items[0].id);
          }
        })
        .catch(() => {});
    }
  }, [currentUser]);

  const selectedMyItem = myItems.find((i) => i.id === selectedMyItemId) ||
    myItems[0] || {
      title: "Your piece",
      size: "M",
      condition: "Good",
      value: 2400,
      image: fallbackImages.shirt,
    };

  const theirValue = item.value ?? item.estimatedValue ?? 2400;
  const myValue = selectedMyItem.value ?? selectedMyItem.estimatedValue ?? 2400;
  const diff = Math.abs(theirValue - myValue);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (!selectedMyItemId) {
      setError("Please list or select an item from your closet to offer.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.swaps.create({
        receiverId: item.ownerId || item.ownerDetails?._id,
        senderItemId: selectedMyItemId,
        receiverItemId: item.id,
        message,
      });
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send swap request.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <>
        <Header
          onList={() => navigate("/list")}
          currentUser={currentUser}
          unreadCount={unreadCount}
        />
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
            <button className="text-button" onClick={() => navigate("/dashboard")}>
              View my requests
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header
        onList={() => navigate("/list")}
        currentUser={currentUser}
        unreadCount={unreadCount}
      />
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
                <img
                  src={selectedMyItem.image || fallbackImages.shirt}
                  alt="Your clothing piece"
                />
                <span>Your item</span>
                <strong>{selectedMyItem.title}</strong>
                <small>
                  {selectedMyItem.size || "M"} · {selectedMyItem.condition || "Good"} · ₹
                  {myValue.toLocaleString("en-IN")}
                </small>
              </div>
              <div className="swap-symbol">⇄</div>
              <div className="swap-item">
                <img src={item.image || fallbackImages.hoodie} alt={item.title} />
                <span>Their item</span>
                <strong>{item.title}</strong>
                <small>
                  {item.size} · {item.condition} · ₹{theirValue.toLocaleString("en-IN")}
                </small>
              </div>
            </div>
          </div>
          <form className="swap-form" onSubmit={handleSubmit}>
            {error && (
              <div
                className="inline-error"
                style={{ color: "crimson", marginBottom: 12 }}
              >
                {error}
              </div>
            )}
            <label>
              Choose your item{" "}
              {myItems.length > 0 ? (
                <select
                  value={selectedMyItemId}
                  onChange={(e) => setSelectedMyItemId(e.target.value)}
                >
                  {myItems.map((mi) => (
                    <option key={mi.id} value={mi.id}>
                      {mi.title} · {mi.size} · ₹
                      {(mi.value ?? mi.estimatedValue).toLocaleString("en-IN")}
                    </option>
                  ))}
                </select>
              ) : (
                <p style={{ fontSize: "0.9rem", marginTop: 4 }}>
                  You don't have available pieces listed yet.{" "}
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => navigate("/list")}
                  >
                    List an item now
                  </button>
                </p>
              )}
            </label>
            <div className="value-compare">
              <div>
                <span>Your item</span>
                <strong>₹{myValue.toLocaleString("en-IN")}</strong>
              </div>
              <div>
                <span>Their item</span>
                <strong>₹{theirValue.toLocaleString("en-IN")}</strong>
              </div>
              <div className="difference">
                <span>Difference</span>
                <strong>₹{diff.toLocaleString("en-IN")}</strong>
              </div>
            </div>
            <p className="form-note">
              <Icon name="sparkle" size={15} /> Swap values are estimates. Both people
              decide whether the exchange feels fair.
            </p>
            <label>
              Message {item.owner}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hey! I’d love to swap my ${selectedMyItem.title.toLowerCase()} for your ${item.title.toLowerCase()}.`}
              />
            </label>
            <button
              className="button button-dark button-large full-width"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending proposal..." : "Send swap request"}{" "}
              <Icon name="arrow" size={17} />
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

function ListPage({ navigate, currentUser, unreadCount }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Streetwear");
  const [size, setSize] = useState("M");
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("Good");
  const [description, setDescription] = useState("");
  const [estimatedValue, setEstimatedValue] = useState(2400);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dynamically update estimated value using backend calculation
  useEffect(() => {
    api.items
      .calculateValue({ category, brand, condition })
      .then((res) => {
        if (res.estimatedValue) setEstimatedValue(res.estimatedValue);
      })
      .catch(() => {});
  }, [category, brand, condition]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!title.trim()) {
      setError("Please enter an item name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const created = await api.items.create({
        title,
        category,
        size,
        brand: brand || "Unbranded",
        condition,
        description,
        estimatedValue,
        images: [fallbackImages.jacket],
        location: currentUser.location || "Jorhat, Assam",
      });
      setPublished(true);
      setTimeout(() => {
        navigate(`/item/${created.id}`);
      }, 1400);
    } catch (err) {
      setError(err.message || "Failed to publish listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header
        onList={() => navigate("/list")}
        currentUser={currentUser}
        unreadCount={unreadCount}
      />
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
          <form className="listing-form" onSubmit={handleSubmit}>
            {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}
            <label className="photo-upload">
              <input type="file" hidden />
              <span>
                <Icon name="camera" size={24} />
                <strong>Add photos</strong>
                <small>JPG, PNG · automatically styled for clean feeds</small>
              </span>
            </label>
            <label>
              Item name
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Oversized denim jacket"
              />
            </label>
            <div className="form-two">
              <label>
                Category
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Streetwear</option>
                  <option>Outerwear</option>
                  <option>Vintage</option>
                  <option>Women</option>
                  <option>Unisex</option>
                  <option>Sportswear</option>
                </select>
              </label>
              <label>
                Size
                <select value={size} onChange={(e) => setSize(e.target.value)}>
                  <option>XS</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                  <option>32</option>
                  <option>34</option>
                </select>
              </label>
            </div>
            <div className="form-two">
              <label>
                Brand
                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Levi's, Nike, Zara"
                />
              </label>
              <label>
                Condition
                <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                  <option>Brand new</option>
                  <option>Like new</option>
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </label>
            </div>
            <label>
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell people a little about the fit, feel and story of this piece..."
              />
            </label>
            <div className="estimated-value">
              <div>
                <span>Estimated swap value</span>
                <strong>₹{estimatedValue.toLocaleString("en-IN")}</strong>
              </div>
              <small>
                Calculated by our backend algorithm based on brand tier, condition, and
                category.
              </small>
            </div>
            <button
              className="button button-dark button-large full-width"
              type="submit"
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish listing"}{" "}
              <Icon name="arrow" size={17} />
            </button>
            {published && (
              <div className="inline-success">
                <Icon name="check" size={16} /> Your piece is ready for a new story!
              </div>
            )}
          </form>
        </section>
      </main>
    </>
  );
}

function Messages({ navigate, currentUser, unreadCount }) {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    api.conversations
      .list()
      .then((data) => {
        setConversations(data);
        if (data.length > 0) {
          setActiveConvId(data[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!activeConvId) return;

    api.conversations
      .getMessages(activeConvId)
      .then((res) => setMessages(res.messages))
      .catch((err) => console.error(err));

    const socket = getSocket();
    if (socket) {
      socket.emit("join_conversation", { conversationId: activeConvId });

      const handleNewMessage = (msg) => {
        if (msg.conversationId === activeConvId) {
          setMessages((prev) => [...prev, msg]);
        }
      };

      const handleTyping = (data) => {
        if (data.conversationId === activeConvId && data.userId !== currentUser.id) {
          setIsTyping(data.isTyping);
        }
      };

      socket.on("new_message", handleNewMessage);
      socket.on("user_typing", handleTyping);

      return () => {
        socket.emit("leave_conversation", { conversationId: activeConvId });
        socket.off("new_message", handleNewMessage);
        socket.off("user_typing", handleTyping);
      };
    }
  }, [activeConvId, currentUser]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConvId) return;

    const currentText = text.trim();
    setText("");

    try {
      const sentMsg = await api.conversations.sendMessage(activeConvId, {
        text: currentText,
      });
      setMessages((prev) =>
        prev.some((m) => m.id === sentMsg.id) ? prev : [...prev, sentMsg],
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleAcceptProposal = async (swapRequestId) => {
    try {
      await api.swaps.accept(swapRequestId);
      // Refresh messages
      const res = await api.conversations.getMessages(activeConvId);
      setMessages(res.messages);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCounterProposal = async (swapRequestId) => {
    const counterMsg = prompt(
      "Enter your counter-offer message or proposed meeting spot:",
    );
    if (!counterMsg) return;
    try {
      await api.swaps.counter(swapRequestId, { message: counterMsg });
      const res = await api.conversations.getMessages(activeConvId);
      setMessages(res.messages);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Header
        onList={() => navigate("/list")}
        currentUser={currentUser}
        unreadCount={unreadCount}
      />
      <main className="page-main messages-page">
        <section className="section-shell messages-shell">
          <aside className="conversation-list">
            <div className="messages-heading">
              <div>
                <span className="eyebrow">Your inbox</span>
                <h1>Messages</h1>
              </div>
              <button className="icon-button" onClick={() => navigate("/explore")}>
                <Icon name="plus" size={18} />
              </button>
            </div>
            <div className="message-search">
              <Icon name="search" size={16} />
              <input placeholder="Search conversations" />
            </div>
            {conversations.map((chat) => (
              <button
                className={`conversation ${chat.id === activeConvId ? "active" : ""}`}
                key={chat.id}
                onClick={() => setActiveConvId(chat.id)}
              >
                <span className="conversation-avatar">
                  {chat.otherUser?.avatar || "H"}
                </span>
                <span>
                  <strong>{chat.otherUser?.name || "Homie"}</strong>
                  <small>{chat.lastMessage?.text || "Started conversation"}</small>
                </span>
                <time>{chat.unreadCount > 0 ? <b>{chat.unreadCount}</b> : "Active"}</time>
              </button>
            ))}
            {conversations.length === 0 && !loading && (
              <div style={{ padding: 20, color: "gray", fontSize: "0.9rem" }}>
                No active messages. Propose a swap or message an item owner to start
                connecting!
              </div>
            )}
          </aside>
          <section className="chat-window">
            {activeConv ? (
              <>
                <div className="chat-header">
                  <div className="owner-avatar">
                    {activeConv.otherUser?.avatar || "H"}
                  </div>
                  <div>
                    <strong>{activeConv.otherUser?.name || "Homie"}</strong>
                    <span>
                      <i /> {activeConv.otherUser?.location || "Nearby"}
                    </span>
                  </div>
                  <button className="icon-button">
                    <Icon name="ellipsis" size={19} />
                  </button>
                </div>
                <div className="chat-body">
                  <div className="chat-date">Conversation started</div>
                  {messages.map((m) => {
                    const isMe = m.senderId === currentUser.id;

                    if (m.type === "swap_proposal" && m.swapData) {
                      return (
                        <div className="swap-proposal" key={m.id}>
                          <div className="proposal-label">
                            Swap proposal <span>{m.swapData.status || "Pending"}</span>
                          </div>
                          <div className="proposal-items">
                            <div>
                              <img src={fallbackImages.shirt} alt="Piece" />
                              <span>Offered</span>
                              <strong>₹{m.swapData.senderValue || 2400}</strong>
                            </div>
                            <b>⇄</b>
                            <div>
                              <img src={fallbackImages.hoodie} alt="Piece" />
                              <span>Requested</span>
                              <strong>₹{m.swapData.receiverValue || 2800}</strong>
                            </div>
                          </div>
                          {m.swapRequestId && m.swapData.status !== "COMPLETED" && (
                            <div className="proposal-actions">
                              {m.swapData.status !== "ACCEPTED" && (
                                <>
                                  <button
                                    className="button button-dark"
                                    onClick={() => handleAcceptProposal(m.swapRequestId)}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="button button-light"
                                    onClick={() => handleCounterProposal(m.swapRequestId)}
                                  >
                                    Counter offer
                                  </button>
                                </>
                              )}
                              {m.swapData.status === "ACCEPTED" && (
                                <button
                                  className="button button-dark"
                                  onClick={() => navigate("/dashboard")}
                                >
                                  Manage swap in dashboard
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div
                        className={`bubble ${isMe ? "bubble-me" : "bubble-them"}`}
                        key={m.id}
                      >
                        {m.text}
                      </div>
                    );
                  })}
                  {isTyping && (
                    <div
                      className="bubble bubble-them"
                      style={{ fontStyle: "italic", opacity: 0.7 }}
                    >
                      typing...
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>
                <form className="composer" onSubmit={handleSend}>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => navigate("/list")}
                  >
                    <Icon name="plus" size={19} />
                  </button>
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button className="send-button" aria-label="Send message">
                    <Icon name="arrow" size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "gray",
                }}
              >
                Select a conversation to start chatting
              </div>
            )}
          </section>
        </section>
      </main>
      <MobileNav
        navigate={navigate}
        onList={() => navigate("/list")}
        currentUser={currentUser}
      />
    </>
  );
}

function Dashboard({ navigate, currentUser, onLogout, unreadCount }) {
  const [stats, setStats] = useState({
    activeListings: 0,
    pendingRequests: 0,
    successfulSwaps: 0,
    peopleReached: 0,
  });
  const [overview, setOverview] = useState({
    myListings: [],
    incomingRequests: [],
    recentSwaps: [],
  });
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [mySwaps, setMySwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    Promise.all([api.dashboard.stats(), api.dashboard.overview(), api.swaps.list()])
      .then(([s, o, sw]) => {
        setStats(s);
        setOverview(o);
        setMySwaps(sw);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    loadData();
  }, [currentUser, navigate, loadData]);

  const handleAcceptSwap = async (id) => {
    try {
      await api.swaps.accept(id);
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCompleteSwap = async (id) => {
    try {
      await api.swaps.complete(id);
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleRateSwap = async (swapId) => {
    const scoreStr = prompt("Rate your swap experience (1 to 5 stars):", "5");
    if (!scoreStr) return;
    const score = parseInt(scoreStr, 10);
    if (isNaN(score) || score < 1 || score > 5) {
      alert("Score must be between 1 and 5.");
      return;
    }
    const review = prompt("Leave a brief review for your partner:", "Smooth exchange!");
    try {
      await api.ratings.create({ swapId, score, review });
      alert("Rating submitted! Thank you.");
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const incomingSwaps = mySwaps.filter(
    (s) => !s.isSender && ["PENDING", "NEGOTIATING", "COUNTERED"].includes(s.status),
  );
  const sentSwaps = mySwaps.filter(
    (s) => s.isSender && ["PENDING", "NEGOTIATING", "COUNTERED"].includes(s.status),
  );
  const historySwaps = mySwaps.filter((s) =>
    ["COMPLETED", "CANCELLED", "DECLINED"].includes(s.status),
  );

  return (
    <>
      <Header
        onList={() => navigate("/list")}
        currentUser={currentUser}
        unreadCount={unreadCount}
      />
      <main className="page-main dashboard-page">
        <section className="section-shell dashboard-layout">
          <aside className="dashboard-side">
            <div className="dashboard-user">
              <div className="profile-avatar">{currentUser?.avatar || "PB"}</div>
              <strong>{currentUser?.name || "Homie"}</strong>
              <span>{currentUser?.location || "Jorhat, Assam"}</span>
            </div>
            {[
              "Dashboard",
              "My listings",
              "Incoming requests",
              "Sent requests",
              "Swap history",
              "Messages",
            ].map((link) => (
              <button
                className={activeTab === link ? "active" : ""}
                key={link}
                onClick={() => {
                  if (link === "Messages") navigate("/messages");
                  else setActiveTab(link);
                }}
              >
                {link}
                {link === "Incoming requests" && incomingSwaps.length > 0 && (
                  <b>{incomingSwaps.length}</b>
                )}
              </button>
            ))}
            <button className="side-logout" onClick={onLogout}>
              Log out
            </button>
          </aside>
          <div className="dashboard-content">
            {activeTab === "Dashboard" && (
              <>
                <div className="dashboard-heading">
                  <div>
                    <span className="eyebrow">Your wardrobe, in motion</span>
                    <h1>
                      Welcome back,{" "}
                      <em>{currentUser?.name?.split(" ")[0] || "Homie"}.</em>
                    </h1>
                    <p>Here’s what’s happening with your wardrobe.</p>
                  </div>
                  <button
                    className="button button-dark"
                    onClick={() => navigate("/list")}
                  >
                    <Icon name="plus" size={17} /> List an item
                  </button>
                </div>
                <div className="stats-grid">
                  {[
                    [String(stats.activeListings).padStart(2, "0"), "Active listings"],
                    [String(stats.pendingRequests).padStart(2, "0"), "Pending requests"],
                    [String(stats.successfulSwaps).padStart(2, "0"), "Successful swaps"],
                    [String(stats.peopleReached).padStart(2, "0"), "People reached"],
                  ].map(([number, label]) => (
                    <div className="stat-card" key={label}>
                      <strong>{number}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
                <div className="dashboard-section-heading">
                  <h2>My listings</h2>
                  <button
                    className="outline-link"
                    onClick={() => setActiveTab("My listings")}
                  >
                    See all <Icon name="arrow" size={15} />
                  </button>
                </div>
                <div className="mini-listings">
                  {overview.myListings.slice(0, 3).map((item) => (
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
                      <em>{item.status}</em>
                      <Icon name="chevron" size={17} />
                    </button>
                  ))}
                  {overview.myListings.length === 0 && !loading && (
                    <div style={{ color: "gray", padding: 12 }}>
                      You have not listed any clothing pieces yet.
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "My listings" && (
              <div>
                <div className="dashboard-heading">
                  <h2>All My Listings ({overview.myListings.length})</h2>
                  <button
                    className="button button-dark"
                    onClick={() => navigate("/list")}
                  >
                    <Icon name="plus" size={17} /> List a new item
                  </button>
                </div>
                <div className="mini-listings">
                  {overview.myListings.map((item) => (
                    <button
                      className="mini-listing"
                      key={item.id}
                      onClick={() => navigate(`/item/${item.id}`)}
                    >
                      <img src={item.image} alt={item.title} />
                      <span>
                        <strong>{item.title}</strong>
                        <small>
                          {item.brand} · {item.condition} · ₹
                          {item.value.toLocaleString("en-IN")}
                        </small>
                      </span>
                      <em>{item.status}</em>
                      <Icon name="chevron" size={17} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Incoming requests" && (
              <div>
                <div className="dashboard-heading">
                  <h2>Incoming Swap Requests ({incomingSwaps.length})</h2>
                </div>
                <div className="mini-listings">
                  {incomingSwaps.map((s) => (
                    <div
                      className="mini-listing"
                      key={s.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        <strong>From: {s.sender?.name || "A homie"}</strong>
                        <small>
                          Offering: {s.senderItem?.title} (₹{s.senderValue}) ⇄ For:{" "}
                          {s.receiverItem?.title} (₹{s.receiverValue})
                        </small>
                        <p style={{ margin: "4px 0 0", color: "#666" }}>"{s.message}"</p>
                      </span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="button button-dark"
                          onClick={() => handleAcceptSwap(s.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="button button-light"
                          onClick={() => navigate("/messages")}
                        >
                          Chat
                        </button>
                      </div>
                    </div>
                  ))}
                  {incomingSwaps.length === 0 && (
                    <div style={{ color: "gray", padding: 12 }}>
                      No incoming requests right now.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Sent requests" && (
              <div>
                <div className="dashboard-heading">
                  <h2>Sent Swap Requests ({sentSwaps.length})</h2>
                </div>
                <div className="mini-listings">
                  {sentSwaps.map((s) => (
                    <div
                      className="mini-listing"
                      key={s.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        <strong>To: {s.receiver?.name || "A homie"}</strong>
                        <small>
                          You offered: {s.senderItem?.title} ⇄ For:{" "}
                          {s.receiverItem?.title}
                        </small>
                        <em>Status: {s.status}</em>
                      </span>
                      <button
                        className="button button-light"
                        onClick={() => navigate("/messages")}
                      >
                        View in chat
                      </button>
                    </div>
                  ))}
                  {sentSwaps.length === 0 && (
                    <div style={{ color: "gray", padding: 12 }}>
                      No active requests sent yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Swap history" && (
              <div>
                <div className="dashboard-heading">
                  <h2>Swap History ({historySwaps.length})</h2>
                </div>
                <div className="mini-listings">
                  {historySwaps.map((s) => (
                    <div
                      className="mini-listing"
                      key={s.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        <strong>
                          Partner: {s.isSender ? s.receiver?.name : s.sender?.name}
                        </strong>
                        <small>
                          {s.senderItem?.title} ⇄ {s.receiverItem?.title}
                        </small>
                        <em style={{ textTransform: "capitalize" }}>
                          {s.status.toLowerCase()}
                        </em>
                      </span>
                      {s.status === "COMPLETED" && (
                        <button
                          className="button button-dark"
                          onClick={() => handleRateSwap(s.id)}
                        >
                          Rate partner
                        </button>
                      )}
                    </div>
                  ))}
                  {historySwaps.length === 0 && (
                    <div style={{ color: "gray", padding: 12 }}>
                      No completed swaps in history yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <MobileNav
        navigate={navigate}
        onList={() => navigate("/list")}
        currentUser={currentUser}
      />
    </>
  );
}

function AuthPage({ mode, navigate, onAuthSuccess }) {
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("Jorhat, Assam");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        const res = await api.auth.register({ name, email, password, location });
        onAuthSuccess(res.user);
      } else {
        const res = await api.auth.login({ email, password });
        onAuthSuccess(res.user);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header onList={() => navigate("/list")} />
      <main className="auth-page">
        <div className="auth-image">
          <img src={fallbackImages.hero} alt="A curated wardrobe in warm natural light" />
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

            {error && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#b91c1c",
                  padding: "10px 14px",
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: "0.9rem",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {isRegister && (
                <label>
                  Name
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </label>
              )}
              <label>
                Email
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Password
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </label>
              {isRegister && (
                <label>
                  Location
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Jorhat, Assam"
                  />
                </label>
              )}
              <button
                className="button button-dark button-large full-width"
                type="submit"
                disabled={loading}
              >
                {loading ? "Processing..." : isRegister ? "Create account" : "Sign in"}{" "}
                <Icon name="arrow" size={17} />
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
          </div>
        </div>
      </main>
    </>
  );
}

function GenericPage({ type, navigate, currentUser, unreadCount }) {
  const content = {
    "/how-it-works": [
      "How it works",
      "A better way to find your next favorite piece.",
      "List something good, discover something unexpected, and make the exchange feel personal.",
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
      <Header
        onList={() => navigate("/list")}
        currentUser={currentUser}
        unreadCount={unreadCount}
      />
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

function MobileNav({ navigate, onList, currentUser }) {
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
        onClick={() => navigate(currentUser ? "/messages" : "/login")}
      >
        <Icon name="message" size={18} />
        Messages
      </button>
      <button
        className={currentPath === "/dashboard" ? "active" : ""}
        onClick={() => navigate(currentUser ? "/dashboard" : "/login")}
      >
        <Icon name="user" size={18} />
        Profile
      </button>
    </nav>
  );
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [favorites, setFavorites] = useState([]);
  const [featuredItems, setFeaturedItems] = useState(DEFAULT_ITEMS.slice(0, 4));
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Fetch current user verification and initial items
  useEffect(() => {
    api.items
      .list({ limit: 4 })
      .then((res) => {
        if (res.items && res.items.length > 0) {
          setFeaturedItems(res.items);
        }
      })
      .catch(() => {});

    if (getToken()) {
      api.auth
        .me()
        .then((user) => setCurrentUser(user))
        .catch(() => clearAuthSession());

      api.favorites
        .list()
        .then((favs) => setFavorites(favs.map((f) => f.id)))
        .catch(() => {});

      api.notifications
        .list()
        .then((res) => setUnreadCount(res.unreadCount))
        .catch(() => {});
    }
  }, []);

  // Real-time notification updates via Socket.IO
  useEffect(() => {
    if (!currentUser) return;
    const socket = getSocket();
    if (!socket) return;

    const onNotification = (notif) => {
      setUnreadCount((prev) => prev + 1);
      setToast(notif.title || "New notification");
      window.setTimeout(() => setToast(""), 3500);
    };

    socket.on("new_notification", onNotification);
    return () => socket.off("new_notification", onNotification);
  }, [currentUser]);

  const navigate = (next) => {
    window.history.pushState({}, "", next);
    setPath(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFavorite = async (id) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const isFav = favorites.includes(id);
    setFavorites((current) =>
      isFav ? current.filter((x) => x !== id) : [...current, id],
    );
    setToast(isFav ? "Removed from saved pieces" : "Saved to your pieces");
    window.setTimeout(() => setToast(""), 2200);

    try {
      if (isFav) await api.favorites.remove(id);
      else await api.favorites.add(id);
    } catch {
      // Revert if API fails
      setFavorites((current) =>
        isFav ? [...current, id] : current.filter((x) => x !== id),
      );
    }
  };

  const handleLogout = async () => {
    await api.auth.logout();
    setCurrentUser(null);
    setFavorites([]);
    navigate("/");
    setToast("Logged out successfully");
    window.setTimeout(() => setToast(""), 2200);
  };

  const openItem = (item) => navigate(`/item/${item.id}`);

  let content;
  if (path === "/") {
    content = (
      <Home
        items={featuredItems}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        onOpen={openItem}
        navigate={navigate}
        onList={() => navigate(currentUser ? "/list" : "/login")}
        currentUser={currentUser}
        unreadCount={unreadCount}
      />
    );
  } else if (path === "/explore") {
    content = (
      <Explore
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        onOpen={openItem}
        navigate={navigate}
        currentUser={currentUser}
        unreadCount={unreadCount}
      />
    );
  } else if (path.startsWith("/item/")) {
    const itemId = path.split("/item/")[1];
    content = (
      <ItemDetail
        item={{ id: itemId, title: "Loading...", image: fallbackImages.hero }}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        navigate={navigate}
        currentUser={currentUser}
        unreadCount={unreadCount}
      />
    );
  } else if (path.startsWith("/swap/request/")) {
    const itemId = path.split("/swap/request/")[1];
    content = (
      <SwapRequest
        item={{ id: itemId, title: "Requested piece", image: fallbackImages.hoodie }}
        navigate={navigate}
        currentUser={currentUser}
        unreadCount={unreadCount}
      />
    );
  } else if (path === "/list") {
    content = (
      <ListPage navigate={navigate} currentUser={currentUser} unreadCount={unreadCount} />
    );
  } else if (path === "/messages") {
    content = (
      <Messages navigate={navigate} currentUser={currentUser} unreadCount={unreadCount} />
    );
  } else if (path === "/dashboard") {
    content = (
      <Dashboard
        navigate={navigate}
        currentUser={currentUser}
        onLogout={handleLogout}
        unreadCount={unreadCount}
      />
    );
  } else if (path === "/login" || path === "/register") {
    content = (
      <AuthPage
        mode={path.slice(1)}
        navigate={navigate}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />
    );
  } else if (path === "/how-it-works") {
    content = (
      <HowPage navigate={navigate} currentUser={currentUser} unreadCount={unreadCount} />
    );
  } else if (path === "/nearby") {
    content = (
      <NearbyPage
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        onOpen={openItem}
        navigate={navigate}
        currentUser={currentUser}
        unreadCount={unreadCount}
      />
    );
  } else {
    content = (
      <GenericPage
        type={path}
        navigate={navigate}
        currentUser={currentUser}
        unreadCount={unreadCount}
      />
    );
  }

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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "80px 24px",
            textAlign: "center",
            maxWidth: "480px",
            margin: "0 auto",
            fontFamily: "var(--font-body, system-ui, sans-serif)",
          }}
        >
          <h2
            style={{
              fontSize: "1.75rem",
              marginBottom: "12px",
              color: "var(--color-ink, #111)",
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              color: "var(--color-muted, #666)",
              marginBottom: "24px",
              lineHeight: 1.5,
            }}
          >
            {this.state.error?.message ||
              "An unexpected error occurred while loading this view."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = "/";
            }}
            style={{
              padding: "12px 28px",
              background: "var(--color-primary, #111)",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            Back to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
