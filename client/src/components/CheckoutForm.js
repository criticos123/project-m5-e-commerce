import React, { createRef, useContext } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { orderAddedItem, orderAddItem, cartReset } from "../actions";

import { AuthContext } from "./AuthContext";

const CheckoutForm = ({ total }) => {
  const dispatch = useDispatch();

  const cartData = useSelector((state) => state.cart.cart);
  const history = useHistory();

  const { appUser } = useContext(AuthContext);

  const nameInput = createRef();
  const addressInput = createRef();
  const postalCodeInput = createRef();
  const provinceInput = createRef();

  const cityInput = createRef();
  const billingProvinceInput = createRef();
  const billingNameInput = createRef();
  const billingAddressInput = createRef();
  const billingPostalCodeInput = createRef();
  const villeInput = createRef();

  const cardNumberInput = createRef();
  const expiryInput = createRef();

  const cvcInput = createRef();

  let checkoutData = cartData.map((item) => {
    return { productId: item.id, quantity: item.quantity, itemDetails: item };
  });

  let userInfo = () => {
    const { email } = appUser;
    const orderDate = new Date();

    return {
      personalInfo: {
        email: email,
        name: nameInput.current.value,
        address: addressInput.current.value,
        postalcode: postalCodeInput.current.value,
        city: cityInput.current.value,
        province: provinceInput.current.value,
      },
      shippingDetails: {
        name: billingNameInput.current.value,
        address: billingAddressInput.current.value,
        postalcode: billingPostalCodeInput.current.value,
        city: villeInput.current.value,
        province: billingProvinceInput.current.value,
      },
      paymentInfo: {
        cardNumber: cardNumberInput.current.value,
        expiry: expiryInput.current.value,
        cvc: cvcInput.current.value,
      },
      orderDetails: {
        itemsPurchased: checkoutData,
        amountPaid: total,
        datePurchased: orderDate,
      }
    };
  };

  let handleCheckOut = (event) => {
    event.preventDefault();

    fetch("/purchase", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        purchasedItems: checkoutData,
        user: userInfo(),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === 401) {
          window.alert(data.message);
        } else {
          dispatch(cartReset());
          dispatch(
            orderAddedItem({
              itemsPurchased: data.purchasedItems,
              orderNo: data.orderNo,
            })
          );

          history.push("/confirmation");
        }
      })
      .catch((error) => console.log("this", error));
  };
  return (
    <Wrapper>
      <form onSubmit={handleCheckOut}>
        <OrderInfo>
          <ShippingInfo>
            <SectionHeader>Shipping Information:</SectionHeader>
            <div>
              <input
                type="text"
                id="fullname"
                placeholder="Name"
                ref={nameInput}
                required
              ></input>
            </div>
            <div>
              <input
                type="address"
                id="address"
                placeholder="Address"
                ref={addressInput}
                required
              ></input>

              <input
                type="text"
                id="city"
                placeholder="City"
                ref={cityInput}
                required
              ></input>
            </div>
            <div>
              <input
                type="text"
                id="PostCode"
                placeholder="Province"
                ref={provinceInput}
                required
              ></input>

              <input
                type="text"
                id="PostCode"
                placeholder="Postal Code"
                ref={postalCodeInput}
                required
              ></input>
            </div>
          </ShippingInfo>
          <BillingInfo>
            {" "}
            <SectionHeader>Billing Information:</SectionHeader>
            <div>
              <input
                type="text"
                id="fullname"
                placeholder="Name"
                ref={billingNameInput}
                required
              ></input>
            </div>
            <div>
              <input
                type="address"
                id="address"
                placeholder="Address"
                ref={billingAddressInput}
                required
              ></input>

              <input
                type="text"
                id="city"
                placeholder="ville"
                ref={villeInput}
                required
              ></input>
            </div>
            <div>
              <input
                type="text"
                id="PostCode"
                placeholder="Province"
                ref={billingProvinceInput}
                required
              ></input>

              <input
                type="text"
                id="PostCode"
                placeholder="Postal Code"
                ref={billingPostalCodeInput}
                required
              ></input>
            </div>
          </BillingInfo>
        </OrderInfo>
        <CreditCardinfo>
          <div>
            {" "}
            <label id="card number"> Credit Card: </label>
            <input
              type="text"
              id="number"
              placeholder="Credit Card Number"
              ref={cardNumberInput}
              required
            ></input>{" "}
          </div>
          <div>
            <label id="card expiry"> Expiration: </label>
            <input
              type="text"
              id="expiry"
              placeholder="mm/yy"
              ref={expiryInput}
              required
            ></input>{" "}
          </div>
          <div>
            <label id="CVC #"> CVC: </label>
            <input
              type="text"
              id="CVC"
              placeholder="123"
              ref={cvcInput}
              required
            ></input>{" "}
          </div>
        </CreditCardinfo>

        <Button type="submit">Submit</Button>
      </form>
    </Wrapper>
  );
};
const BillingInfo = styled.div`
  margin-left: 10px;
  input {
    width: 300px;
    padding: 12px;
    margin: 6px 0;
    border: 1px solid #eee;
    outline: none;
  }
`;
const ShippingInfo = styled.div`
  input {
    width: 300px;
    padding: 12px;
    margin: 6px 0;
    border: 1px solid #eee;
    outline: none;
  }
`;
const OrderInfo = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px;
`;

const SectionHeader = styled.div`
  margin-bottom: 4px;
  font-weight: bold;
`;

const CreditCardinfo = styled.div`
  border-top: 2px #eee solid;
  padding: 10px;
  margin: 0 6px;
  input {
    width: 300px;
    padding: 12px;
    margin: 6px 0;
    border: 1px solid #eee;
    outline: none;
  }
`;

const Wrapper = styled.div`
  border: 2px black solid;
  width: 700px;
`;

const Button = styled.button`
  display: inline-block;
  width: 110px;
  height: 36px;
  border-radius: 8px;
  margin: 8px 0 15px 430px;
  font-size: larger;
  font-weight: bold;

  border: 0.5px solid #5f6368;
  &:hover {
    cursor: pointer;
    background-color: #47d688;
  }
`;

export default CheckoutForm;
