import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import {
  Button,
  Divider,
  Drawer,
  Empty,
  Modal,
  Radio,
  message,
  notification,
} from "antd";
import AddNewAddress from "./AddNewAddress";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addOnlineOrder,
  decrementCartQuantity,
  getCurrentUserCartProducts,
  getDeliveryAddress,
  incrementCartQuantity,
  removeSoloFromCart,
} from "../../helper/api/apiHelper";
import _ from "lodash";
import LoadingScreen from "../../components/LoadingScreen";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { GoArrowLeft } from "react-icons/go";
import { useParams } from "react-router-dom";
import { CiCreditCard1 } from "react-icons/ci";
import { TbTruckDelivery } from "react-icons/tb";
import { LuMonitorSmartphone } from "react-icons/lu";

const CheckoutPage = () => {
  const [changeRight, setChangeRight] = useState(false);
  const location = useLocation();
  const [allDeliveryAddress, setAllDeliveryAddress] = useState([]);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
  // const [dummy, setDummy] = useState(false);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchData = async () => {
    try {
      let order_ref = "online_order";
      setLoading(true);
      let formdatas = {
        order_ref: order_ref,
        bookingref: _.get(location, "state.table_details._id", ""),
      };
      const result = await getCurrentUserCartProducts(
        JSON.stringify(formdatas)
      );
      if (_.isEmpty(_.get(result, "data.data", []))) {
        navigate(-1);
      }
      setCartData(_.get(result, "data.data", []));
      const address = await getDeliveryAddress();
      setAllDeliveryAddress(_.get(address, "data.data", []));
      setSelectedDeliveryAddress(_.get(address, "data.data[0]", []));
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      return notification.error({ message: "Something went wrong" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSingleItemTotalPrice = (id) => {
    try {
      let filters = cartData.filter((res) => {
        return id === res._id;
      });

      return (
        _.get(filters, "[0].productRef.discountPrice", 0) *
        _.get(filters, "[0].quantity", 0)
      );
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setLoadingPlaceOrder(true);

      let food_data = cartData.map((res) => {
        return {
          pic: _.get(res, "productRef.image", ""),
          foodName: _.get(res, "productRef.name", ""),
          foodPrice: _.get(res, "productRef.price", ""),
          originalPrice: _.get(res, "productRef.discountPrice", ""),
          foodQuantity: _.get(res, "quantity", ""),
        };
      });

      let formData = {
        customerName: _.get(selectedDeliveryAddress, "name", ""),
        mobileNumber: _.get(selectedDeliveryAddress, "mobileNumber", ""),
        billAmount: _.get(getTotalAmount(), "Total_amount", 0),
        gst: _.get(getTotalAmount(), "gstPrice", 0),
        delivery_charge: _.get(getTotalAmount(), "deliverCharagePrice", 0),
        packing_charge: _.get(getTotalAmount(), "packingPrice", 0),
        transaction_charge: _.get(getTotalAmount(), "transactionPrice", 0),
        coupon_amount: _.get(getTotalAmount(), "couponDiscount", 0),
        item_price: _.get(getTotalAmount(), "itemPrice", 0),
        orderedFood: food_data,
        location: selectedDeliveryAddress,
        orderId:
          "BIPL031023" +
          uuidv4()?.slice(0, 4)?.toUpperCase() +
          moment(new Date()).format("DMy"),
      };
      await addOnlineOrder(formData);
      notification.success({
        message: "Your order has been successfully placed.",
      });
      navigate("/profile-online-order");
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    } finally {
      setLoadingPlaceOrder(false);
    }
  };

  const handleIncement = async (id) => {
    try {
      await incrementCartQuantity(id);
      message.success("quantity updated");
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };
  const handleClickDecrement = async (id, count) => {
    try {
      if (count > 1) {
        await decrementCartQuantity(id);
        message.success("quantity updated");
      } else {
        await removeSoloFromCart(id);
        message.success("Food removed from cart");
      }
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalAmount = () => {
    let itemPrice = _.sum(
      cartData.map((res) => {
        return (
          Number(_.get(res, "productRef.discountPrice", "")) * res.quantity
        );
      })
    );

    let itemdiscountPrice = _.sum(
      cartData.map((res) => {
        return Number(_.get(res, "productRef.price", "")) * res.quantity;
      })
    );

    let total_qty = _.sum(
      cartData.map((res) => {
        return res.quantity;
      })
    );

    let gstPrice = (itemPrice * 5) / 100;
    let deliverCharagePrice = 50;
    let packingPrice = (itemPrice * 10) / 100;
    let transactionPrice = (itemPrice * 5) / 100;
    let couponDiscount = 0;

    let total_amount =
      itemPrice +
      gstPrice +
      deliverCharagePrice +
      packingPrice +
      transactionPrice -
      couponDiscount;

    let total_for_dining = itemPrice + gstPrice;
    let total_dc_price =
      _.get(location, "pathname", "") !== "/dining-cart"
        ? total_for_dining - itemPrice + itemdiscountPrice
        : total_amount - itemPrice + itemdiscountPrice;

    return {
      total_amount: total_amount,
      itemPrice: itemPrice,
      gstPrice: gstPrice,
      deliverCharagePrice: deliverCharagePrice,
      packingPrice: packingPrice,
      transactionPrice: transactionPrice,
      couponDiscount: couponDiscount,
      Total_amount: total_amount.toFixed(2),
      total_for_dining: total_for_dining,
      total_qty: total_qty,
      itemdiscountPrice: total_dc_price,
    };
  };
  const handleGoBack = () => {
    try {
      window.scrollTo(0, 0);
      navigate(-1);
    } catch (err) {}
  };

  return (
    <>
      <div>
        <div className="lg:pt-14 pt-10">
          <div className="flex items-center gap-x-2">
            <IoIosArrowBack
              onClick={() => {
                navigate("/delivery-address");
              }}
              className="!cursor-pointer text-2xl"
            />
            <div>
              <div className="font-bold lg:text-5xl  text-[#3A3A3A] tracking-wider">
                Your food cart
              </div>
            </div>
          </div>
        </div>

        <div className="carousel w-full mt-5">
          <div id="slide1" className="carousel-item relative w-full">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdN4DcE2kds5phJz7DFQv896GkX7lExUJmDA&usqp=CAU"
              className="w-full"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 bg-white/30 h-32 items-center rounded-2xl backdrop-blur-lg border ">
              <a
                href="#slide4"
                className="btn btn-circle bg-transparent border-none shadow-none text-white"
              >
                ❮
              </a>
              <div className="flex justify-center items-center gap-4">
                <img
                  src="/assets/icons/Logo.jpeg"
                  className="w-16 h-16 rounded-2xl object-cover"
                  alt=""
                />
                <div className="flex flex-col">
                  <h1 className="text-white text-2xl font-extrabold">
                    FLAT 50% OFF
                  </h1>
                  <p className="text-white text-sm text-start">
                    Click and claim your offer
                  </p>
                </div>
              </div>
              <a
                href="#slide2"
                className="btn btn-circle bg-transparent border-none shadow-none text-white"
              >
                ❯
              </a>
            </div>
          </div>
          <div id="slide2" className="carousel-item relative w-full">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdN4DcE2kds5phJz7DFQv896GkX7lExUJmDA&usqp=CAU"
              className="w-full"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 bg-white/30 h-32 items-center rounded-2xl backdrop-blur-lg border ">
              <a
                href="#slide1"
                className="btn btn-circle bg-transparent border-none shadow-none text-white"
              >
                ❮
              </a>
              <div className="flex justify-center items-center gap-4">
                <img
                  src="/assets/icons/Logo.jpeg"
                  className="w-16 h-16 rounded-2xl object-cover"
                  alt=""
                />
                <div className="flex flex-col">
                  <h1 className="text-white text-2xl font-extrabold">
                    FLAT 20% OFF
                  </h1>
                  <p className="text-white text-sm text-start">
                    Click and claim your offer
                  </p>
                </div>
              </div>
              <a
                href="#slide3"
                className="btn btn-circle bg-transparent border-none shadow-none text-white"
              >
                ❯
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-4  mt-4 p-5 ">
          <div className="py-6 px-6 w-full bg-white h-20 rounded-xl flex justify-between items-center border">
            <CiCreditCard1 />
            <span className="text-center font-sans text-sm">
              Credit / Debit cards
            </span>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                className="radio  ml-2"
              />
            </label>
          </div>
          <div className="py-6 px-6 w-full bg-white h-20 rounded-xl flex justify-between items-center border">
            <LuMonitorSmartphone />
            <span className="text-center font-sans text-sm">UPI Payment</span>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                className="radio  ml-2"
              />
            </label>
          </div>
          <div className="py-6 px-6 w-full bg-white h-20 rounded-xl flex justify-between items-center border">
            <TbTruckDelivery />
            <span className="text-center font-sans text-sm">
              Cash on delivery
            </span>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                className="radio  ml-2"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-y-4 mt-4 p-5 ">
          <div
            // onClick={() => setOpenModal(true)}
            // onClick={() => navigate("/online-order-checkout")}
            className="lg:w-[450px] h-[80px] center_div bg-black  cursor-pointer  rounded-2xl text-[#ffffff] lg:text-xl font-semibold"
            onClick={handlePlaceOrder}
          >
            Proceed & Continue to pay
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
