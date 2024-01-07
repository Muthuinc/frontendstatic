/* eslint-disable react/jsx-no-target-blank */
import { GrMapLocation } from "react-icons/gr";
import { FaLocationDot } from "react-icons/fa6";

const Locations = () => {
  return (
    <div className="flex lg:pt-10 pt-4 flex-col items-center justify-center pb-20">
      <div className="my-5 flex justify-center items-center  w-full">
        <div>
          <FaLocationDot className="ultraSm:text-2xl lg:text-6xl  " />
        </div>
        <div className=" p-2">
          <img
            src="/assets/icons/certificate of.png"
            alt=""
            className="ultraSm:w-[200px] lg:w-[500px]"
          />
        </div>
      </div>
      <a
        href="https://www.google.com/maps/place/Bromag+India+Private+Limited/@13.0509261,80.2273956,17z/data=!3m1!4b1!4m6!3m5!1s0x3a5267df4adb680f:0x48bd8daebab824b9!8m2!3d13.0509209!4d80.2299705!16s%2Fg%2F11shx70_wv?entry=ttu"
        target="_blank"
      >
        <img
          src={"/assets/images/map.png"}
          className="mt-[-25px] sm:mt-[-55px] md:mt-[-70px] lg:!mt-[-80px] px-2"
        />
      </a>
      <div className="flex flex-col lg:gap-y-20 gap-y-10 items-center pt-14">
        <img src="/assets/logo/footer.png" alt="" className="lg:px-0 px-6" />

        <div className="flex items-center lg:gap-y-2 flex-col">
          <div className="flex items-center gap-x-2">
            <div className="text-[#494949] lg:text-3xl font-bold">
              Connect us with
            </div>
            <img src="/assets/icons/locationflove.png" alt="" />
          </div>
          <div className="text-[#494949] lg:text-2xl font-medium tracking-wider">
            D & D in Chennai, Tamilnadu
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locations;
