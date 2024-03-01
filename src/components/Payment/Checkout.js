import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CheckIcon from "../../assets/check.svg";
import Visa from "../../assets/visa.svg";
import American from "../../assets/american-express.svg";
import MasterCard from "../../assets/mastercard.svg";
import CVV from "../../assets/CVV.svg";

const Checkout = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const amount = queryParams.get("amount");
  const [paymentMethods, setMethods] = useState([]);
  const card = useRef('')
  const plan = queryParams.get("plan") === "1" ? "Year" : "Month";
  const [formData, setFormData] = useState({
    card: "",
    expire: "",
    cvv: "",
    nameOnCard: "",
    userId: "65e073195bdcf11766875821",
  });
  const tilopay = useRef(null);
  useEffect(() => {
    exicuteScript();
  }, []);
  const exicuteScript = async () => {
    const tilopayObj = window.Tilopay;
    tilopay.current = tilopayObj;
    if (tilopayObj) {
fetch(`${process.env.REACT_APP_API_BASE_URL}/api/getTilopayToken`)
        .then((res) => res.json())
        .then(async (data) => {
      let initialize = await tilopayObj.Init({
        token: data.token,
        currency: "USD",
        language: "en",
        amount: amount,
        orderNumber: (Math.random() * 1000).toFixed(0),
        billToFirstName: "firstName",
        billToLastName: "lastName",
        billToAddress: "San Jose",
        billToAddress2: "sdfd",
        billToCity: "adf",
        billToState: "sfsfd",
        billToEmail: "namne@gmail.com",
        billToZipPostCode: "353545",
        billToCountry: "CR",
        billToTelephone: "42343242344",
        subscription: 1,
        capture: 0,
        redirect: "http://localhost:3000/checkout-result",
      });
      console.log(initialize);
      setMethods(initialize.methods);
});
    } else {
      console.error("Function not available");
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();

      const payment = await tilopay.current.startPayment();
      console.log(payment);
     };
  return (
    <MangePlanWrapper>
      <div>
        <h1>Checkout</h1>
        <ManagePlanMain>
          <MngePlanRight>
            <div className="flexible-plan-card">
              <h2>Flexible Plan</h2>
              <p>
                <sup>$</sup>
                {amount}
                <span>per {plan}</span>
              </p>
            </div>
            <div className="flexible-content">
              <ul>
                <li>
                  <img src={CheckIcon} alt="check-icon" />
                  Unlimited access to it all.
                </li>
                <li>
                  <img src={CheckIcon} alt="check-icon" />
                  VISphere ride every 3 months.
                </li>
                <li>
                  <img src={CheckIcon} alt="check-icon" />
                  480 thanks!coins to gift to artists.
                </li>
              </ul>
            </div>
                     </MngePlanRight>
        </ManagePlanMain>
      </div>
      <AddCardDetails>
        <h4>Credit or debit card</h4>
        <CardLogo>
          <img src={Visa} alt="icon" />
          <img src={MasterCard} alt="icon" />
          <img src={American} alt="icon" />
        </CardLogo>
        <PaymentDetails>
          <h2>Payment details</h2>

            <div className="payFormTilopay form-wrapper">
              <select name="tlpy_payment_method" id="tlpy_payment_method" style={{display: 'none'}}>
                {paymentMethods.map((method) => (
                    <option value={method.id} key={method.id}>{method.name}</option>
                ))}
                {/* <option value="">Select payment method</option> */}
              </select>

              <div className="form-group">
                <label className="label">Card number</label>
                <input
                  type="text"
                  id="tlpy_cc_number"
                  name="tlpy_cc_number"
                //   ref={card}
                  placeholder="1234 1234 1234 1234"
                  onChange={(event) => {
                    setFormData({ ...formData, card: event.target.value });
                  }}
                />
              </div>
              <div className="form-group">
                <label>Name on card</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={formData.nameOnCard}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      nameOnCard: event.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex-col">
                <div className="form-group">
                  <label>Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={formData.expire}
                    id="tlpy_cc_expiration_date"
                    name="tlpy_cc_expiration_date"
                    onChange={(event) => {
                      let newValue = event.target.value;

                      newValue = newValue.replace(/\D/g, "");

                      newValue = newValue.slice(0, 4);

                      if (newValue.length >= 2) {
                        newValue = `${newValue.slice(0, 2)}/${newValue.slice(2)}`;
                      }
                      setFormData({
                        ...formData,
                        expire: newValue,
                      });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    placeholder="cvv"
                    id="tlpy_cvv"
                    name="tlpy_cvv"
                    value={formData.cvv}
                    onChange={(event) => {
                      setFormData({ ...formData, cvv: event.target.value });
                    }}
                  />
                  <img src={CVV} alt="icon" />
                </div>
              </div>
            </div>
            <div id="responseTilopay"></div>
            <button to="" className="PlanCta" onClick={onSubmit} type="submit">
              Complete Purchase
            </button>
        </PaymentDetails>
      </AddCardDetails>
    </MangePlanWrapper>
  );
};

export default Checkout;
const MangePlanWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  text-align: center;
  > h1 {
    font-size: 42px;
    font-weight: 400;
    line-height: 44px;
  }
`;
const ManagePlanMain = styled.div`
  display: flex;
  flex-direction: row;
`;

const MngePlanRight = styled.div`
  width: 360px;
  box-sizing: border-box;
  .flexible-plan-card {
    position: relative;
    width: 100%;
    height: 275px;
    background: #a3c4a3;
    display: flex;
    align-items: center;
    justify-content: center;
    h2 {
      font-weight: 400;
      line-height: 42px;
      font-size: 30px;
      color: white;
      width: 105px;
      text-align: center;
    }
    p {
      position: absolute;
      bottom: 15px;
      left: 22px;
      color: white;
      font-size: 24px;
      font-weight: 500;
      sup {
        font-size: 14px;
        font-weight: 400;
      }
      span {
        font-size: 14px;
        font-weight: 400;
        color: white;
        display: block;
      }
    }
  }
  .flexible-content {
    padding: 20px 10px;
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      li {
        font-size: 16px;
        font-weight: 400;
        line-height: 32px;
        display: flex;
        align-items: center;
        img {
          margin-right: 10px;
        }
      }
    }
  }
  .PlanCta {
    font-size: 16px;
    font-weight: 700;
    color: white;
    padding: 0 10px;
  }
`;

const AddCardDetails = styled.div`
  padding: 17px 10px;
  width: 640px;
  margin: 20px;
  border: 1px solid rgb(217, 217, 217);
  border-radius: 12px;
  @media (max-width: 767px) {
    max-width: calc(100% - 20px);
  }
`;
const CardLogo = styled.div``;

const PaymentDetails = styled.div`
  h2 {
    font-size: 24px;
    font-weight: 500;
  }
  .form-wrapper {
    display: flex;
    flex-direction: column;
    .flex-col {
      display: flex;
      gap: 20px;
      justify-content: space-between;
      max-width: 100%;
     
      img {
        width: 30px;
        height: 30px;
        position: absolute;
        right: 12px;
        top: 38px;
      }
    }
    .form-group {
      margin-bottom: 20px;
      position: relative;
      width:100%;
      text-align:center;
      label {
        display: block;
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 10px;
        text-align:left;
      }
      input {
        height: 50px;
        border: 1px solid #d9d9d9;
        padding: 5px 15px;
        font-size: 16px;
        font-weight: 400;
        width: 100%;
        box-sizing: border-box;
        &::placeholder {
          color: #d9d9d9 !important;
        }
      }
    }
    .checkbox-outer {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      input {
        width: 40px;
        height: 20px;
        cursor: pointer;
      }
      label {
        cursor: pointer;
        font-size: 16px;
        margin-bottom: 0 !important;
      }
    }
  }
  .card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 20px;
    margin: 30px 0;
    button {
      border: 1px solid #434289;
      height: 50px;
      min-width: 133px;
    }
    .cancel-btn {
      background-color: transparent;
      color: #434289;
    }
    .save-btn {
      box-shadow: 0px 4px 4px 0px #00000040;
    }
  }
`;
