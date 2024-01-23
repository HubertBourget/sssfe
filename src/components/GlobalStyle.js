import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    /* Define the font families */
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans&family=Outfit:wght@300;400;500&display=swap');

    /* Set the font family for H1, H2, and H3 */
    h1, h2, h3 {
        font-family: 'Outfit', sans-serif;
        font-weight: 500;
        line-height: 1.2;
        margin-bottom: 1rem;
        color: #434289;
    }
    h1 {
        font-size: 35px;
    }
    h2 {
        font-size: 25px;
    }
    h3 {
        font-size: 16px;
    }
    /* Set the font family for paragraphs */
    p {
        font-family: 'Outfit', sans-serif;
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 1rem;
        color: #434289;
    }
    /* Set the font family for buttons */
    button {
        font-family: 'Outfit', sans-serif;
        font-size: 14px;
        font-weight: 100;
        line-height: 1.5;
        letter-spacing: 0.7px;
    }
    input[type=text] {
        font-family: 'Outfit', sans-serif;
        font-size: 14px;
        border: 2px solid #D9D9D9;
        color: #434289;
        :focus {
            outline: none;
            border: 2px solid #434289;
        }
    }
    textarea {
        font-family: 'Outfit', sans-serif;
        border: 2px solid #D9D9D9;
        color: #434289;
        :focus {
            outline: none;
            border: 2px solid #434289;
        }
    }
    div {
        font-family: 'Outfit', sans-serif;
        color: #434289;
    }
    label {
        color: #434289;
        font-family: 'Outfit', sans-serif;
        color: #434289;
        font-size: 25px;
    }
    span {
        font-family: 'Outfit', sans-serif;
        color: #434289;
        font-size: 20px;
    }
    textarea {
        color: #434289;
        font-size: 14px;
    }
    select {
        color: #434289;
        padding: 22px;
        font-size: 14px;
    }
    input::placeholder, textarea::placeholder {
        color: #434289; /* Change to your desired color */
        opacity: 1; /* Optional: Adjust the opacity as needed */
    }
    button {
        border: none;
        color: rgb(245, 245, 245);
        background-color: rgb(67, 66, 137);
        border-radius: 33px;
        padding: 12px 30px;
        cursor: pointer;
        font-size: 20px;
        height: 6vh;
        align-items: center;
    }
`;