import _ from "lodash";

import { useLocation, useNavigate } from "react-router-dom";
import { Menus } from "../helper/datas/menu";
import { getFooterData } from "../helper/api/apiHelper";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { colorTheme } from "../redux/authSlice";

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [footerData, setFooterData] = useState(null);
  const [color, setColor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFooterData();
        setFooterData(response.data);
        setColor(response.data[0].colors);
        dispatch(
          colorTheme({
            primaryColor: response.data[0].colors.primaryColor,
            secondaryColor: response.data[0].colors.secondaryColor,
            thirdColor: response.data[0].colors.thirdColor,
            fourthColor: response.data[0].colors.fourthColor,
          })
        );
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };

    fetchData();
  }, []);

  if (footerData === null) {
    return null;
  }

  const firstFooterData = footerData[0];
  const socialMediaLinks = firstFooterData.socialMediaLinks || [];

  const social = [
    {
      id: 1,
      link: "https://instagram.com/bromagindia?utm_source=qr&igshid=MThlNWY1MzQwNA==",
      name: "igram",
    },
    {
      id: 2,
      link: "https://www.facebook.com/bromagindia?mibextid=ZbWKwL",
      name: "fbook",
    },
    {
      id: 3,
      link: "https://whatsapp.com/channel/0029VaBEhJ40gcfSjIZsQV04",
      name: "wup",
    },
    {
      id: 4,
      link: "https://www.youtube.com/@BROMAGINDIA",
      name: "ytube",
    },
    {
      id: 5,
      link: "https://www.linkedin.com/company/bromagindia/",
      name: "linkedin",
    },
  ];

  const footerLinks = [
    { id: 1, name: "Who we are", link: "/whoweare" },
    { id: 2, name: "Privacy Policy", link: "/privacy" },
    { id: 3, name: "Refund and Cancellation", link: "/cancellation" },
    { id: 4, name: " Terms and Condition", link: "/termsandcondition" },
  ];
  return (
    <div
      className={` py-4 lg:min-h-[53vh] text-white z-50 pb-10 ${
        ["/booking-details", "/play-my-contest", "/my-profile"].includes(
          _.get(location, "pathname", "")
        )
          ? "rounded-none"
          : "lg:rounded-t-[50px] rounded-t-[25px]"
      }`}
      style={{
        backgroundColor: color?.secondaryColor
          ? color?.secondaryColor
          : "#000000",
      }}
    >
      <div className="!flex !flex-col  overflow-hidden">
        <div className="ultraSm:px-4 lg:px-8 py-2">
          {/* Logo */}
          {/* <img
            src={firstFooterData?.logo}
            className="lg:w-[150px] lg:h-[150px]"
            alt="Footer Logo"
          /> */}
        </div>
        <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 px-2 ">
          {/* About Us */}
          <div className="flex flex-col gap-y-10 justify-center items-center ">
            <div className="flex flex-col lg:gap-y-10 gap-y-8 ">
              <h1 className="lg:text-2xl text-sm font-bold   text-[#EFEFEF] ">
                ABOUT US
                <img
                  src="/assets/icons/footerborder.png"
                  alt="Footer Border"
                  className="pt-1"
                />
              </h1>
              <div className="flex flex-col gap-y-3 lg:text-2xl text-sm">
                {footerLinks.map((res, index) => (
                  <p
                    key={index}
                    className="text-[#E5E5E5] cursor-pointer text-[12px]"
                    onClick={() => {
                      navigate(`${res.link}`);
                    }}
                  >
                    {res.name}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Access */}
          {/* <div className="flex flex-col gap-y-10  justify-center items-center ultraSm:w-1/2 lg:w-1/3">
            <div className="flex flex-col lg:gap-y-10 gap-y-8">
              <h1 className="lg:text-2xl text-sm font-bold   text-[#EFEFEF] ">
                QUICK ACCESS
                <img
                  src="/assets/icons/footerborder.png"
                  alt="Footer Border"
                  className="pt-1"
                />
              </h1>
              <div className="flex flex-col gap-y-4 lg:text-xl text-sm">
                {Menus.map((res, index) => (
                  <p
                    key={index}
                    className={` ${
                      res.navigations.includes(
                        _.get(location, "pathname", false)
                      )
                        ? "text-primary_color"
                        : "text-white"
                    } cursor-pointer`}
                    onClick={() => {
                      navigate(`${res.link}`);
                    }}
                  >
                    {res.name}
                  </p>
                ))}
              </div>
            </div>
          </div> */}

          {/* Contact Us */}
          <div className="flex flex-col gap-y-10  justify-center items-center">
            <div className="flex flex-col lg:gap-y-10 gap-y-8">
              <h1 className="lg:text-2xl text-sm font-bold   text-[#EFEFEF] ">
                CONTACT US
                <img
                  src="/assets/icons/footerborder.png"
                  alt="Footer Border"
                  className="lg:pt-1 pt-2"
                />
              </h1>
              <div className="flex flex-col lg:gap-y-2 gap-y-5 lg:text-2xl text-sm">
                <a
                  href={`tel:${firstFooterData?.contactNumber}`}
                  className="lg:pt-3 pt-1 cursor-pointer center_div justify-start gap-x-2"
                >
                  <img
                    src="/assets/icons/call.png"
                    className="w-[10px]"
                    alt="Call Icon"
                  />
                  <h1>{firstFooterData?.contactNumber}</h1>
                </a>
                <a
                  href={`mailto:${firstFooterData?.email}`}
                  className="lg:pt-3 pt-1 cursor-pointer center_div justify-start gap-x-2"
                >
                  <img
                    src="/assets/icons/email.png"
                    className="w-[10px]"
                    alt="Email Icon"
                  />
                  <h1 className="text-[12px]">{firstFooterData?.email}</h1>
                </a>
                <p className="lg:pt-3 pt-1 cursor-pointer center_div justify-start gap-x-2">
                  <img
                    src="/assets/icons/location.png"
                    className="w-[10px]"
                    alt="Location Icon"
                  />
                  <span className="text-[11px] ">
                    {firstFooterData?.address}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/*  */}
          <div className="flex pt-10 items-center ultraSm:hidden md:block lg:block xl:block 2xl:block p-3 ">
            <div className="flex flex-col border-l border-white/50 pl-10 pr-3">
              <h1 className="text-3xl font-sans  text-[#5e5e5e] font-extrabold  ">
                GIVE YOUR FEEDBACK
              </h1>
              <div className="flex flex-col lg:gap-y-2 gap-y-5 lg:text-2xl text-sm pr-3">
                <div>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="input input-bordered w-full bg-transparent border "
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter your e-mail"
                    className="input input-bordered w-full bg-transparent border "
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter your phone number"
                    className="input input-bordered w-full bg-transparent border "
                  />
                </div>

                <div className="w-full flex items-center py-1 gap-2">
                  <textarea
                    className="textarea textarea-bordered w-[60%] h-16 resize-none bg-white"
                    placeholder="Write something..."
                  ></textarea>
                  <button className="btn w-[40%] h-16 bg-primary_color border-none text-lg text-white">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Social Links */}
        </div>
        <div className="flex gap-x-5 justify-center items-center mt-5">
          {social.map((res, index) => (
            <a key={index} href={res.link} target="_blank" rel="noreferrer">
              <img
                src={`/assets/icons/${res.name}.png`}
                className="w-[25px] h-[25px]"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Footer;
