import React from "react";
import styled from "styled-components";
import ThankYou from "../../assets/icon-thanks.svg";

const CheckoutResult = () => {

  return (
    <>
      <Thankyou>
        <img src={ThankYou} alt="icon" />
        <h1>A special thank you for your generous contribution!</h1>
        <p>Your custom subscription amount is confirmed. Your support makes a significant impact on our mission. Let the music journey begin!"</p>
        <button className="save-btn">Listen now</button>

      </Thankyou>
    </>
  );
};

export default CheckoutResult;

const Thankyou = styled.div`
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align:center;
  @media(max-width:575px){
    padding:0 15px;
  }
  h1{
    @media(max-width:575px){
      font-size:30px;
    }
  }
  p{
    font-size:24px;
    font-weight:300;
    max-width:800px;
    width:100%;
    line-height: 34px;
    margin: 0;
    @media(max-width:575px){
      font-size:20px;
    }
  }
  .save-btn {
    box-shadow: 0px 4px 4px 0px #00000040;
    min-width:185px;
    font-weight:600;
    text-transform: capitalize;
    height:50px;
    margin-top: 40px;
  }
`;