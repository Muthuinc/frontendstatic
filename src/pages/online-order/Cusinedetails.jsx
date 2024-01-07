/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Badge,
  Divider,
  Select,
  Skeleton,
  Tag,
  notification,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useHref, useLocation, useNavigate } from "react-router-dom";
import _ from "lodash";
import {
  addToCart,
  decrementCartQuantity,
  getAllCusinessFilter,
  getCurrentUserCarts,
  getFilteredProducts,
  incrementCartQuantity,
  removeSoloFromCart,
} from "../../helper/api/apiHelper";
import { CiDiscount1 } from "react-icons/ci";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import Customization from "./Customization";

const Cusinedetails = () => {
  const [subCategory, setSubCategory] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentSubCategory, setCurrentSubCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [allCusinesCategory, setAllCusinesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [currentCartsData, setCurrentCartsData] = useState([]);
  const [allCartsData, setAllCartsData] = useState([]);
  const [dummy, setDummy] = useState(false);
  const [customizeProduct, setCustomizeProduct] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const currentLocation = useHref();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getAllCusinessFilter(
        localStorage.getItem("search") ||
          _.get(location, "state.currentCatid", "")
      );
      setAllCusinesData(_.get(result, "data.data.categoryData", []));
      setSubCategory(_.get(result, "data.data.subCategoryData", []));
      let filterDatas;
      if (
        localStorage.getItem("search") ||
        _.get(location, "state.currentCatid", "")
      ) {
        filterDatas = _.get(result, "data.data.categoryData", []).filter(
          (res) => {
            return localStorage.getItem("search")
              ? res._id === localStorage.getItem("search")
              : res._id === _.get(location, "state.currentCatid", "");
          }
        );
      } else {
        filterDatas = _.get(result, "data.data.categoryData", []);
        localStorage.setItem(
          "search",
          _.get(result, "data.data.categoryData[0]._id", "")
        );
      }
      setDummy(!dummy);
      setFilteredData(filterDatas);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      notification.error({ message: "Something went wrong" });
    }
  };

  useEffect(() => {
    if (_.get(location, "pathname", "") === "/dining-cusines") {
      if (!_.get(location, "state.currentCatid", "")) {
        navigate("/dining");
      }
    }
    fetchData();
  }, [
    _.get(location, "state.currentCatid", ""),
    localStorage.getItem("search"),
    currentSubCategory,
  ]);

  const fetechProductData = async () => {
    try {
      setLoading(true);
      let searchItems = {
        cat:
          localStorage.getItem("search") ||
          _.get(location, "state.currentCatid", ""),
        subCat: currentSubCategory || "",
      };
      const productDatas = await getFilteredProducts(
        JSON.stringify(searchItems)
      );
      setLoading(false);
      setProductData(_.get(productDatas, "data.data", []));
    } catch (err) {
      setLoading(false);
      notification.error({ message: "Something went wrong" });
    }
  };

  useEffect(() => {
    fetechProductData();
  }, [
    _.get(location, "state.currentCatid", ""),
    localStorage.getItem("search"),
    currentSubCategory,
  ]);

  const fetchCurrentUserCarts = async () => {
    try {
      setLoading(true);
      let orderStatus = getOrderReferance();
      let current_carts = await getCurrentUserCarts(orderStatus);
      let cardsref = "";
      if (_.get(location, "pathname", "") === "/dining-cusines") {
        cardsref = _.get(current_carts, "data.data", [])
          .filter((res) => {
            return (
              res.bookingRef === _.get(location, "state.table_details._id", "")
            );
          })
          .map((res) => {
            return res.productRef;
          });
      } else {
        cardsref = _.get(current_carts, "data.data", []).map((res) => {
          return res.productRef;
        });
      }
      setAllCartsData(_.get(current_carts, "data.data", []));
      setCurrentCartsData(cardsref);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      return notification.error({ message: "Something went wrong" });
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq")
    ) {
      fetchCurrentUserCarts();
    }
  }, []);

  const getOrderReferance = () => {
    let orderRef = "";
    let path = _.get(location, "pathname", "");
    if (path === "/take-away-cusiness") {
      orderRef = "takeaway_order";
    } else if (path === "/cusines") {
      orderRef = "online_order";
    } else if (path === "/dining-cusines") {
      orderRef = "dining_order";
    }
    return orderRef;
  };

  const handleNotLoginUsers = () => {
    if (
      localStorage.getItem("search") ||
      _.get(location, "state.currentCatid", "")
    ) {
      navigate("/login", {
        state: {
          currentCatid:
            localStorage.getItem("search") ||
            _.get(location, "state.currentCatid", ""),
          backLocation: currentLocation,
        },
      });
    }
  };

  const handleCartClick = async (product) => {
    if (
      localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq")
    ) {
      try {
        setLoading(true);
        let orderStatus = getOrderReferance();
        console.log(orderStatus);
        let formData = {
          productRef: _.get(product, "_id", ""),
          orderRef: orderStatus,
        };
        if (orderStatus === "dining_order") {
          formData.bookingRef = _.get(location, "state.table_details._id", "");
        }
        const result = await addToCart(formData);
        message.success(_.get(result, "data.message", ""));
        fetchCurrentUserCarts();
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        notification.error({ message: "Something went wrong" });
      }
    } else {
      handleNotLoginUsers();
    }
  };

  const handlegotocart = () => {
    if (
      localStorage.getItem("chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq")
    ) {
      let path = _.get(location, "pathname", "");
      if (path === "/take-away-cusiness") {
        navigate("/take-away-cart");
      } else if (path === "/cusines") {
        navigate("/online-order-cart");
      } else if (path === "/dining-cusines") {
        navigate("/dining-cart", {
          state: _.get(location, "state", ""),
        });
      }
    } else {
      handleNotLoginUsers();
    }
  };

  const getCardId = (id) => {
    return allCartsData?.filter((res) => {
      return res.productRef === id;
    });
  };

  const getQuantity = (id) => {
    try {
      let qty = getCardId(id);
      return _.get(qty, "[0].quantity", 0);
    } catch (err) {}
  };

  const handleIncrement = async (id) => {
    try {
      let _id = getCardId(id);
      await incrementCartQuantity(_.get(_id, "[0]._id", ""));
      message.success("quantity updated");
      fetchData();
      fetchCurrentUserCarts();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDecrement = async (id) => {
    try {
      let _id = getCardId(id);
      if (getQuantity(id) > 1) {
        await decrementCartQuantity(_.get(_id, "[0]._id", ""));
        message.success("quantity updated");
      } else {
        await removeSoloFromCart(_.get(_id, "[0]._id", ""));
        message.success("Food removed from cart");
      }
      fetchData();
      fetchCurrentUserCarts();
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    localStorage.setItem("search", e);
    setCurrentSubCategory("");
    setDummy(!dummy);
  };

  console.log(productData);

  return (
    <div className="w-screen lg:px-20 px-2  flex flex-col lg:gap-y-10 min-h-screen lg:pb-20 pb-5">
      <div className="flex flex-col lg:gap-y-14 gap-y-8">
        <div className="flex items-center justify-start gap-x-2 pt-11">
          <IoIosArrowBack
            onClick={() => {
              navigate(-1);
            }}
            className="lg:hidden block text-2xl"
          />
          <div>
            <h1 className="text-dark_color font-medium lg:text-xl ">
              {!_.isEmpty(_.get(location, "state.table_details", [])) &&
                `for Table ${_.get(
                  location,
                  "state.table_details.tableNo",
                  ""
                )}`}
            </h1>
          </div>

          {currentCartsData?.length > 0 ? (
            <div className="mr-4 lg:hidden fixed bottom-4  w-[96%] z-50 m-auto">
              <div
                onClick={handlegotocart}
                className="!bg-primary_color text-white lg:hidden lg:text-lg text-[10px]  cursor-pointer rounded-2xl lg:px-4 lg:py-2 font-bold md:w-[60%] w-[98%] m-auto center_div justify-between px-4 h-[40px]"
              >
                <div> {currentCartsData?.length} item added</div>
                <div className="center_div">
                  view cart <MdKeyboardArrowRight className="text-xl" />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <Skeleton
          active
          loading={loading}
          className="lg:w-[500px] lg:h-[100px]"
        >
          <div className="flex flex-col lg:gap-y-10 gap-y-8">
            <div className="flex gap-x-10 lg:items-center items-start justify-between lg:flex-row flex-col">
              <div className="grid ultraSm:flex  gap-4 justify-between w-full items-center">
                <div
                  loading={loading}
                  className="!text-[#3A3A3A] !font-semibold lg:!text-5xl flex gap-x-2 !capitalize mx-3  "
                >
                  <span className="line-clamp-1 overflow-hidden text-ellipsis py-2 text-[12px] lg:text-5xl font-extrabold ">
                    {_.get(filteredData, "[0].name", "")} Cusines
                  </span>
                </div>
                <div className="pt-1 lg:w-[20vw] overflow-hidden">
                  <Select
                    showSearch
                    placeholder="Other cusines"
                    optionFilterProp="children"
                    className=" !w-full !border-[#494949] focus:!border-[#494949] hover:!border-[#494949] ultraSm:w-[180px] cursor-pointer"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
                    {allCusinesCategory.map((res, index) => {
                      return (
                        <Select.Option key={index} value={res._id}>
                          {res.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </div>
              </div>

              <div className="mr-4 lg:block hidden ">
                <Badge
                  size="small"
                  offset={[-14, 5]}
                  color="#DF9300"
                  count={`${currentCartsData?.length}`}
                >
                  <Tag
                    onClick={handlegotocart}
                    className="!bg-black text-white  cursor-pointer rounded-md px-4 py-2 font-bold"
                    color="yellow"
                  >
                    go to cart
                  </Tag>
                </Badge>
              </div>
            </div>
            <div className="px-3 relative">
              <IoSearch className="absolute top-5 left-7 text-2xl text-gray-500" />
              <input
                type="text"
                placeholder="Search your food"
                className="input input-bordered ultraSm:w-full lg:w-1/2 h-[60px] rounded-2xl outline-none border px-12"
              />
            </div>

            <div>
              <div className="center_div justify-start lg:gap-x-6 gap-x-4 flex-nowrap overflow-scroll">
                {subCategory.map((res, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setCurrentSubCategory(
                          currentSubCategory === res._id ? "" : res._id
                        );
                      }}
                      className={`${
                        res._id === currentSubCategory
                          ? "bg-[#000000] text-white"
                          : "bg-[#EFEFEF] text-[#4D4D4D]"
                      } min-w-fit lg:px-3 lg:py-2 py-1 px-2 rounded-2xl center_div lg:min-w-[150px] flex text-sm lg:text-lg cursor-pointer`}
                    >
                      {res.name}
                    </div>
                  );
                })}
              </div>
              <Divider className="!bg-[#B8B8B8]" />
            </div>
          </div>
        </Skeleton>
      </div>
      {/* foods */}
      {/* ====================== */}
      <div className="flex flex-col lg:gap-y-24 gap-y-4">
        {productData.map((res, index) => {
          return (
            <Skeleton
              key={index}
              loading={loading}
              active
              className="w-[500px] h-[200px] "
            >
              <div className="flex w-full items-center justify-between gap-y-10 flex-row shadow-none  rounded-lg px-0 py-0">
                {!res?.status ? (
                  <div className="center_div justify-between lg:justify-start xl:justify-start 2xl:justify-start lg:gap-x-4 flex-row items-center w-full ">
                    {/* image */}
                    <div className="ultraSm:w-1/3 relative">
                      <img
                        src={res.image}
                        alt=""
                        className="ultraSm:w-36 md:w-40 md:h-36 lg:w-72 ultraSm:h-28 lg:h-44 rounded-lg object-cover blur-sm"
                      />
                      <h1 className="absolute inset-0 lg:left-24 items-center flex px-3 text-red-700 font-bold">
                        unavailable
                      </h1>
                    </div>
                    {/* price details */}
                    <div className="flex flex-col gap-y-1 px-2 ultraSm:w-1/3">
                      <h1 className="text-[#3A3A3A] text-lg ultraSm:text-sm lg:text-3xl font-extrabold">
                        {res.name} hhh
                      </h1>
                      <div className="flex items-center gap-2">
                        <div className="text-[#999999] relative ultraSm:hidden lg:block">
                          &#8377; {res.price}
                          <img
                            src="/assets/icons/linecross.png"
                            alt=""
                            className="absolute top-1"
                          />
                        </div>
                        <Tag
                          color="green"
                          className="flex items-center bg-primary_color text-white rounded-md border-none"
                        >
                          <CiDiscount1 className="text-white text-sm font-bold" />
                          {res.offer}% Discount
                        </Tag>
                      </div>
                      <div className="text-[#262525] ultraSm:text-sm  lg:text-xl flex items-center gap-x-2 ">
                        Prize{" "}
                        <div className="text-[#292929] font-bold ">
                          &#8377; {res.discountPrice}
                        </div>
                      </div>
                    </div>

                    {/* cart button */}
                    <div className="lg:hidden block px-3 ultraSm:w-1/3 ">
                      {currentCartsData.includes(res._id) ? (
                        <div
                          className={` text-white bg-gray-300  font-medium center_div rounded-2xl   min-w-[100px] cursor-pointer flex justify-between items-center `}
                        >
                          <div
                            onClick={() => {
                              handleDecrement(res._id);
                            }}
                            className="w-[30%] hover:bg-primary_color py-2  rounded-l-2xl center_div text-black"
                          >
                            -
                          </div>
                          <div className=" font-bold text-black">
                            {getQuantity(res._id)}
                          </div>
                          <div
                            onClick={() => {
                              handleIncrement(res._id);
                            }}
                            className="w-[30%] hover:bg-primary_color py-2 rounded-r-2xl center_div text-black"
                          >
                            +
                          </div>
                        </div>
                      ) : (
                        <div className=" bg-black text-white  hover:bg-primary_color  font-medium center_div rounded-2xl px-2 py-3 text-sm cursor-not-allowed">
                          Add
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="center_div justify-between lg:justify-start xl:justify-start 2xl:justify-start lg:gap-x-4 flex-row items-center w-full">
                    {/* image */}
                    {!res?.status ? (
                      <div className="ultraSm:w-1/3 relative">
                        <img
                          src={res.image}
                          alt=""
                          className="ultraSm:w-36 md:w-40 md:h-36 lg:w-72 ultraSm:h-28 lg:h-44 rounded-lg object-cover blur-sm"
                        />
                        <h1 className="absolute inset-0 lg:left-24 items-center flex px-3 text-red-700 font-bold">
                          unavailable
                        </h1>
                      </div>
                    ) : (
                      <div className="ultraSm:w-1/3 ">
                        <img
                          src={res.image}
                          alt=""
                          className="ultraSm:w-36 md:w-40 md:h-36 lg:w-72 ultraSm:h-28 lg:h-44 rounded-lg object-cover "
                        />
                      </div>
                    )}
                    {/* price details */}
                    <div className="flex flex-col gap-y-1 px-2 ultraSm:w-1/3">
                      <h1 className="text-[#3A3A3A] text-lg ultraSm:text-sm lg:text-3xl font-extrabold">
                        {res.name}
                      </h1>
                      <div className="flex items-center gap-2">
                        <div className="text-[#999999] relative ultraSm:hidden lg:block">
                          &#8377; {res.price}
                          <img
                            src="/assets/icons/linecross.png"
                            alt=""
                            className="absolute top-1"
                          />
                        </div>
                        <Tag
                          color="green"
                          className="flex items-center bg-primary_color text-white rounded-md border-none"
                        >
                          <CiDiscount1 className="text-white text-sm font-bold" />
                          {res.offer}% Discount
                        </Tag>
                      </div>
                      <div className="text-[#262525] ultraSm:text-sm  lg:text-xl flex items-center gap-x-2 ">
                        Prize{" "}
                        <div className="text-[#292929] font-bold ">
                          &#8377; {res.discountPrice}
                        </div>
                      </div>
                    </div>

                    {/* cart button */}
                    <div className="lg:hidden block px-3 ultraSm:w-1/3 ">
                      {currentCartsData.includes(res._id) ? (
                        <div
                          className={` text-white bg-gray-300  font-medium center_div rounded-2xl   min-w-[100px] cursor-pointer flex justify-between items-center `}
                        >
                          <div
                            onClick={() => {
                              handleDecrement(res._id);
                            }}
                            className="w-[30%] hover:bg-primary_color py-2  rounded-l-2xl center_div text-black"
                          >
                            -
                          </div>
                          <div className=" font-bold text-black">
                            {getQuantity(res._id)}
                          </div>
                          <div
                            onClick={() => {
                              handleIncrement(res._id);
                            }}
                            className="w-[30%] hover:bg-primary_color py-2 rounded-r-2xl center_div text-black"
                          >
                            +
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            document
                              .getElementById("customization")
                              .showModal();
                            setCustomizeProduct(res);
                          }}
                          className={`${
                            !res?.status
                              ? " bg-black text-white  hover:bg-primary_color  font-medium center_div rounded-2xl px-2 py-3 text-sm cursor-not-allowed"
                              : " bg-black text-white  hover:bg-primary_color  font-medium center_div rounded-2xl px-2 py-3 cursor-pointer text-sm"
                          }`}
                        >
                          Add
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* cart button */}
                {!res?.status ? (
                  <div className="!px-4 py-4 hidden lg:block">
                    {currentCartsData.includes(res._id) ? (
                      <div
                        className={` text-white bg-black font-medium center_div rounded-2xl   min-w-[200px] cursor-pointer flex justify-between items-center `}
                      >
                        <div
                          onClick={() => {
                            handleDecrement(res._id);
                          }}
                          className="w-[30%] hover:bg-primary_color py-2  rounded-l-2xl center_div"
                        >
                          -
                        </div>
                        <div className=" font-bold">{getQuantity(res._id)}</div>
                        <div
                          onClick={() => {
                            handleIncrement(res._id);
                          }}
                          className="w-[30%] hover:bg-primary_color py-2 rounded-r-2xl center_div"
                        >
                          +
                        </div>
                      </div>
                    ) : (
                      <div
                        // onClick={() => {
                        //   document.getElementById("customization").showModal();
                        //   setCustomizeProduct(res);
                        // }}
                        className="bg-[#000000] text-white  font-medium center_div lg:text-xl rounded-2xl px-3 py-4 min-w-[200px] cursor-not-allowed"
                      >
                        Add to cart
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="!px-4 py-4 hidden lg:block">
                    {currentCartsData.includes(res._id) ? (
                      <div
                        className={` text-white bg-black    font-medium center_div rounded-2xl   min-w-[200px] cursor-pointer flex justify-between items-center `}
                      >
                        <div
                          onClick={() => {
                            handleDecrement(res._id);
                          }}
                          className="w-[30%] hover:bg-primary_color py-2  rounded-l-2xl center_div"
                        >
                          -
                        </div>
                        <div className=" font-bold">{getQuantity(res._id)}</div>
                        <div
                          onClick={() => {
                            handleIncrement(res._id);
                          }}
                          className="w-[30%] hover:bg-primary_color py-2 rounded-r-2xl center_div"
                        >
                          +
                        </div>
                      </div>
                    ) : (
                      <div
                        // onClick={() => {
                        //   handleCartClick(res);
                        // }}
                        onClick={() => {
                          document.getElementById("customization").showModal();
                          setCustomizeProduct(res);
                        }}
                        className="bg-[#000000] text-white hover:bg-primary_color font-medium center_div lg:text-xl rounded-2xl px-3 py-4 min-w-[200px] cursor-pointer"
                      >
                        Add to cart
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Skeleton>
          );
        })}
      </div>
      <Customization id={"customization"} product_data={customizeProduct} />
    </div>
  );
};

export default Cusinedetails;
