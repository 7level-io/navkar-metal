import pipe from "../assets/imgs/pipe.png"
import angle from "../assets/imgs/angle.png"
import flat from "../assets/imgs/flat.png"
import sheet from "../assets/imgs/sheet.png"
import roofing from "../assets/imgs/roofing.png"

const baseUrl = import.meta.env.BASE_URL || "";

const sectionsData = [
  {
    image: pipe,
    heading: "Pipe",
    description: "",
    message: `Check this out: Cool Item \nThis is an awesome product \n${window.location.origin + baseUrl}pipe`
  },
  {
    image: angle,
    heading: "Angle",
    description: "",
    message: `Check this out: Cool Item \nThis is an awesome product \n${window.location.origin + baseUrl}angle`
  },
  {
    image: flat,
    heading: "Flat",
    description: "",
    message: `Check this out: Cool Item \nThis is an awesome product \n${window.location.origin + baseUrl }flat`
  },
  {
    image: sheet,
    heading: "Sheet",
    description: "",
    message: `Check this out: Cool Item \nThis is an awesome product \n${window.location.origin + baseUrl }sheet`
  },
  {
    image: roofing,
    heading: "Roofing",
    description: "",
    message: `Check this out: Cool Item \nThis is an awesome product \n${window.location.origin + baseUrl }roofing`
  },
];

export default sectionsData;

