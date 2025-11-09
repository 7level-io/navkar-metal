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
  { icon: <VerifiedIcon />, text: "Trusted brands" },
  { icon: <ShieldCheckIcon />, text: "ISI approved" },
  { icon: <MobileIcon />, text: "Online process" },
  { icon: <ChatIcon />, text: "Unlimited free enquiry" },
  { icon: <VerifiedIcon />, text: "Aftersales support" },
  { icon: <HeartIcon />,text: "Affordable rates" },
  { icon: <BoxIcon />, text: "Low minimum order" },
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
