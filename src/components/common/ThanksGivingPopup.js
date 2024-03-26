import React from 'react'
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import Album from "../../assets/picture.png";
import Thanks from "../../assets/thanks.svg";
export default function ThanksGivingPopup() {
  const [open, setOpen] = React.useState(false);
  const closeIcon = <span className="close-icon">Close</span>;
  return (
    <><div className="give-thanks" onClick={() => setOpen(true)}>
    <img src={Thanks} alt="Album" />
    Give Thanks
  </div>
  <Modal
    classNames={{
      modal: "give-thanks-modal",
      modalAnimationIn: 'customEnterModalAnimation',
      modalAnimationOut: 'customLeaveModalAnimation',
    }}
    center
    open={open}
    onClose={() => setOpen(false)}
    closeIcon={closeIcon}
  >
    <h2>SEND THANks</h2>

    <div className="track-info">
      <img className="album-img" src={Album} alt="icon" />
      <div>
        <h1>Track name </h1>
        <span>by Sound of Light</span>
      </div>
    </div>

    <div className="balance-info">
      <div>
        <span>Thanks coin balance</span>
        <h4>24</h4>
      </div>
      <div className="after-gift">
        <span>Balance after gift</span>
        <h4>14</h4>
      </div>
    </div>

    <form className="form-outer" action="">
      <input type="text" placeholder="$10" />
      <button className="btn btn-send">Send</button>
    </form>
  </Modal></>
  )
}
