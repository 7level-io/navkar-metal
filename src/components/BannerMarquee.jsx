import "./BannerMarquee.css";
import {
  BoxIcon,
  ChatIcon,
  HeartIcon,
  MobileIcon,
  ShieldCheckIcon,
  VerifiedIcon,
} from "./BannerIcons";

const banners = [
  { icon: <VerifiedIcon />, text: "Affordable pricing with no hidden fees" },
  { icon: <ShieldCheckIcon />, text: "FDA-regulated pharmacies" },
  { icon: <MobileIcon />, text: "100% online process" },
  { icon: <ChatIcon />, text: "Unlimited provider messaging" },
  { icon: <VerifiedIcon />, text: "US-Sourced ingredients" },
  { icon: <HeartIcon />, text: "Free Shipping Over $50" },
  { icon: <BoxIcon />, text: "New Arrivals Just Dropped!" },
];

export default function BannerMarquee() {
  // Duplicate the array for looping effect
  const scrollingContent = [...banners, ...banners];

  return (
    <div className="marquee-container">
      <div className="marquee-inner">
        {/* <span className="marquee-label">Why 7Level?</span> */}
        <div className="marquee-track">
          <div className="marquee-content">
            {scrollingContent.map((item, i) => (
              <span key={i}>
                {item.icon} {item.text}&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
