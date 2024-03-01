import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import CardIcon from "../../assets/credit-card.svg";
import CheckIcon from "../../assets/check.svg";

const MangePlan = () => {
  return (
    <MangePlanWrapper>
      <h1>Manage your plan</h1>
      <ManagePlanMain>
        <MngePlanRight>
          <div className="flexible-plan-card">
            <h2>Flexible Plan</h2>
            <p>
              <sup>$</sup>120<span>per year</span>
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
                VISphere ride every 3 months. 480 thanks!
              </li>
              <li>
                <img src={CheckIcon} alt="check-icon" />
                coins to gift to artists.
              </li>
            </ul>
          </div>
          <Link to="" className="PlanCta">
            Change plan
          </Link>
        </MngePlanRight>
        <MangePlanLeft>
          <div className="header">
            <h2>Payment</h2>
            <p>Your next bill is for $120 on January 24, 2024.</p>
          </div>
          <div className="payment-url">
            <img src={CardIcon} alt="card-icon" />
            <p>
              Visa ending in 8643<p> Expires: 07/2027</p>
            </p>
          </div>
          <Link to="">Update payment method</Link>
        </MangePlanLeft>
      </ManagePlanMain>
    </MangePlanWrapper>
  );
};

export default MangePlan;
const MangePlanWrapper = styled.div`
  > h1 {
    font-size: 42px;
    font-weight: 400;
    line-height: 44px;
  }
`;
const ManagePlanMain = styled.div`
  display: flex;
  flex-wrap: wrap;
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
    color: #434289;
    padding: 0 10px;
  }
`;
const MangePlanLeft = styled.div`
  margin-left: 55px;
  .header {
    h2 {
      font-size: 20px;
      font-weight: 700;
      line-height: 30px;
      margin-bottom: 0;
    }
    p {
      font-size: 16px;
      line-height: 30px;
      font-weight: 400;
      margin: 0;
    }
  }
  .payment-url {
    margin: 51px 0 33px 0;
    display: flex;
    img {
      margin-right: 10px;
    }
    p {
      font-size: 16px;
      line-height: normal;
      font-weight: 400;
      color: #434289;
      margin: 0;
    }
  }
  a {
    font-size: 16px;
    line-height: 30px;
    font-weight: 400;
    color: #434289;
    &:hover {
      color: #434289;
    }
  }
`;
