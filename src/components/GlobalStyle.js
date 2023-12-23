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
        font-size: 22px;
    }
    h2 {
        font-size: 18px;
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
        font-weight: 500;
        line-height: 1.5;
    }
    input[type=text] {
        font-family: 'Outfit', sans-serif;
        font-size: 14px;
        border: none;
        padding: 22px;;
        :focus {
            outline: none;
            border: 2px solid #434289;
        }
    }
    textarea {
        font-family: 'Outfit', sans-serif;
        border: 1px solid gray;
        :focus {
            outline: none;
            border: 2px solid #434289;
        }
    }
`;