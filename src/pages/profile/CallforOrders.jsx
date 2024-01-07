import {
  Avatar,
  Badge,
  Card,
  Divider,
  Drawer,
  Skeleton,
  Tooltip,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import {
  getMyCallForOrder,

} from "../../helper/api/apiHelper";
import _ from "lodash";
import moment from "moment";
import EmptyScreen from "../../components/EmptyScreen";
import ProfileHeading from "../../components/ProfileHeading";
import BoxLoadingScreen from "../../components/BoxLoadingScreen";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import { MdDeliveryDining } from "react-icons/md";

const CallforOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSelected, setCurrentSelected] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getMyCallForOrder();
      setOrders(_.get(result, "data.data", []));
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getStatus = (data) => {
    switch (data.status) {
      case "Cancelled":
        return (
          <div className="text-red-500 font-bold  lg:text-[15px] text-[12px]">
            Order Cancelled
          </div>
        );
      case "Delivered":
        return (
          <div className="flex justify-evenly">
            <div
              className="text-dark_color font-bold  lg:text-[15px] text-[12px]"
              onClick={() => {
                setCurrentSelected(data);
              }}
            >
              View Menu
            </div>
            <Divider type="vertical" />
            <div className="text-green-500 font-bold  lg:text-[15px] text-[12px]">
              Order Delivered
            </div>
          </div>
        );
      case "Order moved to KDS":
        return (
          <div className="flex justify-evenly">
            <div
              className="text-dark_color  font-bold  lg:text-[15px] text-[12px]"
              onClick={() => {
                setCurrentSelected(data);
              }}
            >
              View Menu
            </div>
            <Divider type="vertical" />
            <div className="text-green-400 font-bold  lg:text-[15px] text-[12px]">
              Order moved to Kitchen
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="profile_head">
        <div className="w-full">
          <ProfileHeading message={" Your Call For Orders"} />
        </div>
        {loading ? (
          <BoxLoadingScreen loading={loading} />
        ) : _.isEmpty(orders) ? (
          <div className="center_div lg:w-[80vw] w-full lg:px-2 min-h-[50vh] items-center ">
            <EmptyScreen
              message={
                <div>
                  You currently have no call for orders
                  <br /> add a new one by clicking this link.{" "}
                </div>
              }
              links={"/call-for-order"}
            />
          </div>
        ) : (
          <div className="profile_cards_grid">
            {orders.map((res, index) => {

              return (
                <div className=" !w-[98%] m-auto" key={index}>
                  <Badge.Ribbon
                    className=" w-fit"
                    placement="start"
                    color="#DF9300"
                    text={` ₹ ${_.get(res, "billAmount", "")}`}
                    key={index}
                  >
                    <Card
                      hoverable
                      key={index}
                      className="lg:w-[350px] xl:!w-[320px]  relative min-h-[100px] shadow-lg bg-white !pt-4 !cursor-default"
                      actions={[
                        [
                          "Cancelled",
                          "Delivered",
                          "Order moved to KDS",
                        ].includes(res.status) ? (
                          getStatus(res)
                        ) : (
                          <div className="flex justify-evenly">
                            <div
                              className="text-dark_color  font-bold  lg:text-[15px] text-[12px]"
                              onClick={() => {
                                setCurrentSelected(res);
                              }}
                            >
                              View Menu
                            </div>
                            <Divider type="vertical" />
                            <div className="text-green-400 !font-bold lg:text-[15px] text-[12px]">
                              {_.get(res, "status", "")}
                            </div>
                          </div>
                        ),
                      ]}
                    >
                      <Skeleton loading={loading}>
                        <Card.Meta
                          avatar={
                            <Avatar
                              src={_.get(res, "orderedFood[0].img", "")}
                              className="!w-[50px] !h-[50px] !rounded-lg !shadow-inner"
                            />
                          }
                          title={
                            <p className="text-ellipsis overflow-hidden">
                              {_.get(res, "orderedFood[0].food", "")}
                            </p>
                          }
                          description={
                            <div className="text-[12px]">
                              {moment(res.createdAt).format("llll")}
                            </div>
                          }
                        />
                      </Skeleton>
                      <div className="!text-dark3a_color !text-lg !absolute right-2 top-2">
                        {res.deliveryStatus === "Take away" ?
                          <Tooltip placement="left" title={<p className="!text-[10px]" >Take Away</p>}><FaPersonWalkingLuggage />
                          </Tooltip> :
                          <Tooltip placement="left" title={<p className="!text-[10px]" >Door Delivery</p>}>
                            <MdDeliveryDining />
                          </Tooltip>
                        }
                      </div>
                    </Card>
                  </Badge.Ribbon>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Drawer
        title={
          <div className="flex text-sm lg:text-lg">{`OrderId ${_.get(
            currentSelected,
            "orderId",
            ""
          )}`}</div>
        }
        open={!_.isEmpty(currentSelected)}
        onClose={() => {
          setCurrentSelected([]);
        }}
        placement="left"
      >
        <div className="px-2 text-black">
          <div className="rounded-lg  relative ">
            <p className="text-dark3a_color text-lg font-bold">Order Summary</p>
            <br />
            <div className="bg-[#F2F2F2] px-4 py-4 flex flex-col gap-y-5">
              <div className="flex items-center justify-between border-b-2">
                <p>Total Items</p>{" "}
                {_.get(currentSelected, "orderedFood", []).length}
              </div>
              <div className="flex items-center justify-between border-b-2">
                <p>Items Price</p> &#8377;{" "}
                {_.get(currentSelected, "item_price", "")}
              </div>
              <div className="flex items-center justify-between border-b-2">
                <p>Total GST</p> &#8377; {_.get(currentSelected, "gst", "")}
              </div>
              <div className="flex items-center justify-between border-b-2">
                <p>Packing Charage</p> &#8377;{" "}
                {_.get(currentSelected, "packingCharge", "")}
              </div>
              {_.get(currentSelected, "deliveryCharge", "") &&
                <div className="flex items-center justify-between border-b-2">
                  <p>Delivery Charage</p> &#8377;{" "}
                  {_.get(currentSelected, "deliveryCharge", "")}
                </div>}
              <div className="flex items-center justify-between border-b-2">
                <p>Transaction Charage</p> &#8377;{" "}
                {_.get(currentSelected, "transactionCharge", "")}
              </div>
              <div className="flex items-center justify-end gap-x-2">
                <p>Total :</p> &#8377;{" "}
                {_.get(currentSelected, "billAmount", "")}
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="flex flex-col gap-y-2 px-2">
          <p className="text-dark3a_color text-lg font-bold">Menus</p>
          {_.get(currentSelected, "orderedFood", []).map((res, index) => {
            return (
              <Card loading={loading} key={index}>
                <Card.Meta
                  avatar={
                    <Avatar
                      src={_.get(res, "img", "")}
                      className="!w-[80px] !h-[80px] !rounded-lg"
                    />
                  }
                  title={
                    <div className="capitalize">{_.get(res, "food", "")}</div>
                  }
                />
              </Card>
            );
          })}
        </div>
      </Drawer>
    </>
  );
};

export default CallforOrders;
