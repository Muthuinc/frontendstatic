import React from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { Tag, message, notification } from "antd";
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

const Customization = ({ product_data, id }) => {
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
  const [type, setType] = useState("");

  const handleTypeChange = (selectedType, selectedPrice) => {
    setPrice(selectedPrice);
  };

  // ============
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const initialPrice = product_data?.discountPrice;

  useEffect(() => {
    setPrice(initialPrice * quantity);
  }, [initialPrice, quantity]);

  const HandleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const HandleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  // ==============

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

  return (
    <>
      <dialog id={id} className="modal">
        <div className="modal-box w-11/12">
          <div className="modal-action flex flex-col ">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-xl"
                onClick={() => {
                  window.location.reload();
                }}
              >
                ✕
              </button>

              <div className="card w-full border-none shadow-none ">
                <img
                  src={product_data?.image}
                  alt="Shoes"
                  className="rounded-xl h-[300px] object-cover w-full"
                />
                <div className="flex mt-5 justify-between px-3 items-center border-b-2 border-black/25 py-5 relative ">
                  <Tag
                    color="green"
                    className="flex items-center bg-primary_color text-white rounded-md border-none absolute left-2 top-1"
                  >
                    <CiDiscount1 className="text-white text-sm font-bold" />
                    {product_data?.offer}% Discount
                  </Tag>
                  <div>
                    <h1 className="text-xl text-start">{product_data?.name}</h1>
                  </div>
                  <h1 className="absolute right-10 top-0 text-lg">Prize</h1>
                  <div className="flex items-center px-2 py-2">
                    <MdCurrencyRupee className="text-[25px]" />
                    <h1 className="text-[25px] font-extrabold">{`${price}.00`}</h1>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-gray-500 font-sans">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Atque a quisquam doloremque dignissimos consequuntur.{" "}
                  </p>
                </div>

                {/* ====================================== */}
                <div className="mt-4">
                  {product_data?.types.map((data) => {
                    return (
                      <div className="form-control" key={data._id}>
                        {!data?.type ? null : (
                          <label className="label cursor-pointer relative ">
                            <input
                              type="radio"
                              name="radio-10"
                              className="radio checked:bg-gray-500"
                              onChange={() =>
                                handleTypeChange(data?.type, data?.price)
                              }
                            />
                            <span className="absolute left-12">
                              {data?.type}
                            </span>
                            <span className="absolute right-5">
                              ₹ {data?.price}.00
                            </span>
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* ====================================== */}
              </div>
            </form>

            <div className="mt-5">
              <div className="flex gap-3">
                {currentCartsData.includes(product_data?._id) ? (
                  <div
                    className={` text-white bg-gray-300  font-medium center_div rounded-2xl w-1/2 cursor-pointer flex justify-between items-center `}
                  >
                    <div
                      onClick={() => {
                        handleDecrement(product_data?._id);
                        HandleDecrement();
                      }}
                      className="w-[30%] hover:bg-primary_color py-2  rounded-l-2xl center_div text-black"
                    >
                      -
                    </div>
                    <div className=" font-bold text-black">
                      {getQuantity(product_data?._id)}
                    </div>
                    <div
                      onClick={() => {
                        handleIncrement(product_data?._id);
                        HandleIncrement();
                      }}
                      className="w-[30%] hover:bg-primary_color py-2 rounded-r-2xl center_div text-black"
                    >
                      +
                    </div>
                  </div>
                ) : (
                  <div
                    className={` text-white  font-medium center_div rounded-2xl w-1/2 flex justify-between items-center `}
                  >
                    <div
                      onClick={() => {
                        handleDecrement(product_data?._id);
                      }}
                      className="w-[30%]  py-2  rounded-l-2xl center_div text-black"
                    ></div>
                    <div className=" font-bold text-black"></div>
                    <div
                      onClick={() => {
                        handleIncrement(product_data?._id);
                      }}
                      className="w-[30%]  py-2 rounded-r-2xl center_div text-black"
                    ></div>
                  </div>
                )}

                {currentCartsData.includes(product_data?._id) ? (
                  <button
                    className="btn w-1/2 h-16 hover:bg-black bg-black/90 text-lg text-white"
                    onClick={handlegotocart}
                  >
                    Go to cart
                  </button>
                ) : (
                  <button
                    className="btn w-1/2 h-16 hover:bg-black bg-black/90 text-lg text-white"
                    onClick={() => {
                      handleCartClick(product_data);
                    }}
                  >
                    Add to cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Customization;
